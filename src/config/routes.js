import {
  Home,
  LogIn,
  UserPlus,
  KeyRound,
  Info,
  Mail,
  BookOpen,
  FileText,
  Shield,
  User,
  Bell,
  GraduationCap,
  CreditCard,
  LayoutDashboard,
  Users,
  School,
  FolderOpen,
  DollarSign,
  BarChart3,
  Plus,
  Edit,
  Map,
} from "lucide-react";

// Centralized route paths for students and teachers
const routes = {
  out: {
    home: "/",
    login: "/login",
    signup: "/signup",
    forgotPassword: "/forgot-password",
    about: "/about",
    contact: "/contact",
    termsAndConditions: "/terms-and-conditions",
    privacyPolicy: "/policy",
  },
  common: {
    profile: "/profile",
    notifications: "/notifications",
    courses: "/courses",
    info: "/info",
  },

  traveller: {
    welcome: "/welcome",
    dashboard: "/traveller",
    payments: "/traveller/payments",
    applyForServiceProvider: "/traveller/apply-for-service-provider",
  },
  serviceProvider: {
    dashboard: "/service-provider",
    // Service Management
    serviceManagement: "/service-provider/service-management",
    createService: "/service-provider/service-management/create",
    editService: "/service-provider/service-management/edit/:serviceId",

    // Others
    myServices: "/service-provider/my-services",
    analytics: "/service-provider/analytics",
  },
  admin: {
    dashboard: "/admin",
    travellerManagement: "/admin/traveller-management",
    serviceProviderManagement: "/admin/service-provider-management",
    serviceManagement: "/admin/service-management",
    analytics: "/admin/analytics",
  },
};

export { routes };
