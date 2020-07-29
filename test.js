const prependFile = require('.');
const fs = require('fs');
const test = require('ava');

const {promises: fsP} = fs;

const temporaryFile = '.temp1';
const syncTemporaryFile = '.temp2';

test.after.always(async () => {
  await fsP.unlink(temporaryFile);
  await fsP.unlink(syncTemporaryFile);
});

test('main', async t => {
  await prependFile(temporaryFile, 'World');
  t.is(await fsP.readFile(temporaryFile, 'utf8'), 'World');

  await prependFile(temporaryFile, 'Hello ');
  t.is(await fsP.readFile(temporaryFile, 'utf8'), 'Hello World');

  await prependFile(temporaryFile, Buffer.from('Yes '));
  t.is(await fsP.readFile(temporaryFile, 'utf8'), 'Yes Hello World');
});

test('.sync', t => {
  prependFile.sync(syncTemporaryFile, 'World');
  t.is(fs.readFileSync(syncTemporaryFile, 'utf8'), 'World');

  prependFile.sync(syncTemporaryFile, 'Hello ');
  t.is(fs.readFileSync(syncTemporaryFile, 'utf8'), 'Hello World');

  prependFile.sync(syncTemporaryFile, Buffer.from('Yes '));
  t.is(fs.readFileSync(syncTemporaryFile, 'utf8'), 'Yes Hello World');
});
