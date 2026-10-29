import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const {variantEditSchema}=require('../.test-build/lib/validation.js');
test('variant edit validates stock, price, identity and version',async()=>{
  const id='00000000-0000-4000-8000-000000000001';
  const variant={variantId:id,productId:id,version:'2026-10-29T08:30:00.123456+00:00',size:'M',colour:'Blue',price:300,stock:0};
  assert.equal(await variantEditSchema.isValid(variant,{strict:true}),true);
  for(const bad of [{...variant,stock:-1},{...variant,stock:0.5},{...variant,price:0},{...variant,colour:' '},{...variant,version:'old'},{...variant,shopId:id}]) assert.equal(await variantEditSchema.isValid(bad,{strict:true}),false);
});
