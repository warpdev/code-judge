import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      /** The user's postal address. */
      role: string;
      id: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string;
    id: string;
  }
}
