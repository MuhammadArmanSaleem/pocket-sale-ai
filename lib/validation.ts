import * as yup from "yup";
import { MIN_NEW_PASSWORD_LENGTH, MAX_PASSWORD_BYTES, MAX_PRODUCT_VARIANTS } from "./constants";

// Login checks format and presence only. Password policy applies at creation,
// while authentication must be performed by the server.
export const loginSchema = yup.object({
  email: yup.string().trim().email().required(),
  password: yup.string().required(),
});

export const createProductSchema = yup.object({
  name: yup.string().trim().min(1).max(200).required(),
  category: yup.string().max(60).defined(),
  description: yup.string().max(2000).defined(),
  visible: yup.boolean().required(),
  variants: yup.array().of(yup.object({
    size: yup.string().trim().min(1).max(80).required(),
    colour: yup.string().trim().min(1).max(80).required(),
    price: yup.number().strict().positive().max(9999999999.99).test("currency", "Invalid price", value => value === undefined || Math.abs(value * 100 - Math.round(value * 100)) < 0.000001).required(),
    stock: yup.number().strict().integer().min(0).max(2147483647).required(),
  }).noUnknown().required()).min(1).max(MAX_PRODUCT_VARIANTS).required().test("unique-variants", "Duplicate variants", variants => {
    if (!variants) return true;
    if (variants.some(v => !v || typeof v.size !== "string" || typeof v.colour !== "string")) return true;
    const combinations = variants.map(v => JSON.stringify([v.size.trim().toLowerCase(), v.colour.trim().toLowerCase()]));
    return new Set(combinations).size === combinations.length;
  }),
}).noUnknown();

export const shopPolicySchema = yup.object({
  deliveryTime: yup.string().max(200).required().test("nonblank", "Required", value => Boolean(value?.trim())),
  deliveryCharge: yup.number().strict().min(0).max(9999999999.99).test("currency", "Invalid amount", value => value === undefined || Math.abs(value * 100 - Math.round(value * 100)) < 0.000001).required(),
  returnsPolicy: yup.string().max(2000).required().test("nonblank", "Required", value => Boolean(value?.trim())),
}).noUnknown();

export const supportTicketSchema = yup.object({
  subject: yup.string().max(200).required().test("nonblank", "Required", value => Boolean(value?.trim())),
  body: yup.string().max(3000).required().test("nonblank", "Required", value => Boolean(value?.trim())),
}).noUnknown();
export const supportReplySchema = yup.object({
  ticketId: yup.string().uuid().required(),
  body: yup.string().max(3000).required().test("nonblank", "Required", value => Boolean(value?.trim())),
}).noUnknown();

export const adminTicketStatusSchema = yup.object({
  ticketId: yup.string().uuid().required(),
  status: yup.mixed<"open" | "waiting" | "resolved">().oneOf(["open", "waiting", "resolved"]).required(),
}).noUnknown();

export const passwordChangeSchema = yup.object({
  currentPassword: yup.string().required().max(1024),
  newPassword: yup.string().required().min(MIN_NEW_PASSWORD_LENGTH).test("bytes", "Password too long", value => value === undefined || new TextEncoder().encode(value).length <= MAX_PASSWORD_BYTES),
  confirmPassword: yup.string().required().oneOf([yup.ref("newPassword")]),
}).noUnknown();

export const ownerProvisionSchema = yup.object({
  email: yup.string().trim().email().max(254).required(),
  password: yup.string().required().min(MIN_NEW_PASSWORD_LENGTH).test("bytes", "Password too long", value => value === undefined || new TextEncoder().encode(value).length <= MAX_PASSWORD_BYTES),
  ownerName: yup.string().trim().max(120).required(),
  shopName: yup.string().trim().max(160).required(),
  phone: yup.string().trim().matches(/^\+?[0-9]{7,15}$/).required(),
}).noUnknown();
export const previewOwnerSchema = ownerProvisionSchema.pick(["email", "password", "ownerName", "shopName"]);

export const productVisibilitySchema = yup.object({
  productId: yup.string().uuid().required(),
  visible: yup.boolean().strict().required(),
}).noUnknown();

export const productDetailsSchema = yup.object({
  productId: yup.string().uuid().required(),
  version: yup.string().datetime({ allowOffset: true }).required(),
  name: yup.string().max(200).required().test("nonblank", "Required", value => Boolean(value?.trim())),
  category: yup.string().max(60).defined(),
  description: yup.string().max(2000).defined(),
}).noUnknown();

export const variantEditSchema = yup.object({
  variantId: yup.string().uuid().required(),
  productId: yup.string().uuid().required(),
  version: yup.string().datetime({ allowOffset: true }).required(),
  size: yup.string().max(80).required().test("nonblank", "Required", value => Boolean(value?.trim())),
  colour: yup.string().max(80).required().test("nonblank", "Required", value => Boolean(value?.trim())),
  price: yup.number().strict().positive().max(9999999999.99).test("currency", "Invalid price", value => value === undefined || Math.abs(value * 100 - Math.round(value * 100)) < 0.000001).required(),
  stock: yup.number().strict().integer().min(0).max(2147483647).required(),
}).noUnknown();

export const variantRemoveSchema = variantEditSchema.pick(["variantId", "productId", "version"]).noUnknown();

export const variantAddSchema = variantEditSchema.omit(["variantId", "version"]).noUnknown();
