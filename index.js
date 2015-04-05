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

module.exports = function(filename, data, opts, cb) {
  if (typeof filename !== 'string') {
    throw new TypeError('path must be a string');
  }
  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  } else {
    cb = cb || cb;
  }

  var tmp = process.env.TMPDIR + filename;

  opts = assign({
    encoding: 'utf8',
    mode: 438
  }, opts);
  var appendOpts = clone(opts);
  appendOpts.flags = 'a';

  fs.exists(filename, function(exists) {
    if (exists) {
      fs.writeFile(tmp, data, opts, function(err) {
        if (err) {
          cb(err);
        }

        fs.createReadStream(filename, opts)
          .on('error', function(err) {
            cb(err);
          })
          .pipe(fs.createWriteStream(tmp, appendOpts))
          .on('error', function(err) {
            cb(err);
          })
          .on('finish', function() {
            cutTmp(tmp, filename, opts, cb);
          });
      });
    } else {
      fs.writeFile(filename, data, opts, function(err) {
        if (err) {
          cb(err);
        } else {
          cb();
        }
      });
    }
  });
};
