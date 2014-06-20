'use strict';
var fs = require('fs');

module.exports = function(fileName, text, opts, cb) {
    if (!text) throw new Error("No data supplied");
    if (arguments.length == 2) {
        if (Object.prototype.toString.call(opts) == "[object Function]") {
            callback = opts;
        } else {
            throw new Error("Callback missing!");
        }
    }
    fs.readFile(fileName, 'utf8', function(err, data) {
        if (err) {
            return cb(err);
        } else {
            fs.unlinkSync(fileName);
            fs.writeFile(fileName, text + data, function(err, data) {
                if (err) return cb(err);
                return cb(true);
            });
        }
    });
};