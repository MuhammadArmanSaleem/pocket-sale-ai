import * as yup from "yup";

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
  }).noUnknown().required()).min(1).max(100).required().test("unique-variants", "Duplicate variants", variants => {
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
