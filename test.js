var assert = require('assert');
var fs = require('fs');
var prependFile = require('./');

describe('prependFile', function() {
  var tmp = '.temp1';

  after(function(cb) {
    fs.unlink(tmp, cb);
  });

  it('should create an empty file and have content added', function(cb) {
    prependFile(tmp, 'Hello', function(err) {
      if (err) {
        cb(err);
      }
      var fileData = fs.readFileSync(tmp).toString();
      assert.strictEqual(fileData, 'Hello');
      cb();
    });
  });

  it('should prepend data to a non empty file', function(cb) {
    prependFile(tmp, 'What', function(err) {
      if (err) {
        cb(err);
      }
      var fileData = fs.readFileSync(tmp).toString();
      assert.strictEqual(fileData, 'WhatHello');
      cb();
    });
  });

  it('should accepts buffers', function(cb) {
    var buf = new Buffer('abc', 'utf8');
    prependFile(tmp, buf, function(err) {
      if (err) {
        cb(err);
      }
      var fileData = fs.readFileSync(tmp).toString();
      assert.strictEqual(fileData, 'abcWhatHello');
      cb();
    });
  });

  it('should accepts numbers', function(cb) {
    var number = 220;
    prependFile(tmp, number, function(err) {
      if (err) {
        cb(err);
      }
      var st = fs.statSync(tmp);
      assert.strictEqual(st.mode & 0700, 0600);
      var fileData = fs.readFileSync(tmp).toString();
      assert.strictEqual(fileData, '220abcWhatHello');
      cb();
    });
  });
});

describe('prependFile.sync', function() {
  var tmp = '.temp2';

  after(function(cb) {
    fs.unlink(tmp, cb);
  });

  it('should create an empty file and have content added', function() {
    prependFile.sync(tmp, 'Hello');
    var content = fs.readFileSync(tmp).toString();
    assert.strictEqual(content, 'Hello');
  });

  it('should prepend data to a non empty file', function() {
    prependFile.sync(tmp, 'What');
    var content = fs.readFileSync(tmp).toString();
    assert.strictEqual(content, 'WhatHello');
  });

  it('should accepts buffers', function() {
    var buf = new Buffer('abc', 'utf8');
    prependFile.sync(tmp, buf);
    var fileData = fs.readFileSync(tmp).toString();
    assert.strictEqual(fileData, 'abcWhatHello');
  });

  it('should accepts numbers', function() {
    var number = 220;
    prependFile.sync(tmp, number);
    var st = fs.statSync(tmp);
    assert.strictEqual(st.mode & 0700, 0600);
    var fileData = fs.readFileSync(tmp).toString();
    assert.strictEqual(fileData, '220abcWhatHello');
  });
});
