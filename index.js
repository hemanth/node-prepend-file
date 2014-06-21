'use strict';
var fs = require('fs');

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
    fs.readFile(fileName, 'utf8', function(err, data) {
        if (err) {
            cb(err);
        } else {
            fs.unlinkSync(fileName);
            fs.writeFile(fileName, text + data, function(err) {
                if (err) {
                    cb(err);
                } else {
                    cb(true);
                }

            });
        }
    });
};