import { NextResponse } from "next/server";

export const GET = async (request) => {
  return new NextResponse(
    JSON.stringify({ message: "Hello from NextAuth route!" }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
};
