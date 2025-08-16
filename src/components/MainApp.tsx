import { useState } from "react";
import { SidebarLayout } from "./layout";
import { EnhancedDashboard } from "./dashboard/EnhancedDashboard";
import { EnhancedChatPage } from "./chat/EnhancedChatPage";
import { EnhancedESignatures } from "./esignatures/EnhancedESignatures";

type MainAppProps = {
  user?: {
    id: string;
    email?: string;
    user_metadata?: {
      full_name?: string;
      avatar_url?: string;
    };
  };
  profile?: {
    full_name?: string;
    avatar_url?: string;
  };
};

export const MainApp = ({ user, profile }: MainAppProps) => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
      case "upload":
      case "documents":
      case "insights":
        return <EnhancedDashboard activeTab={activeTab} />;
      case "chat":
        return <EnhancedChatPage />;
      case "esignatures":
        return <EnhancedESignatures />;
      case "profile":
        return (
          <div className="p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl md:text-3xl font-bold mb-6">Profile Settings</h1>
              <div className="bg-card rounded-lg border p-6">
                <p className="text-muted-foreground">Profile settings coming soon...</p>
              </div>
            </div>
          </div>
        );
      case "subscription":
        return (
          <div className="p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl md:text-3xl font-bold mb-6">Subscription Management</h1>
              <div className="bg-card rounded-lg border p-6">
                <p className="text-muted-foreground">Subscription management coming soon...</p>
              </div>
            </div>
          </div>
        );
      case "trash":
        return (
          <div className="p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl md:text-3xl font-bold mb-6">Trash</h1>
              <div className="bg-card rounded-lg border p-6">
                <p className="text-muted-foreground">Deleted items will appear here...</p>
              </div>
            </div>
          </div>
        );
      case "team":
        return (
          <div className="p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl md:text-3xl font-bold mb-6">Team Management</h1>
              <div className="bg-card rounded-lg border p-6">
                <p className="text-muted-foreground">Team management features coming soon...</p>
              </div>
            </div>
          </div>
        );
      case "organization":
        return (
          <div className="p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl md:text-3xl font-bold mb-6">Organization Settings</h1>
              <div className="bg-card rounded-lg border p-6">
                <p className="text-muted-foreground">Organization settings coming soon...</p>
              </div>
            </div>
          </div>
        );
      case "security":
        return (
          <div className="p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl md:text-3xl font-bold mb-6">Security Settings</h1>
              <div className="bg-card rounded-lg border p-6">
                <p className="text-muted-foreground">Security settings coming soon...</p>
              </div>
            </div>
          </div>
        );
      case "api":
        return (
          <div className="p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl md:text-3xl font-bold mb-6">API Access</h1>
              <div className="bg-card rounded-lg border p-6">
                <p className="text-muted-foreground">API management coming soon...</p>
              </div>
            </div>
          </div>
        );
      default:
        return <EnhancedDashboard activeTab="dashboard" />;
    }
  };

  return (
    <SidebarLayout
      user={user}
      profile={profile}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      className="min-h-screen"
    >
      {renderContent()}
    </SidebarLayout>
  );
};