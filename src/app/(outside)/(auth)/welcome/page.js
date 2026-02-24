import { auth } from "@/auth";
import AuthTemplate from "@/components/auth/AuthTemplate";
import WelcomeForm from "@/components/auth/WelcomeForm";
import { routes } from "@/config/routes";
import { CheckCircle2 } from "lucide-react";
import { redirect } from "next/navigation";

export default async function WelcomePage() {
  const session = await auth();

  if (session) {
    if (
      !(
        session.user.name === null &&
        session.user.dob === null &&
        session.user.gender === null &&
        session.user.phone === null
      )
    ) {
      if (session.user.admin) {
        redirect(routes.admin.dashboard.url);
      } else if (session.user.serviceProvider) {
        redirect(routes.serviceProvider.dashboard.url);
      } else if (session.user.traveller) {
        redirect(routes.traveller.dashboard.url);
      }
    }
  }
  if (!session) {
    redirect(routes.out.login.url);
  }

  return (
    <AuthTemplate
      title="Almost"
      subtitle="There!"
      description="Help us tailor your goTrip experience by providing these quick details. We use this to secure your bookings."
      accentColor="accent" // Green/Teal theme for Final Step
      sideContent={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <CheckCircle2 size={18} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">
            Account Secured & Verified
          </p>
        </div>
      }
    >
      <WelcomeForm />
    </AuthTemplate>
  );
}
