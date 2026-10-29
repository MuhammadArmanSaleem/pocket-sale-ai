import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { productDetailsSchema } = require('../.test-build/lib/validation.js');
test('product details validate identity, version and bounded fields', async () => {
  const product={productId:'00000000-0000-4000-8000-000000000001',version:'2026-10-29T08:30:00.123456+00:00',name:'Shirt',category:'',description:''};
  assert.equal(await productDetailsSchema.isValid(product,{strict:true}),true);
  for (const bad of [{...product,productId:'bad'},{...product,version:'not-a-date'},{...product,name:' '},{...product,shopId:product.productId}]) assert.equal(await productDetailsSchema.isValid(bad,{strict:true}),false);
});
