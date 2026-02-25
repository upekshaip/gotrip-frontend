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
    // sameSite: "Lax",
  });
  return getUserData();
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

export const storeAccessToken = (token) => {
  Cookies.set("accessToken", token, {
    path: "/",
    expires: 1,
    sameSite: "Lax",
    secure: true,
  });
};

export const storeViewAs = (viewAs) => {
  localStorage.setItem("viewAs", viewAs || "traveller");
};

export const getViewAs = () => {
  if (typeof window === "undefined") return "traveller";
  const value = localStorage.getItem("viewAs");
  return value ? value : "traveller";
};
