
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export function EmailView() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Email Management</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Email Campaigns</CardTitle>
          <CardDescription>Manage and send email campaigns to your customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-muted p-8 text-center">
            <Mail className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Set Up Email Campaigns</h2>
            <p className="text-muted-foreground mb-4">Configure your email settings to start sending campaigns to your customers.</p>
            <Button>Configure Email Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
