const prependFile = require('.');
const fs = require('fs');
const test = require('ava');

const {promises: fsP} = fs;

const temporaryFile = '.temp1';
const syncTemporaryFile = '.temp2';
const shebangTemporaryFile = '.temp3';
const shebangTemporaryFileUtf8 = '.temp4';

function ignoreFailure(f) {
  try {
    f();
  } catch {
    // ignore
  }
}

function cleanupTestFiles() {
  ignoreFailure(() => fs.unlinkSync(temporaryFile));
  ignoreFailure(() => fs.unlinkSync(syncTemporaryFile));
  ignoreFailure(() => fs.unlinkSync(shebangTemporaryFile));
  ignoreFailure(() => fs.unlinkSync(shebangTemporaryFileUtf8));
}

cleanupTestFiles();

test.after.always(() => {
  cleanupTestFiles();
});

test('main', async t => {
  await prependFile(temporaryFile, 'World');
  t.is(await fsP.readFile(temporaryFile, 'utf8'), 'World');

  await prependFile(temporaryFile, 'Hello ');
  t.is(await fsP.readFile(temporaryFile, 'utf8'), 'Hello World');

  await prependFile(temporaryFile, Buffer.from('Yes '));
  t.is(await fsP.readFile(temporaryFile, 'utf8'), 'Yes Hello World');

  await prependFile(temporaryFile, Buffer.from('\uFEFF'));
  t.is(encodeURIComponent(await fsP.readFile(temporaryFile, 'utf8')), encodeURIComponent('\uFEFFYes Hello World'));

  await prependFile(temporaryFile, Buffer.from('What '));
  t.is(encodeURIComponent(await fsP.readFile(temporaryFile, 'utf8')), encodeURIComponent('\uFEFFWhat Yes Hello World'));
});

test('.sync', t => {
  prependFile.sync(syncTemporaryFile, 'World');
  t.is(fs.readFileSync(syncTemporaryFile, 'utf8'), 'World');

  prependFile.sync(syncTemporaryFile, 'Hello ');
  t.is(fs.readFileSync(syncTemporaryFile, 'utf8'), 'Hello World');

  prependFile.sync(syncTemporaryFile, Buffer.from('Yes '));
  t.is(fs.readFileSync(syncTemporaryFile, 'utf8'), 'Yes Hello World');

  prependFile.sync(syncTemporaryFile, '\uFEFF');
  t.is(encodeURIComponent(fs.readFileSync(syncTemporaryFile, 'utf8')), encodeURIComponent('\uFEFFYes Hello World'));

  prependFile.sync(syncTemporaryFile, 'What ');
  t.is(encodeURIComponent(fs.readFileSync(syncTemporaryFile, 'utf8')), encodeURIComponent('\uFEFFWhat Yes Hello World'));
});

test('shebang', async t => {
  await prependFile(shebangTemporaryFile, 'Hello World');
  t.is(await fsP.readFile(shebangTemporaryFile, 'utf8'), 'Hello World');

  await prependFile(shebangTemporaryFile, '#! /bin/shebang\n');
  t.is(await fsP.readFile(shebangTemporaryFile, 'utf8'), '#! /bin/shebang\nHello World');

  await prependFile(shebangTemporaryFile, Buffer.from('Yes '));
  t.is(await fsP.readFile(shebangTemporaryFile, 'utf8'), '#! /bin/shebang\n\nYes Hello World');

  // `prependFile()` does not recognize a BOM in the part to be appended, so we test BOM-prefixed files by using afresh one here:
  await prependFile(shebangTemporaryFileUtf8, Buffer.from('\uFEFFYes Hello World'));
  t.is(encodeURIComponent(await fsP.readFile(shebangTemporaryFileUtf8, 'utf8')), encodeURIComponent('\uFEFFYes Hello World'));

  await prependFile(shebangTemporaryFileUtf8, '#! /bin/shebang\n');
  t.is(encodeURIComponent(await fsP.readFile(shebangTemporaryFileUtf8, 'utf8')), encodeURIComponent('\uFEFF#! /bin/shebang\nYes Hello World'));

  await prependFile(shebangTemporaryFileUtf8, Buffer.from('What '));
  t.is(encodeURIComponent(await fsP.readFile(shebangTemporaryFileUtf8, 'utf8')), encodeURIComponent('\uFEFF#! /bin/shebang\n\nWhat Yes Hello World'));
});

