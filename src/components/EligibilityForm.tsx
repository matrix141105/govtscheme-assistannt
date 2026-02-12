import { ClipboardCheck, ArrowLeft, Loader2, CheckCircle, XCircle, UserPlus } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EligibilityFormProps {
  onBack: () => void;
}

interface EligibleScheme {
  name: string;
  reason: string;
}

interface ProfileData {
  id: number;
  name: string;
  age: number;
  income: number;
  category: string;
  occupation: string;
}

export function EligibilityForm({ onBack }: EligibilityFormProps) {
  const { token, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<EligibleScheme[] | null>(null);
  const [formData, setFormData] = useState({
    age: "",
    income: "",
    category: "",
    occupation: "",
  });

  // Fetch Profiles if authenticated
  const { data: profiles } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      if (!token) return [];
      const res = await fetch(`${API_BASE_URL}/api/profiles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return [];
      return res.json() as Promise<ProfileData[]>;
    },
    enabled: !!token,
  });

  const handleProfileSelect = (profileId: string) => {
    const profile = profiles?.find((p) => p.id.toString() === profileId);
    if (profile) {
      setFormData({
        age: profile.age.toString(),
        income: profile.income.toString(),
        category: profile.category,
        occupation: profile.occupation,
      });
      toast.success(`Loaded profile: ${profile.name}`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheck = async () => {
    if (!formData.age || !formData.income || !formData.category || !formData.occupation) {
      toast.error("Please fill in all details");
      return;
    }

    setLoading(true);
    setResults(null);

    try {
      const response = await apiFetch("/api/check-eligibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: parseInt(formData.age),
          income: parseFloat(formData.income),
          category: formData.category,
          occupation: formData.occupation,
        }),
      });

      if (!response.ok) throw new Error("Failed to check eligibility");

      const data = await response.json();
      if (Array.isArray(data)) {
        setResults(data);
      } else if (data.schemes) {
        setResults(data.schemes);
      } else {
        setResults([]);
      }

    } catch (error) {
      console.error(error);
      toast.error("Error checking eligibility. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 min-w-0">
      <header className="flex items-center gap-3 px-6 py-4 border-b border-border bg-card">
        <button onClick={onBack} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <ClipboardCheck className="w-5 h-5 text-primary" />
        <h2 className="font-display font-bold text-foreground">Check Eligibility</h2>
      </header>

      <div className="flex-1 flex items-start justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-lg space-y-6">

          {isAuthenticated && profiles && profiles.length > 0 && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserPlus className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Auto-fill from Profile</span>
              </div>
              <Select onValueChange={handleProfileSelect}>
                <SelectTrigger className="w-[180px] h-9">
                  <SelectValue placeholder="Select Profile" />
                </SelectTrigger>
                <SelectContent>
                  {profiles.map((p) => (
                    <SelectItem key={p.id} value={p.id.toString()}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Enter your age"
                  className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Annual Income (₹)</label>
                <input
                  type="number"
                  name="income"
                  value={formData.income}
                  onChange={handleChange}
                  placeholder="e.g. 250000"
                  className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Caste Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm outline-none focus:ring-2 focus:ring-ring transition"
                >
                  <option value="">Select category</option>
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  placeholder="e.g. Farmer, Student, Self-employed"
                  className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition"
                />
              </div>
            </div>

            <button
              onClick={handleCheck}
              disabled={loading}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ClipboardCheck className="w-4 h-4" />}
              {loading ? "Checking..." : "Check Eligibility"}
            </button>
          </div>

          {/* Results Section */}
          {results !== null && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="font-display font-bold text-lg">Eligibility Results</h3>

              {results.length > 0 ? (
                <div className="space-y-3">
                  {results.map((scheme, index) => (
                    <div key={index} className="p-4 rounded-xl border border-green-200 bg-green-50/50 dark:bg-green-900/10 dark:border-green-800 flex gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-sm text-green-900 dark:text-green-100">{scheme.name}</h4>
                        <p className="text-xs text-green-700 dark:text-green-300 mt-1">{scheme.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-xl border border-border bg-muted/50 text-center space-y-2">
                  <XCircle className="w-8 h-8 text-muted-foreground mx-auto opacity-50" />
                  <p className="text-sm font-medium text-muted-foreground">No eligible schemes found based on your details.</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
