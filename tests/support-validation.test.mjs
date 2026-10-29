import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { supportTicketSchema, supportReplySchema } = require('../.test-build/lib/validation.js');
test('support requires nonblank and bounded text and a valid ticket id', async () => {
  assert.equal(await supportTicketSchema.isValid({subject:'Help', body:'Question'}, {strict:true}), true);
  assert.equal(await supportTicketSchema.isValid({subject:'Help', body:'  '}, {strict:true}), false);
  assert.equal(await supportTicketSchema.isValid({subject:'Help', body:'x'.repeat(3001)}, {strict:true}), false);
  assert.equal(await supportReplySchema.isValid({ticketId:'wrong',body:'Answer'}, {strict:true}), false);
  assert.equal(await supportReplySchema.isValid({ticketId:'00000000-0000-4000-8000-000000000001',body:'Answer'}, {strict:true}), true);
});
test('admin ticket status accepts only known states and valid ticket ids', async () => {
  const { adminTicketStatusSchema } = require('../.test-build/lib/validation.js');
  const ticketId = '00000000-0000-4000-8000-000000000001';
  assert.equal(await adminTicketStatusSchema.isValid({ticketId,status:'resolved'}, {strict:true}), true);
  assert.equal(await adminTicketStatusSchema.isValid({ticketId,status:'deleted'}, {strict:true}), false);
});
