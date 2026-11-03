 
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import { client, db } from "@/lib/mongodb";

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  secret: process.env.BETTER_AUTH_SECRET,

  baseURL: process.env.BETTER_AUTH_URL,

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github"],
      allowDifferentEmails: false,
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },

    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },

  user: {
  additionalFields: {
    gender: {
      type: "string",
      required: false,
      input: true,
    },
    birthDate: {
      type: "string",
      required: false,
      input: true,
    },
    profession: {
      type: "string",
      required: false,
      input: true,
    },
  },
},

  plugins: [jwt()],
});
