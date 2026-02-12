import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { ChatArea } from "@/components/ChatArea";
import { InfoPanel } from "@/components/InfoPanel";
import { EligibilityForm } from "@/components/EligibilityForm";
import { GrievanceForm } from "@/components/GrievanceForm";
import { SearchSchemes } from "@/components/SearchSchemes";
import { Profile } from "@/components/Profile";
import { Search, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";

type View = "chat" | "search" | "eligibility" | "grievance" | "profile";

const PlaceholderView = ({ title, icon: Icon }: { title: string; icon: React.ElementType }) => (
  <div className="flex flex-col flex-1 min-w-0 items-center justify-center gap-3 text-muted-foreground">
    <Icon className="w-12 h-12 opacity-40" />
    <p className="text-sm font-medium">{title} — Coming Soon</p>
  </div>
);

const Index = () => {
  const [activeView, setActiveView] = useState<View>("chat");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleViewChange = (view: View) => {
    setActiveView(view);
    setMobileMenuOpen(false);
  };

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
    <div className="flex h-[100dvh] w-full overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full">
        <AppSidebar activeView={activeView} onViewChange={setActiveView} />
      </div>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-72">
          <AppSidebar activeView={activeView} onViewChange={handleViewChange} />
        </SheetContent>
      </Sheet>

      <div className="flex flex-col flex-1 min-w-0 relative">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>
          <span className="font-display font-bold text-foreground">GovAssist AI</span>
        </div>

        <div className="flex flex-1 min-w-0 relative overflow-hidden">
          {renderMainContent()}
          {activeView === "chat" && (
            <div className="hidden lg:block h-full border-l border-border">
              <InfoPanel />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
