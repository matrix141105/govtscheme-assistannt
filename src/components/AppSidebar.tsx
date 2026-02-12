import { MessageSquare, Search, ClipboardCheck, AlertTriangle, User, Globe, ChevronDown, Shield, LogIn, MapPin, LogOut } from "lucide-react";
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

const languages = ["English", "हिन्दी", "తెలుగు", "Bhojpuri"];
const states = ["All India", "Telangana", "Andhra Pradesh", "Karnataka", "Tamil Nadu", "Maharashtra", "Kerala"];

export function AppSidebar({ activeView, onViewChange }: AppSidebarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { selectedState, setSelectedState } = useStateContext();
  const [langOpen, setLangOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);

  const navItems: { title: string; icon: React.ElementType; view: View }[] = [
    { title: t("Chat"), icon: MessageSquare, view: "chat" },
    { title: t("Search Schemes"), icon: Search, view: "search" },
    { title: t("Check Eligibility"), icon: ClipboardCheck, view: "eligibility" },
    { title: t("Grievance Redressal"), icon: AlertTriangle, view: "grievance" },
    { title: t("Profile"), icon: User, view: "profile" },
  ];

  return (
    <aside
      className={`flex flex-col bg-green-900 text-white transition-all duration-300 w-full h-full shrink-0`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-green-800">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-green-800 text-white">
          <Globe className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-lg font-display font-bold text-white">GovAssist AI</h1>
          <p className="text-xs text-green-200">{t("Your Government Helper")}</p>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = activeView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => (item.view === "profile" ? onViewChange("profile") : onViewChange(item.view))}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer shadow-none ${isActive
                ? "bg-white text-green-900 font-bold shadow-md"
                : "text-green-100 hover:bg-green-800 hover:text-white"
                }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span>{item.title}</span>
            </button>
          );
        })}
      </nav>

      {/* Auth Section */}
      <div className="px-3 py-4 border-t border-green-800">
        {isAuthenticated ? (
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-green-800/50 border border-green-700/50">
            <div className="h-8 w-8 rounded-full bg-green-700 flex items-center justify-center text-white font-bold text-xs shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-white">{user?.name}</p>
              <p className="text-xs text-green-200 truncate">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-green-200 hover:text-white hover:bg-green-700 transition-colors"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link to="/login" className="flex items-center gap-2 justify-center w-full px-3 py-2 rounded-lg bg-white text-green-900 text-sm font-bold hover:bg-green-50 transition-colors shadow-sm">
            <LogIn className="w-4 h-4" />
            {t("Login / Signup")}
          </Link>
        )}
      </div>

      <div className="mt-auto">
        {/* State Selector */}
        <div className="px-3 pb-2 relative">
          <button
            onClick={() => setStateOpen(!stateOpen)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-green-100 hover:bg-green-800 hover:text-white transition-colors"
          >
            <MapPin className="w-5 h-5 shrink-0" />
            <>
              <span className="flex-1 text-left truncate">{selectedState}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${stateOpen ? "rotate-180" : ""}`} />
            </>
          </button>
          {stateOpen && (
            <div className="absolute bottom-full left-3 right-3 mb-1 bg-white text-gray-900 rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden max-h-60 overflow-y-auto">
              {states.map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    setSelectedState(st as any);
                    setStateOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100 transition-colors ${selectedState === st ? "bg-green-50 text-green-900 font-medium" : ""
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
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-green-100 hover:bg-green-800 hover:text-white transition-colors"
          >
            <Globe className="w-5 h-5 shrink-0" />
            <>
              <span className="flex-1 text-left">{language}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${langOpen ? "rotate-180" : ""}`} />
            </>
          </button>
          {langOpen && (
            <div className="absolute bottom-full left-3 right-3 mb-1 bg-white text-gray-900 rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setLanguage(lang as any);
                    setLangOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100 transition-colors ${language === lang ? "bg-green-50 text-green-900 font-medium" : ""
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
