import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { ChatArea } from "@/components/ChatArea";
import { InfoPanel } from "@/components/InfoPanel";
import { EligibilityForm } from "@/components/EligibilityForm";
import { GrievanceForm } from "@/components/GrievanceForm";
import { SearchSchemes } from "@/components/SearchSchemes";
import { Profile } from "@/components/Profile";
import { Search, User } from "lucide-react";

type View = "chat" | "search" | "eligibility" | "grievance" | "profile";

const PlaceholderView = ({ title, icon: Icon }: { title: string; icon: React.ElementType }) => (
  <div className="flex flex-col flex-1 min-w-0 items-center justify-center gap-3 text-muted-foreground">
    <Icon className="w-12 h-12 opacity-40" />
    <p className="text-sm font-medium">{title} — Coming Soon</p>
  </div>
);

const Index = () => {
  const [activeView, setActiveView] = useState<View>("chat");

  const renderMainContent = () => {
    switch (activeView) {
      case "chat":
        return <ChatArea />;
      case "eligibility":
        return <EligibilityForm onBack={() => setActiveView("chat")} />;
      case "grievance":
        return <GrievanceForm onBack={() => setActiveView("chat")} />;
      case "search":
        return <SearchSchemes />;
      case "profile":
        return <Profile />;
      default:
        return <ChatArea />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <AppSidebar activeView={activeView} onViewChange={setActiveView} />
      <div className="flex flex-1 min-w-0 relative">
        {renderMainContent()}
        {activeView === "chat" && <InfoPanel />}
      </div>
    </div>
  );
};

export default Index;
