
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Bell, Shield, Building } from "lucide-react";
import { NotificationSettings } from "./NotificationSettings";

export function SettingsView() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      {/* Notification Settings */}
      <NotificationSettings />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            General Settings
          </CardTitle>
          <CardDescription>Configure your website settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-2">Company Information</h3>
            <p className="text-sm text-muted-foreground mb-4">Update your company details and contact information</p>
            <Button variant="outline">Edit Company Info</Button>
          </div>
          
          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-2">Email Notifications</h3>
            <p className="text-sm text-muted-foreground mb-4">Configure email notification preferences</p>
            <Button variant="outline">Configure Notifications</Button>
          </div>
          
          <div className="border rounded-md p-4">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security Settings
            </h3>
            <p className="text-sm text-muted-foreground mb-4">Manage security and access controls</p>
            <Button variant="outline">Security Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
