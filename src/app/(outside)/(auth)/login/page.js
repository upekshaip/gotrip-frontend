import { auth } from "@/auth";
import AuthTemplate from "@/components/auth/AuthTemplate";
import LoginForm from "@/components/auth/Loginform";
import { routes } from "@/config/routes";
import { CheckCircle2, Globe } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Login() {
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
    <AuthTemplate
      title="Welcome"
      subtitle="Back."
      description="Log in to access your bookings, saved destinations, and travel history."
      accentColor="primary" // Blue theme for Login
      sideContent={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Globe size={18} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">
            Exploring 190+ Countries
          </p>
        </div>
      }
    >
      <LoginForm />
    </AuthTemplate>
  );
}
