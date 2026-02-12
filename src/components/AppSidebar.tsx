import { MessageSquare, Search, ClipboardCheck, AlertTriangle, User, Globe, ChevronDown, Shield, LogIn, MapPin } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useStateContext } from "@/context/StateContext";
import { Link } from "react-router-dom";

type View = "chat" | "search" | "eligibility" | "grievance" | "profile";

interface AppSidebarProps {
  activeView: View;
  onViewChange: (view: View) => void;
}

const navItems: { title: string; icon: React.ElementType; view: View }[] = [
  { title: "Chat", icon: MessageSquare, view: "chat" },
  { title: "Search Schemes", icon: Search, view: "search" },
  { title: "Check Eligibility", icon: ClipboardCheck, view: "eligibility" },
  { title: "Grievance Redressal", icon: AlertTriangle, view: "grievance" },
  { title: "Profile", icon: User, view: "profile" },
];

const languages = ["English", "हिन्दी", "తెలుగు", "Bhojpuri"];
const states = ["All India", "Telangana", "Andhra Pradesh", "Karnataka", "Tamil Nadu", "Maharashtra", "Kerala"];

export function AppSidebar({ activeView, onViewChange }: AppSidebarProps) {
  const { user, isAuthenticated } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { selectedState, setSelectedState } = useStateContext();
  const [langOpen, setLangOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 ${collapsed ? "w-16" : "w-64"
        } shrink-0`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-sidebar-accent">
          <Globe className="w-5 h-5 text-sidebar-foreground" />
        </div>
        {!collapsed && (
          <div>
            <h1 className="text-lg font-display font-bold text-sidebar-primary">GovAssist AI</h1>
            <p className="text-xs text-sidebar-muted">Your Government Helper</p>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = activeView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => (item.view === "profile" ? onViewChange("profile") : onViewChange(item.view))}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                ? "bg-green-100 text-green-700"
                : "text-gray-600 hover:bg-green-50 hover:text-green-700"
                }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </button>
          );
        })}
      </nav>

      {/* Auth Section - Moved to Middle */}
      {!collapsed && (
        <div className="px-3 py-4 border-t border-sidebar-border/50">
          {isAuthenticated ? (
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-sidebar-accent/20 border border-sidebar-border/50">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-2 justify-center w-full px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
              <LogIn className="w-4 h-4" />
              Login / Signup
            </Link>
          )}
        </div>
      )}

      <div className="mt-auto">
        {/* State Selector */}
        <div className="px-3 pb-2 relative">
          <button
            onClick={() => setStateOpen(!stateOpen)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent/50 transition-colors"
          >
            <MapPin className="w-5 h-5 shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1 text-left truncate">{selectedState}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${stateOpen ? "rotate-180" : ""}`} />
              </>
            )}
          </button>
          {stateOpen && (
            <div className="absolute bottom-full left-3 right-3 mb-1 bg-popover text-popover-foreground rounded-lg shadow-lg border border-border z-50 overflow-hidden max-h-60 overflow-y-auto">
              {states.map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    setSelectedState(st as any);
                    setStateOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors ${selectedState === st ? "bg-muted font-medium" : ""
                    }`}
                >
                  {st}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Language Selector */}
        <div className="px-3 pb-4 relative">
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent/50 transition-colors"
          >
            <Globe className="w-5 h-5 shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1 text-left">{language}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${langOpen ? "rotate-180" : ""}`} />
              </>
            )}
          </button>
          {langOpen && (
            <div className="absolute bottom-full left-3 right-3 mb-1 bg-popover text-popover-foreground rounded-lg shadow-lg border border-border z-50 overflow-hidden">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setLanguage(lang as any);
                    setLangOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors ${language === lang ? "bg-muted font-medium" : ""
                    }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
