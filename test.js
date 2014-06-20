var assert = require('assert');
var pf = require('./index');
var mockFS = require('mock-fs');

mockFS({
    foo: mockFS.file({
        content: "Hemanth",
        mode: 0400
    })
});

describe("Test suite for cani", function() {
    it("should return proper boolean values", function() {
        pf('./foo', "Hello", function(done) {
            assert(done === true);
        });
    });
});