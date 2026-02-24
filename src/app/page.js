"use client";

import { getUserData } from "@/hooks/UseUserInfo";

export default function Home() {
  const user = getUserData();

  return <div className="">{JSON.stringify(user)}</div>;
}
