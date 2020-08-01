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

module.exports = async (filename, data) => {
  let bomFound = false;
  let bomPlaced = false;

  const checkStripBomTransformer = new Transform({
    transform(chunk, encoding, callback) {
      let fileData = chunk;

      if (!bomFound) {
        bomFound = hasBOM(fileData);
        fileData = hasBOM(fileData) ? stripBOM(fileData) : fileData;
      }

      callback(false, Buffer.from(fileData));
    }
  });

  const checkPrependBomTransformer = new Transform({
    transform(chunk, encoding, callback) {
      let fileData = chunk.toString();

      if (bomFound && !bomPlaced) {
        fileData = prependBOM(fileData);
        bomPlaced = true;
      }

      callback(false, Buffer.from(fileData));
    }
  });

  if (await pathExists(filename)) {
    const temporaryFile = await tempWrite(data);

    await pipeline(fs.createReadStream(filename), checkStripBomTransformer, fs.createWriteStream(temporaryFile, {flags: 'a'}));
    await pipeline(fs.createReadStream(temporaryFile), checkPrependBomTransformer, fs.createWriteStream(filename));

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
