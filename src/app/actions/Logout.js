"use server";
import { auth, signOut } from "@/auth";
import { routes } from "@/config/routes";
import { cookies } from "next/headers";

export const logOut = async () => {
  const session = await auth();

  const myCookies = await cookies();
  myCookies.delete("jwt");
  myCookies.delete("accessToken");
  myCookies.delete("user");
  session?.user && (await signOut({ redirect: routes.out.login }));
};
