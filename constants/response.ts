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
  BAD_REQUEST: (message: any = "") =>
    NextResponse.json(
      {
        error: message,
      },
      {
        status: 400,
      },
    ),
  OK: (data: any = null) =>
    NextResponse.json(data, {
      status: 200,
    }),
  CREATED: (data: any = null) =>
    NextResponse.json(data, {
      status: 201,
    }),
};
