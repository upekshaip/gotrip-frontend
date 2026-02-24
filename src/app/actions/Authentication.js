"use server";
import { signIn } from "@/auth";
import { setJWT } from "@/app/actions/AddJWT";
import { redirect } from "next/navigation";
import { routes } from "@/config/routes";

export const login = async (email, password) => {
  if (!email || !password) {
    return redirect(`${routes.out.login.url}?error=Missing email or password`);
  }

  const api = process.env.NEXT_PUBLIC_API_URL;
  console.log(api);
  const response = await fetch(`${api}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    mode: "cors",
    body: JSON.stringify({
      email: email,
      password: password,
    }),
    credentials: "include",
  });

  if (!response.ok) {
    const msg = await response.json();
    console.error("Login failed:", msg);
    return redirect(`${routes.out.login.url}?error=${msg.message}`);
  }
  if (response.ok) {
    let userData = await response.json();
    // return userData;
    const { refreshToken, accessToken, user } = userData;

    const userRole = user.admin
      ? "admin"
      : user.serviceProvider
        ? "serviceProvider"
        : "traveller";

    await setJWT(refreshToken, accessToken, {
      ...{ ...user, accessToken },
      role: userRole,
      viewAs: userRole,
    });

    const result = await signIn("credentials", {
      userData: JSON.stringify({
        ...{ ...user, accessToken },
        role: userRole,
        id: userData.userId,
      }),
    });
    console.log(result);
  }
};

export const signup = async (email, password) => {
  if (!email || !password) {
    return redirect(`${routes.out.signup.url}?error=Missing email or password`);
  }

  const api = process.env.NEXT_PUBLIC_API_URL;
  const response = await fetch(`${api}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    mode: "cors",
    body: JSON.stringify({
      email: email,
      password: password,
    }),
    credentials: "include",
  });

  if (!response.ok) {
    const msg = await response.json();
    console.error("Signup failed:", msg);
    return redirect(`${routes.out.signup.url}?error=${msg.message}`);
  }
  if (response.ok) {
    const userData = await response.json();
    // return userData;
    const { refreshToken, accessToken, user } = userData;
    const userRole = user.admin
      ? "admin"
      : userData.serviceProvider
        ? "serviceProvider"
        : "traveller";

    await setJWT(refreshToken, accessToken, {
      ...{ ...user, accessToken },
      role: userRole,
      viewAs: userRole,
    });

    const result = await signIn("credentials", {
      userData: JSON.stringify({
        ...{ ...user, accessToken },
        role: userRole,
        id: userData.userId,
      }),
    });
    console.log(result);
  }
};

export const formSignUp = async (email, password) => {
  await signup(email, password);
};

export const formLogin = async (email, password) => {
  await login(email, password);
};
