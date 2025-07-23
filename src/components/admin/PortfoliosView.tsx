
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Images, Edit, Trash, RefreshCw, Eye, AlertCircle, Star } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PortfolioDialog } from "./PortfolioDialog";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";

interface Portfolio {
  id: string;
  title: string;
  description: string;
  category: string;
  client: string;
  year: string;
  image_url: string;
  featured: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export function PortfoliosView() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = React.useState<Portfolio | null>(null);
  const queryClient = useQueryClient();
  const { toast: uiToast } = useToast();

  const { data: portfolios, isLoading, isError, refetch } = useQuery({
    queryKey: ['portfolios-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Portfolio[];
    }
  });

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('portfolios-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'portfolios'
      }, (payload) => {
        console.log('Real-time update:', payload);
        queryClient.invalidateQueries({ queryKey: ['portfolios-admin'] });
        
        // Show toast notification based on the event
        if (payload.eventType === 'INSERT') {
          toast.success('New portfolio added');
        } else if (payload.eventType === 'UPDATE') {
          toast.success('Portfolio updated');
        } else if (payload.eventType === 'DELETE') {
          toast.success('Portfolio deleted');
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const handleAddNew = () => {
    setSelectedPortfolio(null);
    setDialogOpen(true);
  };

  const handleEdit = (portfolio: Portfolio) => {
    setSelectedPortfolio(portfolio);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      toast.loading("Deleting portfolio...");
      
      const { error } = await supabase
        .from('portfolios')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.dismiss();
      uiToast({ description: "Portfolio deleted successfully" });
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      toast.dismiss();
      uiToast({
        variant: "destructive",
        description: "Failed to delete portfolio. Please try again.",
      });
    }
  };

  const handleSuccess = () => {
    setDialogOpen(false);
  };

  const handleViewPortfolio = (portfolioTitle: string) => {
    window.open(`/portfolio#${portfolioTitle.toLowerCase().replace(/\s+/g, '-')}`, '_blank');
  };

  if (isError) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Portfolios</h1>
        <Card className="border-red-300">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Error Loading Portfolios</h3>
              <p className="text-muted-foreground mb-4">
                There was a problem connecting to the database. Please try again.
              </p>
              <Button onClick={() => refetch()}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Portfolios</h1>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              refetch();
              toast.success("Portfolios refreshed");
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button 
            onClick={handleAddNew}
            className="bg-rend-accent hover:bg-rend-accent/80 text-rend-dark"
          >
            <Images className="mr-2 h-4 w-4" />
            Add New Portfolio
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Management</CardTitle>
          <CardDescription>Manage your portfolio projects and showcase work</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12 space-y-4">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent mx-auto"></div>
              <p className="text-muted-foreground">Loading portfolios...</p>
            </div>
          ) : portfolios && portfolios.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolios.map((portfolio) => (
                  <TableRow key={portfolio.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {portfolio.title}
                        {portfolio.featured && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{portfolio.category}</TableCell>
                    <TableCell>{portfolio.client}</TableCell>
                    <TableCell>{portfolio.year}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={
                          portfolio.status === 'Active' 
                            ? "bg-green-100 text-green-800 border-green-300" 
                            : "bg-gray-100 text-gray-800 border-gray-300"
                        }
                      >
                        {portfolio.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewPortfolio(portfolio.title)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(portfolio)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(portfolio.id)}
                      >
                        <Trash className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                <Images className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No portfolios found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                You haven't added any portfolio projects yet. Click the "Add New Portfolio" button to get started.
              </p>
              <Button 
                onClick={handleAddNew}
                className="bg-rend-accent hover:bg-rend-accent/80 text-rend-dark mt-2"
              >
                Add New Portfolio
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <PortfolioDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        portfolio={selectedPortfolio || undefined}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
