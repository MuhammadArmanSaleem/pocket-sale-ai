import "server-only";
import { getAccountAccess } from "./access";
import { createClient } from "./server";
import { adminTicketStatusSchema, supportReplySchema } from "../validation";

async function adminClient() {
  const access = await getAccountAccess();
  if (!access || access.role !== "admin") throw new Error("Access denied");
  return createClient();
}
export async function listAdminSupportTickets() {
  const client = await adminClient();
  const { data, error } = await client.from("support_tickets").select("id,shop_id,subject,status,support_messages(id,body,author_role,created_at)").order("created_at", { ascending: false }).limit(50);
  if (error || !data) throw new Error("Unable to load support tickets");
  return data;
}
export async function adminReply(input: unknown) {
  const client = await adminClient();
  const value = await supportReplySchema.validate(input, { strict: true, abortEarly: false });
  const { data: ticket, error } = await client.from("support_tickets").select("id,shop_id").eq("id", value.ticketId).maybeSingle();
  if (error || !ticket) throw new Error("Ticket not found");
  const { error: insertError } = await client.from("support_messages").insert({ shop_id: ticket.shop_id, ticket_id: ticket.id, author_role: "admin", body: value.body.trim() });
  if (insertError) throw new Error("Unable to send reply");
}
export async function setAdminTicketStatus(input: unknown) {
  const client = await adminClient();
  const value = await adminTicketStatusSchema.validate(input, { strict: true, abortEarly: false });
  const { data, error } = await client.from("support_tickets").update({status:value.status}).eq("id",value.ticketId).select("id").maybeSingle();
  if (error || !data) throw new Error("Unable to update ticket");
}
