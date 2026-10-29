import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { createProductSchema } = require('../.test-build/lib/validation.js');
const product = {name:'Shirt',category:'Clothes',description:'',visible:true,variants:[{size:'M',colour:'Blue',price:20.5,stock:0}]};
test('product validation accepts valid variants and rejects invalid stock or price', async () => {
  assert.equal(await createProductSchema.isValid(product), true);
  assert.equal(await createProductSchema.isValid({...product, variants:[{...product.variants[0], stock:1.5}]}), false);
  assert.equal(await createProductSchema.isValid({...product, variants:[{...product.variants[0], price:0}]}), false);
  assert.equal(await createProductSchema.isValid({...product, variants:[{}]}), false);
});
test('product validation rejects duplicate combinations irrespective of case and whitespace', async () => {
  assert.equal(await createProductSchema.isValid({...product, variants:[product.variants[0], {...product.variants[0],size:' m ',colour:' BLUE '}]}), false);
});
