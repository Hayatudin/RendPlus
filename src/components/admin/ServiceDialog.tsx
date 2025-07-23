
import React from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const serviceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  base_price: z.string().min(1, "Base price is required"),
  specialist_name: z.string().min(1, "Specialist name is required"),
  icon_name: z.string().min(1, "Icon name is required"),
  image_url: z.string().min(1, "Image URL is required"),
  benefits: z.array(z.string()).default([]),
  status: z.string().default("Active"),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface ServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: ServiceFormData & { id: string };
  onSuccess: () => void;
}

export function ServiceDialog({ open, onOpenChange, service, onSuccess }: ServiceDialogProps) {
  const { toast: uiToast } = useToast();
  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: service || {
      title: "",
      description: "",
      category: "",
      base_price: "",
      specialist_name: "",
      icon_name: "",
      image_url: "",
      benefits: [],
      status: "Active",
    },
  });

  const onSubmit = async (data: ServiceFormData) => {
    try {
      toast.loading(service ? "Updating service..." : "Creating service...");
      
      // Ensure all required fields are present in data
      const serviceData = {
        title: data.title,
        description: data.description,
        category: data.category,
        base_price: data.base_price,
        specialist_name: data.specialist_name,
        icon_name: data.icon_name,
        image_url: data.image_url,
        benefits: data.benefits,
        status: data.status
      };

      if (service?.id) {
        const { error } = await supabase
          .from("services")
          .update(serviceData)
          .eq("id", service.id);

        if (error) throw error;
        toast.dismiss();
        uiToast({ description: "Service updated successfully" });
      } else {
        const { error } = await supabase
          .from("services")
          .insert(serviceData);
        
        if (error) {
          console.error("Error saving service:", error);
          throw error;
        }
        toast.dismiss();
        uiToast({ description: "Service created successfully" });
      }
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving service:", error);
      toast.dismiss();
      uiToast({
        variant: "destructive",
        description: "Failed to save service. Please try again.",
      });
    }
  };

  const iconOptions = [
    { value: "palette", label: "Palette (Interior Design)" },
    { value: "building-2", label: "Building (Architecture)" },
    { value: "tree-pine", label: "Tree Pine (Landscape)" },
    { value: "home", label: "Home (Furniture)" },
    { value: "briefcase", label: "Briefcase (Commercial)" },
    { value: "graduation-cap", label: "Graduation Cap (Education)" },
    { value: "pen-tool", label: "Pen Tool (Design)" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{service ? "Edit Service" : "Add New Service"}</DialogTitle>
          <DialogDescription>
            {service 
              ? "Update the service details below. This will update the service on the website." 
              : "Fill in the details below to add a new service. This will appear on the website."
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Interior 3D Rendering" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Detailed service description..." 
                      {...field} 
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Interior" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="base_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Price</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., $950" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="specialist_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialist Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Led by Alex Morgan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="icon_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon Name</FormLabel>
                    <FormControl>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select an icon" />
                        </SelectTrigger>
                        <SelectContent>
                          {iconOptions.map((icon) => (
                            <SelectItem key={icon.value} value={icon.value}>
                              {icon.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="Image URL for the service" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {service ? "Update Service" : "Add Service"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
