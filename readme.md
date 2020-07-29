#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

> Prepend data to a file, creating it if it doesn't exist.

## Install

```sh
npm install prepend-file
```

## Usage

```js
const prependFile = require('prepend-file');

(async () => {
  await prependFile('message.txt', 'some data');
});
```

## API

### prependFile(filename, data)

### prependFile.sync(filename, data)

#### filename

Type: `string`

The file to prepend the `data` to.

#### data

Type: `string | Buffer`

The data to prepend.

[npm-image]: https://badge.fury.io/js/prepend-file.svg
[npm-url]: https://npmjs.org/package/prepend-file
[travis-image]: https://travis-ci.org/hemanth/node-prepend-file.svg?branch=master
[travis-url]: https://travis-ci.org/hemanth/node-prepend-file
[daviddm-image]: https://david-dm.org/hemanth/node-prepend-file.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/hemanth/node-prepend-file
[coveralls-image]: https://coveralls.io/repos/hemanth/node-prepend-file/badge.svg
[coveralls-url]: https://coveralls.io/r/hemanth/node-prepend-file
