'use strict';

module.exports.FileExistsError = FileExistsError;

function FileExistsError(message) {
  this.message = message;
  this.name = 'FileExistsError';
  Error.captureStackTrace(this, FileExistsError);
}

FileExistsError.prototype = Object.create(Error.prototype);
FileExistsError.prototype.constructor = FileExistsError;
