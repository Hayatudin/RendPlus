
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Check if the user is an admin
  const checkIfAdmin = (email: string | undefined) => {
    // Admin credentials check
    if (email === "softcode132@gmail.com") {
      setIsAdmin(true);
      return true;
    }
    setIsAdmin(false);
    return false;
  };

  useEffect(() => {
    // Check for active session on mount
    const getInitialSession = async () => {
      setIsLoading(true);
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check admin status
        if (session?.user) {
          checkIfAdmin(session.user.email);
        }
      } catch (error) {
        console.error("Error checking auth session:", error);
        toast.error("Authentication error. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check admin status on auth state change
        if (session?.user) {
          checkIfAdmin(session.user.email);
        } else {
          setIsAdmin(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
      
      // Check if admin login and redirect accordingly
      if (email === "softcode132@gmail.com" && password === "addisrender@2025") {
        setIsAdmin(true);
        navigate("/admin");
        toast.success("Welcome, Admin!");
      } else {
        navigate("/");
        toast.success("Successfully signed in!");
      }
    } catch (error: any) {
      console.error("Error signing in:", error.message);
      toast.error(error.message || "Error signing in. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({ email, password });
      
      if (error) {
        throw error;
      }
      
      toast.success("Registration successful! Please check your email for verification.");
    } catch (error: any) {
      console.error("Error signing up:", error.message);
      toast.error(error.message || "Error signing up. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setIsAdmin(false);
      navigate("/login");
      toast.success("Successfully signed out!");
    } catch (error: any) {
      console.error("Error signing out:", error.message);
      toast.error(error.message || "Error signing out. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, isAdmin, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
