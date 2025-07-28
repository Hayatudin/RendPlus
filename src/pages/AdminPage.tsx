
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarMenu,
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarFooter,
  SidebarInset
} from "@/components/ui/sidebar";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  LogOut,
  Building,
  MessageSquare,
  Images,
  Mail,
  Settings,
  ClipboardList,
  Menu
} from "lucide-react";
import { DashboardView } from "@/components/admin/DashboardView";
import { ProjectsView } from "@/components/admin/ProjectsView";
import { InquiriesView } from "@/components/admin/InquiriesView";
import { PortfoliosView } from "@/components/admin/PortfoliosView";
import { EmailView } from "@/components/admin/EmailView";
import { SettingsView } from "@/components/admin/SettingsView";
import { useIsMobile } from "@/hooks/use-mobile";

type ViewType = "dashboard" | "projects" | "inquiries" | "portfolios" | "email" | "settings";

const AdminPage = () => {
  const { isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeView, setActiveView] = React.useState<ViewType>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    }
  }, [isAdmin, navigate]);

  const handleViewChange = (view: ViewType) => {
    setActiveView(view);
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardView />;
      case "projects":
        return <ProjectsView />;
      case "inquiries":
        return <InquiriesView />;
      case "portfolios":
        return <PortfoliosView />;
      case "email":
        return <EmailView />;
      case "settings":
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  const SidebarMenuItems = () => (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>General</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={() => handleViewChange("dashboard")}
                isActive={activeView === "dashboard"}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Projects</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={() => handleViewChange("projects")}
                isActive={activeView === "projects"}
              >
                <ClipboardList className="h-4 w-4" />
                <span>Quote Management</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={() => handleViewChange("inquiries")}
                isActive={activeView === "inquiries"}
              >
                <MessageSquare className="h-4 w-4" />
                <span>Inquiries</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Management</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={() => handleViewChange("portfolios")}
                isActive={activeView === "portfolios"}
              >
                <Images className="h-4 w-4" />
                <span>Portfolios</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={() => handleViewChange("email")}
                isActive={activeView === "email"}
              >
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>System</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={() => handleViewChange("settings")}
                isActive={activeView === "settings"}
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarFooter className="mt-auto p-4">
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </SidebarFooter>
    </>
  );

  const MobileMenuItems = () => (
    <div className="flex flex-col space-y-1 p-4">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">General</h3>
        <Button
          variant={activeView === "dashboard" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => handleViewChange("dashboard")}
        >
          <LayoutDashboard className="h-4 w-4 mr-2" />
          Dashboard
        </Button>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Projects</h3>
        <div className="space-y-1">
          <Button
            variant={activeView === "projects" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => handleViewChange("projects")}
          >
            <ClipboardList className="h-4 w-4 mr-2" />
            Quote Management
          </Button>
          <Button
            variant={activeView === "inquiries" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => handleViewChange("inquiries")}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Inquiries
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Management</h3>
        <div className="space-y-1">
          <Button
            variant={activeView === "portfolios" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => handleViewChange("portfolios")}
          >
            <Images className="h-4 w-4 mr-2" />
            Portfolios
          </Button>
          <Button
            variant={activeView === "email" ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => handleViewChange("email")}
          >
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">System</h3>
        <Button
          variant={activeView === "settings" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => handleViewChange("settings")}
        >
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>

      <div className="mt-6 pt-4 border-t">
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="flex flex-col min-h-screen">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b bg-background">
          <h1 className="text-xl font-semibold">Admin Panel</h1>
          <Drawer open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <DrawerTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[80vh]">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold">Navigation</h2>
                </div>
                <div className="flex-1 overflow-auto">
                  <MobileMenuItems />
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>

        {/* Mobile Content */}
        <main className="flex-1 p-4 overflow-auto">
          {renderContent()}
        </main>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarContent>
            <SidebarMenuItems />
          </SidebarContent>
        </Sidebar>
        
        <SidebarInset>
          <main className="flex-1 overflow-auto p-8">
            {renderContent()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminPage;
