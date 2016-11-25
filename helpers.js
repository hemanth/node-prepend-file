'use strict';

const fs = require('fs');
const tmp = require('tmp');
const FileExistsError = require('./file-exists-error').FileExistsError;

module.exports.createFile = createFile;
module.exports.createTempFile = createTempFile;
module.exports.fileExists = fileExists;
module.exports.maybeCallback = maybeCallback;
module.exports.writeFileContentsToFile = writeFileContentsToFile;
module.exports.writeToFile = writeToFile;

function fileExists(path) {
  return new Promise((resolve, reject) => {
    fs
      .stat(path, function (err) {
        if (err) {
          reject(new FileExistsError(err.message));
        } else {
          resolve();
        }
      });
  });
}

function createFile(path, content, options) {
  return new Promise((resolve, reject) => {
    fs
      .writeFile(path, content, options, err => {
        if (err) {
          reject(err);
        } else {
          resolve(path);
        }
      });
  });
}

function createTempFile() {
  return new Promise((resolve, reject) => {
    tmp
      .file((err, path, fd, cleanUpCallback) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            path: path,
            cleanUpCallback: cleanUpCallback
          });
        }
      });
  });
}

function writeToFile(path, data, options) {
  return new Promise((resolve, reject) => {
    fs
      .writeFile(path, data, options, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(path);
        }
      });
  });
}

function writeFileContentsToFile(source, dest, options, append) {
  append = append || false;

  const appendOptions = {
    encoding: options.encoding,
    mode: options.mode,
    flags: 'a'
  };

  return new Promise((resolve, reject) => {
    fs
      .createReadStream(source, options)
      .pipe(fs.createWriteStream(dest, append ? appendOptions : options))
      .on('error', err => {
        reject(err);
      })
      .on('finish', () => {
        resolve();
      });
  });
}

const DEBUG = process.env.NODE_DEBUG && /fs/.test(process.env.NODE_DEBUG);

function rethrow() {
  // Only enable in debug mode. A backtrace uses ~1000 bytes of heap space and is fairly slow to generate.
  if (DEBUG) {
    const backtrace = new Error();
    return function(err) {
      if (err) {
        backtrace.stack = err.name + ': ' + err.message +
          backtrace.stack.substr(backtrace.name.length);
        err = backtrace;
        throw err;
      }
    };
  }

  return function(err) {
    if (err) {
      throw err; // Forgot a callback but don't know where? Use NODE_DEBUG=fs
    }
  };
}

function maybeCallback(callback) {
  return typeof callback === 'function' ? callback : rethrow();
}
