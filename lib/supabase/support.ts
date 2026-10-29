import "server-only";
import { getAccountAccess } from "./access";
import { createClient } from "./server";
import { supportTicketSchema, supportReplySchema } from "../validation";

async function ownerContext() {
  const access = await getAccountAccess();
  if (!access || access.role !== "owner") throw new Error("Access denied");
  return { shopId: access.shopId, client: await createClient() };
}
export async function listSupportTickets() {
  const { shopId, client } = await ownerContext();
  const { data, error } = await client.from("support_tickets").select("id,subject,status,support_messages(id,body,author_role,created_at)").eq("shop_id", shopId).order("created_at", { ascending: false }).limit(50);
  if (error || !data) throw new Error("Unable to load support requests");
  return data;
}
export async function createSupportTicket(input: unknown): Promise<void> {
  const { shopId, client } = await ownerContext();
  const value = await supportTicketSchema.validate(input, { strict: true, abortEarly: false });
  const { error } = await client.rpc("create_support_ticket", { target_shop: shopId, ticket_subject: value.subject.trim(), first_message: value.body.trim() });
  if (error) throw new Error("Unable to create support request");
}
export async function replyToSupportTicket(input: unknown): Promise<void> {
  const { shopId, client } = await ownerContext();
  const value = await supportReplySchema.validate(input, { strict: true, abortEarly: false });
  const { error } = await client.from("support_messages").insert({ shop_id: shopId, ticket_id: value.ticketId, author_role: "owner", body: value.body.trim() });
  if (error) throw new Error("Unable to send support reply");
}
