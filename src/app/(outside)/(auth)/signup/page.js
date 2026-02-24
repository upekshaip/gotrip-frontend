import { auth } from "@/auth";
import AuthTemplate from "@/components/auth/AuthTemplate";
import SignupForm from "@/components/auth/Signupform";
import { routes } from "@/config/routes";
import { Sparkles } from "lucide-react";
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
    <AuthTemplate
      title="Join the"
      subtitle="Journey."
      description="Create an account and start exploring the world today. Your adventure begins with a single click."
      accentColor="secondary" // Purple/Secondary theme for Signup
      sideContent={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Sparkles size={18} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">
            Exclusive Traveler Perks
          </p>
        </div>
      }
    >
      <SignupForm />
    </AuthTemplate>
  );
}
