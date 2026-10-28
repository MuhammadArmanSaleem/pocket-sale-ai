import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { parseAccess } = require('../.test-build/lib/access.js');

test('access parsing fails closed for missing, ambiguous and malformed data', () => {
  for (const rows of [null, [], [{account_role: 'admin'}], [{account_role: 'owner', shop_id: 'a', shop_active: 'true'}], [{}, {}]]) {
    assert.deepEqual(parseAccess(rows), {role: 'unprovisioned'});
  }
});
test('access parsing separates admin, active owner and suspended owner', () => {
  assert.deepEqual(parseAccess([{account_role: 'admin', shop_id: null, shop_active: true}]), {role: 'admin'});
  assert.deepEqual(parseAccess([{account_role: 'owner', shop_id: 'id', shop_active: true}]), {role: 'owner', shopId: 'id'});
  assert.deepEqual(parseAccess([{account_role: 'owner', shop_id: 'id', shop_active: false}]), {role: 'suspended'});
});
