import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { parseCatalogueSearch, cataloguePageHref } = require('../.test-build/lib/pagination.js');

test('catalogue search is bounded and survives pagination links', () => {
  assert.equal(parseCatalogueSearch('  cotton shirt  '), 'cotton shirt');
  assert.equal(parseCatalogueSearch('x'.repeat(101)), '');
  assert.equal(parseCatalogueSearch(['multiple', 'values']), '');
  assert.equal(parseCatalogueSearch('bad\u0000input'), '');
  assert.equal(cataloguePageHref(2, 'kurta & شلوار'), '/live?page=2&q=kurta+%26+%D8%B4%D9%84%D9%88%D8%A7%D8%B1#products');
});
const { parseCataloguePage } = require('../.test-build/lib/pagination.js');
test('catalogue page parsing rejects invalid and unbounded values', () => {
  for (const value of [undefined, '', '0', '-1', '1.5', '01', '10001', '1e3', ['2']]) assert.equal(parseCataloguePage(value), 1);
  assert.equal(parseCataloguePage('2'), 2);
  assert.equal(parseCataloguePage('10000'), 10000);
});
