'use strict';
const fs = require('fs');
const {promisify} = require('util');
const tempWrite = require('temp-write');
const pathExists = require('path-exists');
const pipeline = promisify(require('stream').pipeline);

module.exports = async (filename, data) => {
  if (await pathExists(filename)) {
    const temporaryFile = await tempWrite(data);

    await pipeline(fs.createReadStream(filename), fs.createWriteStream(temporaryFile, {flags: 'a'}));
    await pipeline(fs.createReadStream(temporaryFile), fs.createWriteStream(filename));

    await fs.promises.unlink(temporaryFile);
  } else {
    await fs.promises.writeFile(filename, data);
  }
};

module.exports.sync = (filename, data) => {
  if (pathExists.sync(filename)) {
    fs.writeFileSync(filename, Buffer.concat([Buffer.from(data), fs.readFileSync(filename)]));
  } else {
    fs.writeFileSync(filename, data);
  }
};
