import { NextResponse } from "next/server";

export const ResTypes = {
  NOT_AUTHORIZED: NextResponse.json(
    {
      error: "Not authorized",
    },
    {
      status: 401,
    },
  ),
  OTHER_ERROR: NextResponse.json(
    {
      error: "Something went wrong",
    },
    {
      status: 500,
    },
  ),
  NOT_FOUND: (message: string) =>
    NextResponse.json(
      {
        error: message,
      },
      {
        status: 404,
      },
    ),
  BAD_REQUEST: (message: string) =>
    NextResponse.json(
      {
        error: message,
      },
      {
        status: 400,
      },
    ),
};
