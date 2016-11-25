'use strict';

const fs = require('fs');
const util = require('util');
const tmp = require('tmp');

const helpers = require('./helpers');
const fileExists = helpers.fileExists;
const createFile = helpers.createFile;
const createTempFile = helpers.createTempFile;
const writeToFile = helpers.writeToFile;
const writeFileContentsToFile = helpers.writeFileContentsToFile;
const maybeCallback = helpers.maybeCallback;

const FileExistsError = require('./file-exists-error').FileExistsError;

module.exports = function prependFile(path, data, options) {
  const callback = maybeCallback(arguments[arguments.length - 1]);

  if (typeof options === 'function' || !options) {
    options = {
      encoding: 'utf8',
      mode: 438 /*=0666*/
    };
  } else if (util.isString(options)) {
    options = {
      encoding: options,
      mode: 438
    };
  } else if (!util.isObject(options)) {
    throw new TypeError('Bad arguments');
  }

  fileExists(path)
    .then(() => createTempFile())
    .then(tempFile =>
      writeToFile(tempFile.path, data, options)
        .then(() => writeFileContentsToFile(path, tempFile.path, options, true))
        .then(() => writeFileContentsToFile(tempFile.path, path, options))
        .then(() => tempFile.cleanUpCallback())
    )
    .catch(FileExistsError => createFile(path, data, options))
    .then(pathToWriteTo => callback())
    .catch(err => callback(err));
};


module.exports.sync = function sync(path, data, options) {
  if (!options) {
    options = {
      encoding: 'utf8',
      mode: 438 /*=0666*/
    };
  } else if (util.isString(options)) {
    options = {
      encoding: options,
      mode: 438
    };
  } else if (!util.isObject(options)) {
    throw new TypeError('Bad arguments');
  }

  var currentFileData;

  var appendOptions = {
    encoding: options.encoding,
    mode: options.mode,
    flags: 'w'
  };

  try {
    currentFileData = fs.readFileSync(path, options);
  } catch (err) {
    currentFileData = '';
  }

  fs.writeFileSync(path, data + currentFileData, appendOptions);
};
