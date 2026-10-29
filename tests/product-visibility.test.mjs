import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { productVisibilitySchema } = require('../.test-build/lib/validation.js');
test('visibility input requires UUID and actual boolean', async () => {
  const productId='00000000-0000-4000-8000-000000000001';
  assert.equal(await productVisibilitySchema.isValid({productId,visible:false},{strict:true}),true);
  assert.equal(await productVisibilitySchema.isValid({productId,visible:'false'},{strict:true}),false);
  assert.equal(await productVisibilitySchema.isValid({productId:'bad',visible:true},{strict:true}),false);
  assert.equal(await productVisibilitySchema.isValid({productId,visible:true,shopId:productId},{strict:true}),false);
});
