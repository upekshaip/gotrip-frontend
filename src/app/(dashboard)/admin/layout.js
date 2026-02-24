import { auth } from "@/auth";
import { routes } from "@/config/routes";
import { redirect } from "next/navigation";

const AdminLayout = async ({ children }) => {
  const session = await auth();
  if (!session?.user) {
    redirect(routes.out.login.url);
  }
  if (!session.user.admin) {
    redirect(routes.serviceProvider.dashboard.url);
  }
  return <>{children}</>;
};

export default AdminLayout;
