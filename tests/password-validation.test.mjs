import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { passwordChangeSchema } = require('../.test-build/lib/validation.js');
test('password change requires a current password and matching bounded new password', async () => {
  const input = {currentPassword:'old-password',newPassword:'longer password',confirmPassword:'longer password'};
  assert.equal(await passwordChangeSchema.isValid(input,{strict:true}), true);
  assert.equal(await passwordChangeSchema.isValid({...input,currentPassword:''},{strict:true}), false);
  assert.equal(await passwordChangeSchema.isValid({...input,newPassword:'short',confirmPassword:'short'},{strict:true}), false);
  assert.equal(await passwordChangeSchema.isValid({...input,confirmPassword:'different value'},{strict:true}), false);
  assert.equal(await passwordChangeSchema.isValid({...input,newPassword:'ا'.repeat(40),confirmPassword:'ا'.repeat(40)},{strict:true}), false);
});
