var assert = require('assert');
var fs = require('fs');
var pf = require('./index');

describe('prepend-file', function() {
  var tmp = '.temp';

  after(function(cb) {
    fs.unlink(tmp, cb);
  });

  it('should create the file if it not yet exists.', function(cb) {
    pf(tmp, 'Hello', function(err) {
      if (err) {
        cb(err);
      }
      var content = fs.readFileSync(tmp).toString();
      assert.equal(content, 'Hello');
      cb();
    });
  });

  it('should prepend the file if it exists', function(cb) {
    pf(tmp, 'What', function(err) {
      if (err) {
        cb(err);
      }
      var content = fs.readFileSync(tmp).toString();
      assert.equal(content, 'WhatHello');
      cb();
    });
  });
});
