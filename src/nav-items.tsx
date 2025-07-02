
import { HomeIcon, FileTextIcon, PenToolIcon, UserIcon, CreditCardIcon, BookOpenIcon, StarIcon } from "lucide-react";
import Index from "./pages/Index";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Profile from "./pages/Profile";
import ESignatures from "./pages/ESignatures";
import DocumentAnalysis from "./pages/DocumentAnalysis";
import UpcomingFeatures from "./pages/UpcomingFeatures";
import { Dashboard } from "./components/dashboard/Dashboard";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Dashboard",
    to: "/dashboard",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Dashboard />,
  },
  {
    title: "Features",
    to: "/features",
    icon: <StarIcon className="h-4 w-4" />,
    page: <Features />,
  },
  {
    title: "E-Signatures",
    to: "/esignatures",
    icon: <PenToolIcon className="h-4 w-4" />,
    page: <ESignatures />,
  },
  {
    title: "Document Analysis",
    to: "/document-analysis",
    icon: <FileTextIcon className="h-4 w-4" />,
    page: <DocumentAnalysis />,
  },
  {
    title: "Pricing",
    to: "/pricing",
    icon: <CreditCardIcon className="h-4 w-4" />,
    page: <Pricing />,
  },
  {
    title: "Upcoming Features",
    to: "/upcoming-features",
    icon: <BookOpenIcon className="h-4 w-4" />,
    page: <UpcomingFeatures />,
  },
  {
    title: "Profile",
    to: "/profile",
    icon: <UserIcon className="h-4 w-4" />,
    page: <Profile />,
  },
];
