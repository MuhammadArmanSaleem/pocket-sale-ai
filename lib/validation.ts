import * as yup from "yup";

// Login checks format and presence only. Password policy applies at creation,
// while authentication must be performed by the server.
export const loginSchema = yup.object({
  email: yup.string().trim().email().required(),
  password: yup.string().required(),
});
