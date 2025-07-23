
import React, { ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface RouteGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

const RouteGuard = ({ 
  children, 
  requireAuth = false,
  requireAdmin = false
}: RouteGuardProps) => {
  const { user, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect after we've checked authentication
    if (!isLoading) {
      if (requireAuth && !user) {
        // User is not authenticated but page requires auth
        navigate(`/login?returnTo=${encodeURIComponent(location.pathname)}`);
      } else if (requireAdmin && !isAdmin) {
        // Page requires admin privileges but user is not admin
        navigate("/");
      } else if (!requireAuth && user) {
        // User is authenticated but page does not require auth (like login page)
        if (isAdmin) {
          navigate("/admin");
        } else {
          navigate("/profile");
        }
      }
    }
  }, [user, isLoading, navigate, requireAuth, requireAdmin, isAdmin, location.pathname]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  // If requireAuth is true and user is null, or requireAuth is false and user exists,
  // the useEffect will handle redirection, so we don't need to return anything here
  
  // For admin routes, only render if the user is an admin
  if (requireAdmin && !isAdmin) {
    return null;
  }
  
  // Otherwise, render the children
  return <>{children}</>;
};

export default RouteGuard;
