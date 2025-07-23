
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Mail, Lock, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, isLoading, user, isAdmin } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the returnTo parameter from the URL
  const queryParams = new URLSearchParams(location.search);
  const returnTo = queryParams.get("returnTo") || "/";
  
  // If user is already logged in, redirect appropriately
  useEffect(() => {
    if (user) {
      if (isAdmin) {
        navigate("/admin");
      } else {
        navigate(returnTo);
      }
    }
  }, [user, navigate, returnTo, isAdmin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      await signIn(email, password);
      // The redirect will happen in the useEffect above when user is set
    } catch (error) {
      console.error("Login error:", error);
      // Error is already handled in the auth context
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to home
        </Link>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <Link to="/">
              <img 
                src="/lovable-uploads/20fc0bb0-6f07-4fef-b731-14b7aa6bf67d.png" 
                alt="Rend-Plus Logo" 
                className="h-12 mx-auto mb-4"
              />
            </Link>
            <h1 className="text-2xl font-bold text-rend-dark">Welcome back</h1>
            <p className="text-gray-500">Sign in to access your account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            
            <Button 
              type="submit" 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white" 
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <LogIn className="mr-2 h-5 w-5" />
                  Sign in
                </span>
              )}
            </Button>
            
            {returnTo !== "/" && (
              <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700 mt-4">
                You'll be redirected back to complete your request after signing in.
              </div>
            )}
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to={`/signup${returnTo !== "/" ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`} className="text-blue-600 hover:text-blue-800 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
