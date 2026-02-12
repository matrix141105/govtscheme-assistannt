
import { useState, useEffect } from "react";
import { Search, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useStateContext } from "@/context/StateContext";
import { Skeleton } from "@/components/ui/skeleton";
import { apiFetch } from "@/lib/api";
import { ConnectionError } from "@/components/ConnectionError";

interface Scheme {
    id: number;
    name: string;
    tag: string;
    url: string;
    state: string;
    details: Record<string, string>;
}

export function SearchSchemes() {
    const [schemes, setSchemes] = useState<Scheme[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetchSchemes();
    }, []);

    const fetchSchemes = async () => {
        setLoading(true);
        setError(false);
        try {
            const response = await apiFetch("/api/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            setSchemes(data);
        } catch (error) {
            console.error(error);
            setError(true);
            toast.error("Could not load schemes. Server might be sleeping.");
        } finally {
            setLoading(false);
        }
    };

    const { selectedState } = useStateContext();

    const filteredSchemes = schemes.filter(
        (s) => {
            // Text Search Filter
            const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.tag.toLowerCase().includes(searchTerm.toLowerCase());

            // State/Region Filter
            const matchesState = selectedState === "All India"
                ? s.state === "Central"
                : (s.state === "Central" || s.state === selectedState);

            return matchesSearch && matchesState;
        }
    );

    if (error) {
        return <ConnectionError onRetry={fetchSchemes} />;
    }

    return (
        <div className="flex-1 overflow-y-auto p-6 bg-background">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header */}
                <div className="space-y-2">
                    <h2 className="text-2xl font-display font-bold text-foreground">Find Government Schemes ({selectedState})</h2>
                    <p className="text-muted-foreground">Search and explore various government initiatives tailored for you.</p>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by name or category (e.g., Kisan, Housing)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                    />
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4"
                            >
                                <div>
                                    <div className="flex items-start justify-between mb-2">
                                        <Skeleton className="h-6 w-3/4" />
                                        <Skeleton className="h-5 w-20 rounded-full" />
                                    </div>
                                    <div className="space-y-2 mt-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-5/6" />
                                    </div>
                                </div>
                                <Skeleton className="mt-auto h-10 w-full rounded-lg" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredSchemes.map((scheme) => (
                            <div
                                key={scheme.id}
                                className="rounded-xl border border-border bg-card p-5 hover:shadow-md transition-all flex flex-col gap-4"
                            >
                                <div>
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-display font-bold text-lg text-foreground">{scheme.name}</h3>
                                        <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full uppercase tracking-wide ${scheme.state === "Central" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}>
                                            {scheme.state === "Central" ? "Central" : scheme.state}
                                        </span>
                                        <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary uppercase tracking-wide">
                                            {scheme.tag}
                                        </span>
                                    </div>
                                    <div className="text-sm text-muted-foreground space-y-1">
                                        {Object.entries(scheme.details).slice(0, 2).map(([key, value]) => (
                                            <p key={key} className="line-clamp-2">
                                                <span className="font-medium text-foreground/80">{key}:</span> {value}
                                            </p>
                                        ))}
                                    </div>
                                </div>

                                <a
                                    href={scheme.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-auto w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors"
                                >
                                    View Details <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        ))}

                        {filteredSchemes.length === 0 && (
                            <div className="col-span-full text-center py-10 text-muted-foreground">
                                {schemes.length === 0 ? "Failed to load schemes. Ensure backend is running." : `No schemes found matching "${searchTerm}"`}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
