import { auth } from "@/auth";
import { routes } from "@/config/routes";
import { redirect } from "next/navigation";

const TravellerLayout = async ({ children }) => {
  const session = await auth();
  if (!session?.user) {
    redirect(routes.out.login.url);
  }

  return <>{children}</>;
};

export default TravellerLayout;
