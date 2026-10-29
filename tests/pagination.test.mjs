import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { parseCataloguePage } = require('../.test-build/lib/pagination.js');
test('catalogue page parsing rejects invalid and unbounded values', () => {
  for (const value of [undefined, '', '0', '-1', '1.5', '01', '10001', '1e3', ['2']]) assert.equal(parseCataloguePage(value), 1);
  assert.equal(parseCataloguePage('2'), 2);
  assert.equal(parseCataloguePage('10000'), 10000);
});
