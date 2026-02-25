import { setJWT } from "@/app/actions/AddJWT";
import { auth, unstable_update } from "@/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  const nextCookies = await cookies();
  const session = await auth();
  if (!session || !session.user || !session.user.accessToken) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const myJWT = nextCookies.get("jwt");

  if (!myJWT) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user.accessToken}`,
        Cookie: `jwt=${myJWT.value}`,
      },
      body: JSON.stringify({ userId: session.user.userId }),
      // credentials: "include",
    },
  );

  if (!response.ok) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const responseData = await response.json();

  const updatedSession = await unstable_update({
    accessToken: responseData.accessToken,
  });
  await setJWT(null, responseData.accessToken, updatedSession.user);

  return new NextResponse(
    JSON.stringify({
      accessToken: responseData.accessToken,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
};
