
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";

const portfolioSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  client: z.string().min(1, "Client is required"),
  year: z.string().min(1, "Year is required"),
  featured: z.boolean().default(false),
  status: z.enum(["Active", "Inactive"]).default("Active"),
});

type PortfolioFormData = z.infer<typeof portfolioSchema>;

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
}

interface PortfolioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  portfolio?: Portfolio;
  onSuccess: () => void;
}

export function PortfolioDialog({ open, onOpenChange, portfolio, onSuccess }: PortfolioDialogProps) {
  const { toast: uiToast } = useToast();
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<PortfolioFormData>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      client: "",
      year: "",
      featured: false,
      status: "Active",
    },
  });

  const watchedFeatured = watch("featured");
  const watchedStatus = watch("status");

  React.useEffect(() => {
    if (portfolio) {
      reset({
        title: portfolio.title,
        description: portfolio.description,
        category: portfolio.category,
        client: portfolio.client,
        year: portfolio.year,
        featured: portfolio.featured,
        status: portfolio.status as "Active" | "Inactive",
      });
    } else {
      reset({
        title: "",
        description: "",
        category: "",
        client: "",
        year: "",
        featured: false,
        status: "Active",
      });
    }
    setSelectedFile(null);
  }, [portfolio, reset]);

  const uploadImage = async (file: File): Promise<string> => {
    console.log('Starting image upload for file:', file.name);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `portfolio-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = fileName;

    console.log('Uploading to portfolio_images bucket, path:', filePath);

    const { data, error: uploadError } = await supabase.storage
      .from('portfolio_images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    console.log('Upload successful, getting public URL');

    const { data: publicUrlData } = supabase.storage
      .from('portfolio_images')
      .getPublicUrl(filePath);

    console.log('Public URL:', publicUrlData.publicUrl);
    return publicUrlData.publicUrl;
  };

  const onSubmit = async (data: PortfolioFormData) => {
    try {
      setUploading(true);
      console.log('Starting portfolio submission');
      toast.loading(portfolio ? "Updating portfolio..." : "Creating portfolio...");

      let imageUrl = portfolio?.image_url || '';

      // Upload new image if selected
      if (selectedFile) {
        console.log('Uploading new image...');
        imageUrl = await uploadImage(selectedFile);
      }

      // If no image URL and no file selected for new portfolio, show error
      if (!imageUrl && !portfolio) {
        throw new Error("Please select an image");
      }

      console.log('Preparing portfolio data');
      const portfolioData = {
        title: data.title,
        description: data.description,
        category: data.category,
        client: data.client,
        year: data.year,
        image_url: imageUrl,
        featured: data.featured,
        status: data.status,
      };

      console.log('Portfolio data:', portfolioData);

      if (portfolio) {
        console.log('Updating existing portfolio');
        // Update existing portfolio
        const { error } = await supabase
          .from('portfolios')
          .update({
            ...portfolioData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', portfolio.id);

        if (error) {
          console.error('Update error:', error);
          throw new Error(`Update failed: ${error.message}`);
        }
      } else {
        console.log('Creating new portfolio');
        // Create new portfolio
        const { error } = await supabase
          .from('portfolios')
          .insert([portfolioData]);

        if (error) {
          console.error('Insert error:', error);
          throw new Error(`Insert failed: ${error.message}`);
        }
      }

      toast.dismiss();
      uiToast({
        description: portfolio ? "Portfolio updated successfully!" : "Portfolio created successfully!",
      });
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving portfolio:', error);
      toast.dismiss();
      uiToast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Failed to save portfolio. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        uiToast({
          variant: "destructive",
          description: "Please select a valid image file",
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        uiToast({
          variant: "destructive",
          description: "Image size should be less than 5MB",
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {portfolio ? "Edit Portfolio" : "Add New Portfolio"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Enter project title"
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={watch("category")}
                onValueChange={(value) => setValue("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="interior">Interior</SelectItem>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-500">{errors.category.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Enter project description"
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client *</Label>
              <Input
                id="client"
                {...register("client")}
                placeholder="Enter client name"
              />
              {errors.client && (
                <p className="text-sm text-red-500">{errors.client.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                {...register("year")}
                placeholder="Enter project year"
              />
              {errors.year && (
                <p className="text-sm text-red-500">{errors.year.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Project Image *</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
            {selectedFile && (
              <p className="text-sm text-green-600">Selected: {selectedFile.name}</p>
            )}
            {portfolio && !selectedFile && (
              <p className="text-sm text-gray-500">Current image will be kept if no new image is selected</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={watchedFeatured}
                onCheckedChange={(checked) => setValue("featured", checked)}
              />
              <Label htmlFor="featured">Featured Project</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={watchedStatus}
                onValueChange={(value) => setValue("status", value as "Active" | "Inactive")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || uploading}
              className="bg-rend-accent hover:bg-rend-accent/80 text-rend-dark"
            >
              {isSubmitting || uploading
                ? (portfolio ? "Updating..." : "Creating...")
                : (portfolio ? "Update Portfolio" : "Create Portfolio")
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
