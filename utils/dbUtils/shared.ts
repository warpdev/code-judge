import { Session } from "next-auth";

export const publicOrCreatedBy = (user?: Session["user"]) => [
  {
    isPublic: true,
  },
  {
    createdBy: user?.id,
  },
];