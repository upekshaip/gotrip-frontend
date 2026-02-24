import { auth } from "@/auth";
import SignupPage from "@/components/auth/Signupform";
import { routes } from "@/config/routes";
import { redirect } from "next/navigation";

export default async function Signup() {
  const session = await auth();

  if (session) {
    if (session.user.admin) {
      redirect(routes.admin.dashboard.url);
    } else if (session.user.serviceProvider) {
      redirect(routes.serviceProvider.dashboard.url);
    } else if (session.user.traveller) {
      redirect(routes.traveller.dashboard.url);
    } else {
      redirect(routes.out.login.url);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 relative">
      <SignupPage role="traveller" mode="signup" />
    </div>
  );
}
