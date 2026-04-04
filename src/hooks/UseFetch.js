/* eslint-disable @next/next/no-async-client-component */
"use client";
import { logoutFrontend } from "@/hooks/Logout";
import { getUserData } from "@/hooks/UseUserInfo";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const getCookie = (name) => {
  const token = Cookies.get(name);
  return token ? decodeURIComponent(token) : null;
};

const UseFetch = async (method, path, data) => {
  try {
    const api = `${process.env.NEXT_PUBLIC_API_URL}${path}`;
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
      body: method !== "GET" ? JSON.stringify(data) : undefined,
      // credentials: "include",
    };
    const response = await fetch(api, options);
    if (response.ok) {
      // if 200 OK, return the response
      return await response.json();
    } else {
      // if 401 Unauthorized, retry to get access token onece. if still 401, logout
      if (response.status !== 401) {
        return await response.json();
      }
      // if 401 Unauthorized, try to refresh token
      else {
        const userData = getUserData();
        console.log("userData:", userData);
        if (!userData) {
          logoutFrontend();
        }
        const newAccessToken = await fetch(
          `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/auth/refresh`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getCookie("accessToken")}`,
            },
            credentials: "include",
          },
        );
        if (newAccessToken.ok) {
          const tokenData = await newAccessToken.json();
          // retry original request with new token
          options.headers.Authorization = `Bearer ${tokenData.accessToken}`;
          const originalRequest = await fetch(api, options);
          if (originalRequest.ok) {
            return await originalRequest.json();
          } else {
            toast.error("Failed to refresh token. Logging out...");
            throw new Error("Original request failed after token refresh");
            // console.error("Original request failed after token refresh");
          }
        } else {
          console.log(await newAccessToken.json());
          logoutFrontend();
          window.location.href = "/login";
        }
      }
    }
    return await response.json();
  } catch (err) {
    console.log("Fetch error:", err);
    toast.error("An error occurred while fetching data. Please try again.");
    throw err;
  }
};

export default UseFetch;
