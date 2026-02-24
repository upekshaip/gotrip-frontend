import { setJWT } from "@/app/actions/AddJWT";
import { auth, unstable_update } from "@/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const PATCH = async (request) => {
  const userData = await request.json();
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
    `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.user.accessToken}`,
        Cookie: `jwt=${myJWT.value}`,
      },
      body: JSON.stringify({
        name: userData.name,
        email: session.user.email,
        phone: userData.phone,
        gender: userData.gender,
        dob: userData.dob,
        // address is optional
        // address: userData.address ? userData.address : undefined,
      }),
      credentials: "include",
    },
  );

  const responseData = await response.json();
  if (!response.ok) {
    return new NextResponse(
      JSON.stringify({ message: responseData.message || "Error" }),
      {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
  const { accessToken, user } = userData;

  const updatedSession = await unstable_update({
    name: userData.name,
    phone: userData.phone,
    gender: userData.gender,
    dob: userData.dob,
    // address: userData.address ? userData.address : undefined,
  });
  await setJWT(null, accessToken, updatedSession.user);

  return new NextResponse(JSON.stringify(responseData), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
