import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const getServerUser = async () => {
  const session = await getServerSession(authOptions);
  return session?.user;
};
