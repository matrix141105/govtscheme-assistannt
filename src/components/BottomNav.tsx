
import { MessageSquare, Search, ClipboardCheck, AlertTriangle, User } from "lucide-react";

type View = "chat" | "search" | "eligibility" | "grievance" | "profile";

interface BottomNavProps {
    activeView: View;
    onViewChange: (view: View) => void;
}

const navItems: { title: string; icon: React.ElementType; view: View }[] = [
    { title: "Chat", icon: MessageSquare, view: "chat" },
    { title: "Search", icon: Search, view: "search" },
    { title: "Check", icon: ClipboardCheck, view: "eligibility" },
    { title: "Grievance", icon: AlertTriangle, view: "grievance" },
    { title: "Profile", icon: User, view: "profile" },
];

export function BottomNav({ activeView, onViewChange }: BottomNavProps) {
    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 shadow-[0_-1px_3px_rgba(0,0,0,0.05)] z-50 pb-[env(safe-area-inset-bottom)]">
            <div className="flex justify-between items-center">
                {navItems.map((item) => {
                    const isActive = activeView === item.view;
                    return (
                        <button
                            key={item.view}
                            onClick={() => onViewChange(item.view)}
                            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${isActive ? "text-primary" : "text-gray-500 hover:text-gray-900"
                                }`}
                        >
                            <item.icon className={`w-6 h-6 ${isActive ? "fill-current" : ""}`} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium">{item.title}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
