
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function InquiriesView() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Customer Inquiries</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Inquiries</CardTitle>
          <CardDescription>Manage customer inquiries and quote requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-muted p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">No Inquiries Yet</h2>
            <p className="text-muted-foreground">When customers submit inquiries through your website, they will appear here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
