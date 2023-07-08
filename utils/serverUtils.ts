import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const getServerUser = async () => {
  const session = await getServerSession(authOptions);
  return session?.user;
};

export const getIsAdmin = async (_user?: Session["user"]) => {
  const user = _user ?? (await getServerUser());
  return user?.role === "admin";
};
