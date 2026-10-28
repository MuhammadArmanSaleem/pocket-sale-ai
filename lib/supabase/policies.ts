import "server-only";
import { getAccountAccess } from "./access";
import { createClient } from "./server";
import { shopPolicySchema } from "../validation";
import type { ShopPolicyInput } from "../types";

async function ownerContext() {
  const access = await getAccountAccess();
  if (!access || access.role !== "owner") throw new Error("Access denied");
  return { shopId: access.shopId, client: await createClient() };
}
export async function loadShopPolicy(): Promise<ShopPolicyInput | null> {
  const { shopId, client } = await ownerContext();
  const { data, error } = await client.from("shop_policies").select("delivery_time,delivery_charge,returns_policy").eq("shop_id", shopId).maybeSingle();
  if (error) throw new Error("Unable to load shop policies");
  if (!data) return null;
  return { deliveryTime: data.delivery_time, deliveryCharge: Number(data.delivery_charge), returnsPolicy: data.returns_policy };
}
export async function saveShopPolicy(input: unknown): Promise<void> {
  const { shopId, client } = await ownerContext();
  const value = await shopPolicySchema.validate(input, { abortEarly: false, strict: true });
  const { data, error } = await client.from("shop_policies").update({ delivery_time: value.deliveryTime.trim(), delivery_charge: value.deliveryCharge, returns_policy: value.returnsPolicy.trim() }).eq("shop_id", shopId).select("shop_id").maybeSingle();
  if (error || !data) throw new Error("Unable to save shop policies");
}
