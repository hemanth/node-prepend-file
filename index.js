'use strict';
const fs = require('fs');
const stream = require('stream');
const {promisify} = require('util');
const tempWrite = require('temp-write');
const pathExists = require('path-exists');
const pipeline = promisify(stream.pipeline);
const {Transform} = stream;

function hasBOM(text) {
  return (text.toString().charCodeAt(0) === 0xFEFF);
}

function prependBOM(text) {
  return '\uFEFF' + text;
}

function stripBOM(text) {
  return text.toString().slice(1);
}

function hasHashBang(text) {
  return /^#![^\r\n]+/.test(text.toString());
}

function prependHashBang(text, bang) {
  return bang + '\n\n' + text;
}

function extractHashBang(text) {
  const m = /^(#![^\r\n]+)/.exec(text.toString());
  return m ? m[0] : '';
}

function stripHashBang(text) {
  let s = text.toString();
  const m = /^(#![^\r\n]+[\r\n]+)/.exec(s);
  if (m) {
    const bang = m[0];
    s = s.slice(bang.length);
  }

  return s;
}

module.exports = async (filename, data) => {
  if (await pathExists(filename)) {
    let bomFound = false;
    let bomPlaced = false;

    const checkStripBomTransformer = new Transform({
      transform(chunk, _, callback) {
        let fileData = chunk;

        if (!bomFound) {
          bomFound = hasBOM(fileData);
          fileData = hasBOM(fileData) ? stripBOM(fileData) : fileData;
        }

        callback(false, Buffer.from(fileData));
      }
    });

    const checkPrependBomTransformer = new Transform({
      transform(chunk, _, callback) {
        let fileData = chunk.toString();

        if (bomFound && !bomPlaced) {
          fileData = prependBOM(fileData);
          bomPlaced = true;
        }

        callback(false, Buffer.from(fileData));
      }
    });

    let bangFound = false;
    let bangPlaced = false;
    let bangCache = null;

    const checkStripHashBangTransformer = new Transform({
      transform(chunk, encoding, callback) {
        let fileData = chunk;

        if (!bangFound) {
          bangFound = hasHashBang(fileData);
          bangCache = extractHashBang(fileData);
          fileData = bangFound ? stripHashBang(fileData) : fileData;
        }

        callback(false, Buffer.from(fileData));
      }
    });

    const checkPrependHashBangTransformer = new Transform({
      transform(chunk, encoding, callback) {
        let fileData = chunk.toString();

        if (bangFound && !bangPlaced) {
          fileData = prependHashBang(fileData, bangCache);
          bangPlaced = true;
        }

        callback(false, Buffer.from(fileData));
      }
    });

    const temporaryFile = await tempWrite(data);

    await pipeline(fs.createReadStream(filename), checkStripBomTransformer, checkStripHashBangTransformer, fs.createWriteStream(temporaryFile, {flags: 'a'}));
    await pipeline(fs.createReadStream(temporaryFile), checkPrependHashBangTransformer, checkPrependBomTransformer, fs.createWriteStream(filename));

    await fs.promises.unlink(temporaryFile);
  } else {
    await fs.promises.writeFile(filename, data);
  }
};

module.exports.sync = (filename, data) => {
  if (pathExists.sync(filename)) {
    let fileData = fs.readFileSync(filename);

    data = hasBOM(fileData) ? prependBOM(data) : data;
    fileData = hasBOM(fileData) ? stripBOM(fileData) : fileData;

    fs.writeFileSync(filename, Buffer.concat([Buffer.from(data), Buffer.from(fileData)]));
  } else {
    fs.writeFileSync(filename, data);
  }
};
