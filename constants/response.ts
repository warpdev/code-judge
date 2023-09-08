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
  FORBIDDEN: NextResponse.json(
    {
      error: "Forbidden",
    },
    {
      status: 403,
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
  BAD_REQUEST: (message: any = "Bad Request") =>
    NextResponse.json(
      {
        error: message,
      },
      {
        status: 400,
      },
    ),
  OK: (data: any = { success: true }) =>
    NextResponse.json(data, {
      status: data ? 200 : 500,
    }),
  CREATED: (data: any = { success: true }) =>
    NextResponse.json(data, {
      status: data ? 201 : 500,
    }),
};
