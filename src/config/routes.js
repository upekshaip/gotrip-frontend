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
    home: {
      name: "Home",
      url: "/",
      icon: <Home className="h-5 w-5" />,
    },
    login: {
      name: "Log In",
      url: "/login",
      icon: <LogIn className="h-5 w-5" />,
    },
    signup: {
      name: "Sign Up",
      url: "/signup",
      icon: <UserPlus className="h-5 w-5" />,
    },
    forgotPassword: {
      name: "Forgot Password",
      url: "/forgot-password",
      icon: <KeyRound className="h-5 w-5" />,
    },
    about: {
      name: "About",
      url: "/about",
      icon: <Info className="h-5 w-5" />,
    },
    contact: {
      name: "Contact",
      url: "/contact",
      icon: <Mail className="h-5 w-5" />,
    },
    termsAndConditions: {
      name: "Terms and Conditions",
      url: "/terms-and-conditions",
      icon: <FileText className="h-5 w-5" />,
    },
    privacyPolicy: {
      name: "Privacy Policy",
      url: "/policy",
      icon: <Shield className="h-5 w-5" />,
    },
  },
  common: {
    profile: {
      name: "Profile",
      url: "/profile",
      icon: <User className="h-5 w-5" />,
      menu: true,
    },
    info: {
      name: "Info",
      url: "/info",
      icon: <Info className="h-5 w-5" />,
      menu: true,
    },
    notifications: {
      name: "Notifications",
      url: "/notifications",
      icon: <Bell className="h-5 w-5" />,
      menu: true,
    },
  },
  traveller: {
    welcome: {
      name: "Welcome",
      url: "/welcome",
      icon: <Map className="h-5 w-5" />,
    },
    dashboard: {
      name: "Dashboard",
      url: "/traveller",
      icon: <LayoutDashboard className="h-5 w-5" />,
      menu: true,
    },
    payments: {
      name: "Payments",
      url: "/traveller/payments",
      icon: <CreditCard className="h-5 w-5" />,
      menu: true,
    },
    applyForServiceProvider: {
      name: "Apply for Service Provider",
      url: "/traveller/apply-for-service-provider",
      icon: <Plus className="h-5 w-5" />,
    },
  },
  serviceProvider: {
    dashboard: {
      name: "Dashboard",
      url: "/service-provider",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    serviceManagement: {
      name: "Service Management",
      url: "/service-provider/service-management",
      icon: <FolderOpen className="h-5 w-5" />,
    },
    createService: {
      name: "Create Service",
      url: "/service-provider/service-management/create",
      icon: <Plus className="h-5 w-5" />,
    },
    editService: {
      name: "Edit Service",
      url: "/service-provider/service-management/edit/:serviceId",
      icon: <Edit className="h-5 w-5" />,
    },
    myServices: {
      name: "My Services",
      url: "/service-provider/my-services",
      icon: <Map className="h-5 w-5" />,
    },
    analytics: {
      name: "Analytics",
      url: "/service-provider/analytics",
      icon: <BarChart3 className="h-5 w-5" />,
    },
  },
  admin: {
    dashboard: {
      name: "Dashboard",
      url: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    travellerManagement: {
      name: "Traveller Management",
      url: "/admin/traveller-management",
      icon: <Users className="h-5 w-5" />,
    },
    serviceProviderManagement: {
      name: "Service Provider Management",
      url: "/admin/service-provider-management",
      icon: <Users className="h-5 w-5" />,
    },
    serviceManagement: {
      name: "Service Management",
      url: "/admin/service-management",
      icon: <FolderOpen className="h-5 w-5" />,
    },
    analytics: {
      name: "Analytics",
      url: "/admin/analytics",
      icon: <BarChart3 className="h-5 w-5" />,
    },
  },
};

export { routes };
