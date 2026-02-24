import { auth } from "@/auth";
import DashLayout from "@/components/dashboard/DashLayout";
import { routes } from "@/config/routes";
import { redirect } from "next/navigation";

const DashboardLayout = async ({ children }) => {
  const session = await auth();
  if (!session?.user) {
    redirect(routes.out.login.url);
  }

  return <DashLayout role={session.user.role}>{children}</DashLayout>;
};

export default DashboardLayout;
