
import React, { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface AdminRouteGuardProps {
  children: ReactNode;
}

const AdminRouteGuard = ({ children }: AdminRouteGuardProps) => {
  const { user, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect after we've checked authentication
    if (!isLoading) {
      if (!user) {
        // Not authenticated at all, redirect to login
        navigate("/login");
      } else if (!isAdmin) {
        // Authenticated but not admin, redirect to home
        navigate("/");
      }
    }
  }, [user, isLoading, isAdmin, navigate]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  // Only render children if user is authenticated and is admin
  if (user && isAdmin) {
    return <>{children}</>;
  }

  // This should not be rendered, but just in case
  return null;
};

export default AdminRouteGuard;
