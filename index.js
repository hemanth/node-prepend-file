'use strict';
var assign = require('lodash.assign');
var clone = require('lodash.clone');
var fs = require('fs');

function cutTmp(src, dest, opts, cb) {
  fs.createReadStream(src, opts)
    .on('error', function(err) {
      cb(err);
    })
    .pipe(fs.createWriteStream(dest, opts))
    .on('error', function(err) {
      cb(err);
    })
    .on('finish', function() {
      fs.unlink(src, cb);
    });
}

module.exports = function(fileName, text, opts, cb) {
  if (!text) {
    throw new Error('No data supplied');
  }
  if (arguments.length === 3) {
    if (Object.prototype.toString.call(opts) === '[object Function]') {
      cb = opts;
    } else {
      throw new Error('Callback missing!');
    }
  }

  var tmp = process.env.TMPDIR + fileName;

  opts = assign({
    encoding: 'utf8',
    mode: 438
  }, opts);
  var appendOpts = clone(opts);
  appendOpts.flags = 'a';

  fs.exists(fileName, function(exists) {
    if (exists) {
      fs.writeFile(tmp, text, opts, function(err) {
        if (err) {
          cb(err);
        }

        fs.createReadStream(fileName, opts)
          .on('error', function(err) {
            cb(err);
          })
          .pipe(fs.createWriteStream(tmp, appendOpts))
          .on('error', function(err) {
            cb(err);
          })
          .on('finish', function() {
            cutTmp(tmp, fileName, opts, cb);
          });
      });
    } else {
      fs.writeFile(fileName, text, opts, function(err) {
        if (err) {
          cb(err);
        } else {
          cb();
        }
      });
    }
  });
};
