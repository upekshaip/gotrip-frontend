"use server";
import CryptoJS from "crypto-js";
const { cookies } = require("next/headers");

export const setJWT = async (refreshToken, accessToken, userData) => {
  // set the refresh token in an httpOnly cookie
  const myCookies = await cookies();
  if (refreshToken) {
    myCookies.set({
      name: "jwt",
      value: refreshToken,
      httpOnly: true,
      priority: "high",
      secure: true,
      sameSite: "lax",
    });
  }
  // also set access token in a cookie (not httpOnly) for client-side use
  if (accessToken) {
    myCookies.set({
      name: "accessToken",
      value: accessToken,
      httpOnly: false,
      priority: "medium",
      secure: true,
      sameSite: "lax",
    });
  }
  // set user cookie to indicate logged in status
  if (!userData.role) {
    const role = userData.admin
      ? "admin"
      : userData.serviceProvider
        ? "serviceProvider"
        : "traveller";
    userData.role = role;
  }
  if (!userData.viewAs) {
    userData.viewAs = userData.role;
  }
  const data = CryptoJS.AES.encrypt(
    JSON.stringify(userData),
    process.env.NEXT_PUBLIC_DATA_ENCRYPTION_KEY,
  ).toString();

  myCookies.set({
    name: "user",
    value: data,
    httpOnly: false,
    priority: "low",
    secure: true,
    sameSite: "lax",
  });
};
