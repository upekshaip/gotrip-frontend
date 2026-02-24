import { auth } from "@/auth";
import { routes } from "@/config/routes";
import { redirect } from "next/navigation";

const TravellerLayout = async ({ children }) => {
  return <>{children}</>;
};

export default TravellerLayout;
