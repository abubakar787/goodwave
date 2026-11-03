import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { client, db } from "@/lib/mongodb";

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  secret: process.env.BETTER_AUTH_SECRET,

  baseURL: process.env.BETTER_AUTH_URL,

  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      gender: {
        type: "string",
        required: true,
        input: true,
      },
      birthDate: {
        type: "string",
        required: true,
        input: true,
      },
      profession: {
        type: "string",
        required: true,
        input: true,
      },
    },
  },
});