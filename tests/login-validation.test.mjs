import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { loginSchema } = require('../.test-build/lib/validation.js');

test('login rejects malformed email and empty password', async () => {
  assert.equal(await loginSchema.isValid({ email: '12345', password: 'test' }), false);
  assert.equal(await loginSchema.isValid({ email: 'owner@example.com', password: '' }), false);
  assert.equal(await loginSchema.isValid({ email: 'owner@example.com', password: 'test' }), true);
});
