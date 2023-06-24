import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],
  theme: {
    colorScheme: "light",
  },
  callbacks: {
    session({ session, user, token }) {
      session.user.role = user.role;
      session.user.id = user.id;
      return session;
    },
  },
};
