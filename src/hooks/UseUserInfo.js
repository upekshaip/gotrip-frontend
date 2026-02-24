"use client";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";

export const storeUserData = (userData) => {
  const data = JSON.stringify(userData);

  const encrypted = CryptoJS.AES.encrypt(
    data,
    process.env.NEXT_PUBLIC_DATA_ENCRYPTION_KEY,
  ).toString();

  // Store cookie safely using js-cookie
  Cookies.set("user", encodeURIComponent(encrypted), {
    path: "/",
    expires: 1, // 1 day (you can change this)
    sameSite: "Lax",
  });
};

export const getUserData = () => {
  const encrypted = Cookies.get("user");
  if (!encrypted) return null;

  try {
    const bytes = CryptoJS.AES.decrypt(
      decodeURIComponent(encrypted),
      process.env.NEXT_PUBLIC_DATA_ENCRYPTION_KEY,
    );

    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (e) {
    console.error("User decryption failed", e);
    return null;
  }
};
