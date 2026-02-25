import { auth } from "@/auth";
import { routes } from "@/config/routes";
import { redirect } from "next/navigation";

const ServiceProviderLayout = async ({ children }) => {
  const session = await auth();
  if (!session?.user) {
    redirect(routes.out.login.url);
  }
  if (!session.user.serviceProvider) {
    redirect(routes.traveller.dashboard.url);
  }
  return <>{children}</>;
};

export default ServiceProviderLayout;
