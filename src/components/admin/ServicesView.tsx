
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PenTool, Edit, Trash, RefreshCw, Eye, AlertCircle } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ServiceDialog } from "./ServiceDialog";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  base_price: string;
  specialist_name: string;
  icon_name: string;
  image_url: string;
  benefits: string[];
  status: string;
}

export function ServicesView() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedService, setSelectedService] = React.useState<Service | null>(null);
  const queryClient = useQueryClient();
  const { toast: uiToast } = useToast();

  const { data: services, isLoading, isError, refetch } = useQuery({
    queryKey: ['services-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Service[];
    }
  });

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('services-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'services'
      }, (payload) => {
        console.log('Real-time update:', payload);
        queryClient.invalidateQueries({ queryKey: ['services-admin'] });
        
        // Also invalidate homepage services
        queryClient.invalidateQueries({ queryKey: ['homepage-services'] });
        
        // Show toast notification based on the event
        if (payload.eventType === 'INSERT') {
          toast.success('New service added');
        } else if (payload.eventType === 'UPDATE') {
          toast.success('Service updated');
        } else if (payload.eventType === 'DELETE') {
          toast.success('Service deleted');
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const handleAddNew = () => {
    setSelectedService(null);
    setDialogOpen(true);
  };

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      toast.loading("Deleting service...");
      
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.dismiss();
      uiToast({ description: "Service deleted successfully" });
      
      // No need to invalidate manually due to real-time subscription
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.dismiss();
      uiToast({
        variant: "destructive",
        description: "Failed to delete service. Please try again.",
      });
    }
  };

  const handleSuccess = () => {
    // No need to invalidate manually due to real-time subscription
    setDialogOpen(false);
  };

  const handleViewService = (serviceTitle: string) => {
    // Navigate to the services page with the specific service ID
    window.open(`/services#${serviceTitle.toLowerCase().replace(/\s+/g, '-')}`, '_blank');
  };

  if (isError) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Services</h1>
        <Card className="border-red-300">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center text-center p-6">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Error Loading Services</h3>
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
        <h1 className="text-3xl font-bold">Services</h1>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              refetch();
              toast.success("Services refreshed");
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button 
            onClick={handleAddNew}
            className="bg-rend-accent hover:bg-rend-accent/80 text-rend-dark"
          >
            <PenTool className="mr-2 h-4 w-4" />
            Add New Service
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Service Management</CardTitle>
          <CardDescription>Manage your service offerings and pricing</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12 space-y-4">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent mx-auto"></div>
              <p className="text-muted-foreground">Loading services...</p>
            </div>
          ) : services && services.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Base Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">{service.title}</TableCell>
                    <TableCell>{service.category}</TableCell>
                    <TableCell>{service.base_price}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={
                          service.status === 'Active' 
                            ? "bg-green-100 text-green-800 border-green-300" 
                            : "bg-gray-100 text-gray-800 border-gray-300"
                        }
                      >
                        {service.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewService(service.title)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(service)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(service.id)}
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
                <PenTool className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No services found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                You haven't added any services yet. Click the "Add New Service" button to get started.
              </p>
              <Button 
                onClick={handleAddNew}
                className="bg-rend-accent hover:bg-rend-accent/80 text-rend-dark mt-2"
              >
                Add New Service
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <ServiceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        service={selectedService || undefined}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
