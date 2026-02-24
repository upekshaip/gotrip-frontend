import { logOut } from "@/app/actions/Logout";

export const logoutFrontend = () => {
  logOut();
  // window.location.href = routes.out.login;
};
