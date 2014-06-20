# prepend-file [![Build Status](https://travis-ci.org/hemanth/node-prepend-file.svg?branch=master)](https://travis-ci.org/hemanth/node-prepend-file)

>Prepend data to a file.


## Install

```sh
$ npm install --save prepend-file
```

## Usage

##### Node.js

```js
var pf = require('prepend-file');

pf('/etc/passwd', 'perms', function(done){
	if(done){
		console.log("Data prepended!");
	}
})
```
## API

```
pf(filename, data, [options], callback)

    * filename String
    * data String | Buffer
    * options Object
        encoding String | Null default = 'utf8'
        mode Number default = 438 (aka 0666 in Octal)
        flag String default = 'w'
    * callback Function
```

## License

MIT © [Hemanth.HM](http://h3manth.com)
