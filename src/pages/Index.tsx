import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { ChatArea } from "@/components/ChatArea";
import { InfoPanel } from "@/components/InfoPanel";
import { BottomNav } from "@/components/BottomNav";
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
    <>
      {/* Desktop Layout (md+) */}
      {/* Desktop Layout (md+) */}
      <div className="hidden md:flex h-screen w-full overflow-hidden bg-gray-50">
        {/* COLUMN 1: Sidebar (Desktop Only) */}
        <aside className="w-64 flex-col fixed inset-y-0 left-0 z-50 bg-green-900 text-white hidden md:flex h-screen">
          <AppSidebar activeView={activeView} onViewChange={setActiveView} />
        </aside>

        {/* COLUMN 2: Main Chat (Center) */}
        <main className={`flex-1 flex flex-col md:pl-64 ${activeView === 'chat' ? 'lg:pr-80' : ''} relative w-full h-full transition-all duration-300`}>
          {renderMainContent()}
        </main>

        {/* COLUMN 3: Right Panel (Desktop Only) */}
        {activeView === "chat" && (
          <aside className="hidden lg:block w-80 fixed inset-y-0 right-0 border-l border-gray-200 bg-white z-40 h-full overflow-y-auto">
            <InfoPanel />
          </aside>
        )}
      </div>

      {/* Mobile Layout (Default) */}
      <div className="md:hidden flex flex-col h-[100dvh] bg-white relative">
        {/* Mobile Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white z-20">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-lg text-primary">GovAssist</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-6 h-6 text-gray-700" />
          </Button>
        </div>

        {/* Mobile Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pb-20 scrollbar-hide">
          {renderMainContent()}
        </div>

        {/* Mobile Bottom Nav */}
        <BottomNav activeView={activeView} onViewChange={setActiveView} />

        {/* Mobile Sidebar Sheet (For Settings/Context) */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="p-0 w-72">
            <AppSidebar activeView={activeView} onViewChange={(v) => { setActiveView(v); setMobileMenuOpen(false); }} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default Index;
