import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, LogOut, Plus, Trash2, Users, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ProfileData {
    id: number;
    name: string;
    age: number;
    income: number;
    category: string;
    occupation: string;
}

export function Profile() {
    const { user, logout, isAuthenticated, token } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newProfile, setNewProfile] = useState({
        name: "",
        age: "",
        income: "",
        category: "",
        occupation: "",
    });

    // Fetch Profiles
    const { data: profiles, isLoading } = useQuery({
        queryKey: ["profiles"],
        queryFn: async () => {
            if (!token) return [];
            // apiFetch handles retries
            const res = await apiFetch("/api/profiles", {
                headers: { Authorization: `Bearer ${token}` },
            });
            // apiFetch throws on 4xx/5xx, but we can double check
            if (!res.ok) throw new Error("Failed to fetch profiles");
            return res.json() as Promise<ProfileData[]>;
        },
        enabled: !!token,
        retry: 1, // Let react-query handle some retries too, but our apiFetch has internal retries
    });

    // Add Profile Mutation
    const addProfileMutation = useMutation({
        mutationFn: async (data: any) => {
            const res = await apiFetch("/api/profiles", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profiles"] });
            setIsAddOpen(false);
            setNewProfile({ name: "", age: "", income: "", category: "", occupation: "" });
            toast.success("Profile added successfully");
        },
        onError: () => toast.error("Failed to add profile"),
    });

    // Delete Profile Mutation
    const deleteProfileMutation = useMutation({
        mutationFn: async (id: number) => {
            await apiFetch(`/api/profiles/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profiles"] });
            toast.success("Profile deleted");
        },
        onError: () => toast.error("Failed to delete profile"),
    });

    const handleAddProfile = () => {
        if (!newProfile.name || !newProfile.age || !newProfile.income || !newProfile.category || !newProfile.occupation) {
            toast.error("Please fill all fields");
            return;
        }
        addProfileMutation.mutate({
            ...newProfile,
            age: parseInt(newProfile.age),
            income: parseFloat(newProfile.income),
        });
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (!isAuthenticated) {
        return (
            <div className="flex-1 w-full h-full flex flex-col items-center justify-center p-4 bg-background min-h-[500px]">
                <div className="p-4 bg-muted rounded-full mb-4">
                    <Globe className="w-12 h-12 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold">Guest User</h2>
                <p className="text-muted-foreground text-center max-w-sm">
                    Log in to save beneficiary profiles and track eligibility.
                </p>
                <div className="flex gap-4">
                    <Button onClick={() => navigate("/login")}>Log In</Button>
                    <Button variant="outline" onClick={() => navigate("/signup")}>Sign Up</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 p-8 overflow-y-auto bg-background">
            <div className="max-w-4xl mx-auto space-y-8">
                <header className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-display font-bold">Account & Profiles</h1>
                        <p className="text-muted-foreground">Manage your account and beneficiary profiles.</p>
                    </div>
                    <Button variant="outline" className="text-destructive hover:text-destructive" onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Switch Account
                    </Button>
                </header>

                <div className="grid gap-8 md:grid-cols-[300px_1fr]">
                    {/* User Info Card */}
                    <Card className="h-fit">
                        <CardHeader>
                            <CardTitle>My Account</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold mb-3">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <h3 className="font-medium text-lg">{user?.name}</h3>
                                <p className="text-sm text-muted-foreground">{user?.email}</p>
                            </div>
                            <div className="text-sm">
                                <span className="text-muted-foreground">Language:</span> <span className="font-medium">{user?.language || "English"}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Profiles Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                Beneficiary Profiles
                            </h2>
                            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Profile
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add New Profile</DialogTitle>
                                        <DialogDescription>Add details for a family member to check their eligibility easily.</DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label>Name (e.g., Father, Sister)</Label>
                                            <Input
                                                value={newProfile.name}
                                                onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
                                                placeholder="Profile Name"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label>Age</Label>
                                                <Input
                                                    type="number"
                                                    value={newProfile.age}
                                                    onChange={(e) => setNewProfile({ ...newProfile, age: e.target.value })}
                                                    placeholder="Age"
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Income (₹)</Label>
                                                <Input
                                                    type="number"
                                                    value={newProfile.income}
                                                    onChange={(e) => setNewProfile({ ...newProfile, income: e.target.value })}
                                                    placeholder="Annual Income"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Category</Label>
                                            <Select
                                                value={newProfile.category}
                                                onValueChange={(val) => setNewProfile({ ...newProfile, category: val })}
                                            >
                                                <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="General">General</SelectItem>
                                                    <SelectItem value="OBC">OBC</SelectItem>
                                                    <SelectItem value="SC">SC</SelectItem>
                                                    <SelectItem value="ST">ST</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Occupation</Label>
                                            <Input
                                                value={newProfile.occupation}
                                                onChange={(e) => setNewProfile({ ...newProfile, occupation: e.target.value })}
                                                placeholder="Farmer, Student, etc."
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handleAddProfile}>Save Profile</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>

                        {isLoading ? (
                            <div className="text-center py-10 text-muted-foreground">Loading profiles...</div>
                        ) : profiles?.length === 0 ? (
                            <Card className="border-dashed">
                                <CardContent className="flex flex-col items-center justify-center py-10 text-center space-y-2">
                                    <Users className="w-10 h-10 text-muted-foreground/50" />
                                    <p className="font-medium text-muted-foreground">No profiles added yet.</p>
                                    <p className="text-sm text-muted-foreground">Add family members to check schemes for them.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2">
                                {profiles?.map((profile) => (
                                    <Card key={profile.id} className="relative group">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-base font-medium">{profile.name}</CardTitle>
                                            <CardDescription>{profile.age} years • {profile.occupation}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="text-sm space-y-1 pb-3">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Income:</span>
                                                <span>₹{profile.income.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Category:</span>
                                                <span>{profile.category}</span>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="pt-0 flex justify-end">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => deleteProfileMutation.mutate(profile.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
