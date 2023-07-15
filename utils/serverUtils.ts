import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Problem } from "@prisma/client";

export const getServerUser = async () => {
  const session = await getServerSession(authOptions);
  return session?.user;
};

export const getIsAdmin = async (_user?: Session["user"]) => {
  const user = _user ?? (await getServerUser());
  return user?.role === "admin";
};

export const getIsMyProblem = (
  problem: Problem | null,
  user?: Session["user"],
): problem is Problem => {
  return !!problem && problem.createdBy === user?.id;
};

export const isNullProblem = (problem?: Problem): problem is Problem => {
  return !problem;
};
