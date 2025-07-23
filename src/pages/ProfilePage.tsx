
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { User, Settings, LogOut } from "lucide-react";

interface Profile {
  username: string;
  avatar_url: string;
}

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    username: "",
    avatar_url: ""
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const getProfile = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("username, avatar_url")
          .eq("id", user.id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setProfile({
            username: data.username || "",
            avatar_url: data.avatar_url || ""
          });
        }
      } catch (error: any) {
        console.error("Error fetching profile:", error.message);
        toast.error("Failed to load profile information");
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [user, navigate]);

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      setUpdating(true);
      
      const { error } = await supabase
        .from("profiles")
        .update({
          username: profile.username,
          avatar_url: profile.avatar_url,
          updated_at: new Date().toISOString() // Fixed: Convert Date to ISO string
        })
        .eq("id", user.id);

      if (error) {
        throw error;
      }

      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error("Error updating profile:", error.message);
      toast.error(error.message || "Error updating profile");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-24">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold flex items-center">
              <User className="mr-2 h-6 w-6" /> Your Profile
            </h1>
            <Button
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={signOut}
            >
              <LogOut className="h-4 w-4 mr-2" /> Sign Out
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
          ) : (
            <form onSubmit={updateProfile} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-sm text-gray-500">Your email cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={profile.username}
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                  placeholder="Enter your username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatar">Avatar URL</Label>
                <Input
                  id="avatar"
                  type="text"
                  value={profile.avatar_url}
                  onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                disabled={updating}
              >
                {updating ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Settings className="mr-2 h-5 w-5" />
                    Update Profile
                  </span>
                )}
              </Button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
