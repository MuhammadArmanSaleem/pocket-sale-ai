import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { shopPolicySchema } = require('../.test-build/lib/validation.js');
const policy = {deliveryTime:'2 days',deliveryCharge:0,returnsPolicy:'Within a week'};
test('policy accepts zero delivery charge but rejects invalid fields', async () => {
  assert.equal(await shopPolicySchema.isValid(policy, {strict:true}), true);
  for (const bad of [{...policy,deliveryTime:'  '},{...policy,deliveryCharge:-1},{...policy,deliveryCharge:1.001},{...policy,returnsPolicy:''}])
    assert.equal(await shopPolicySchema.isValid(bad, {strict:true}), false);
});
