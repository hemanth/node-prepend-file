var assert = require('assert');
var fs = require('fs');
var pf = require('./');

describe('prependFile', function() {
  var tmp = '.temp';

  after(function(cb) {
    fs.unlink(tmp, cb);
  });

  it('should create the file if it not yet exists', function(cb) {
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

describe('prependFile.sync', function() {
  var tmp = '.temp';

  after(function(cb) {
    fs.unlink(tmp, cb);
  });

  it('should create the file if it not yet exists', function() {
    pf.sync(tmp, 'Hello');
    var content = fs.readFileSync(tmp).toString();
    assert.equal(content, 'Hello');
  });

  it('should prepend the file if it exists', function() {
    pf.sync(tmp, 'What');
    var content = fs.readFileSync(tmp).toString();
    assert.equal(content, 'WhatHello');
  });
});
