import { auth } from "@/auth";
import { routes } from "@/config/routes";
import { redirect } from "next/navigation";

const ServiceProviderLayout = async ({ children }) => {
  const session = await auth();
  if (!session?.user) {
    redirect(routes.out.login);
  }
  if (!session.user.isServiceProvider) {
    redirect(routes.student.dashboard);
  }
  return <>{children}</>;
};

export default ServiceProviderLayout;
