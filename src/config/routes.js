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
      icon: <Home className="h-4 w-4" />,
    },
    login: {
      name: "Log In",
      url: "/login",
      icon: <LogIn className="h-4 w-4" />,
    },
    signup: {
      name: "Sign Up",
      url: "/signup",
      icon: <UserPlus className="h-4 w-4" />,
    },
    forgotPassword: {
      name: "Forgot Password",
      url: "/forgot-password",
      icon: <KeyRound className="h-4 w-4" />,
    },
    about: {
      name: "About",
      url: "/about",
      icon: <Info className="h-4 w-4" />,
    },
    contact: {
      name: "Contact",
      url: "/contact",
      icon: <Mail className="h-4 w-4" />,
    },
    termsAndConditions: {
      name: "Terms and Conditions",
      url: "/terms-and-conditions",
      icon: <FileText className="h-4 w-4" />,
    },
    privacyPolicy: {
      name: "Privacy Policy",
      url: "/policy",
      icon: <Shield className="h-4 w-4" />,
    },
  },
  common: {
    profile: {
      name: "Profile",
      url: "/profile",
      icon: <User className="h-4 w-4" />,
      menu: true,
    },
    info: {
      name: "Info",
      url: "/info",
      icon: <Info className="h-4 w-4" />,
      menu: true,
    },
    notifications: {
      name: "Notifications",
      url: "/notifications",
      icon: <Bell className="h-4 w-4" />,
      menu: true,
    },
  },
  traveller: {
    welcome: {
      name: "Welcome",
      url: "/welcome",
      icon: <Map className="h-4 w-4" />,
    },
    dashboard: {
      name: "Dashboard",
      url: "/traveller",
      icon: <LayoutDashboard className="h-4 w-4" />,
      menu: true,
    },
    payments: {
      name: "Payments",
      url: "/traveller/payments",
      icon: <CreditCard className="h-4 w-4" />,
      menu: true,
    },
    applyForServiceProvider: {
      name: "Apply for Service Provider",
      url: "/traveller/apply-for-service-provider",
      icon: <Plus className="h-4 w-4" />,
    },
  },
  serviceProvider: {
    dashboard: {
      name: "Dashboard",
      url: "/service-provider",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    serviceManagement: {
      name: "Service Management",
      url: "/service-provider/service-management",
      icon: <FolderOpen className="h-4 w-4" />,
    },
    createService: {
      name: "Create Service",
      url: "/service-provider/service-management/create",
      icon: <Plus className="h-4 w-4" />,
    },
    editService: {
      name: "Edit Service",
      url: "/service-provider/service-management/edit/:serviceId",
      icon: <Edit className="h-4 w-4" />,
    },
    myServices: {
      name: "My Services",
      url: "/service-provider/my-services",
      icon: <Map className="h-4 w-4" />,
    },
    analytics: {
      name: "Analytics",
      url: "/service-provider/analytics",
      icon: <BarChart3 className="h-4 w-4" />,
    },
  },
  admin: {
    dashboard: {
      name: "Dashboard",
      url: "/admin",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    travellerManagement: {
      name: "Traveller Management",
      url: "/admin/traveller-management",
      icon: <Users className="h-4 w-4" />,
    },
    serviceProviderManagement: {
      name: "Service Provider Management",
      url: "/admin/service-provider-management",
      icon: <Users className="h-4 w-4" />,
    },
    serviceManagement: {
      name: "Service Management",
      url: "/admin/service-management",
      icon: <FolderOpen className="h-4 w-4" />,
    },
    analytics: {
      name: "Analytics",
      url: "/admin/analytics",
      icon: <BarChart3 className="h-4 w-4" />,
    },
  },
};

export { routes };
