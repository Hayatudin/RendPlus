
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, FileText, AlertCircle, RefreshCw, Eye, Trash2 } from "lucide-react";
import { formatFileSize } from "@/lib/utils";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface FileUpload {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  created_at: string;
  description: string | null;
  quote_id: string | null;
  uploaded_by: string | null;
}

export function ProjectsView() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileToDelete, setFileToDelete] = useState<FileUpload | null>(null);
  const queryClient = useQueryClient();
  
  const { data: files, isLoading, refetch } = useQuery({
    queryKey: ['project-files'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quote_files')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as FileUpload[];
    }
  });

  const deleteFileMutation = useMutation({
    mutationFn: async (file: FileUpload) => {
      // First delete from storage
      const { error: storageError } = await supabase.storage
        .from('quote-files')
        .remove([file.file_url]);
      
      if (storageError) throw storageError;
      
      // Then delete the database record
      const { error: dbError } = await supabase
        .from('quote_files')
        .delete()
        .eq('id', file.id);
      
      if (dbError) throw dbError;
      
      return file.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-files'] });
      toast.success("File deleted successfully");
      setFileToDelete(null);
    },
    onError: (error) => {
      console.error('Error deleting file:', error);
      toast.error("Failed to delete file. Please try again.");
    }
  });

  const handleDeleteFile = (file: FileUpload) => {
    setFileToDelete(file);
  };

  const confirmDelete = () => {
    if (fileToDelete) {
      deleteFileMutation.mutate(fileToDelete);
    }
  };

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      toast.loading("Preparing download...");
      
      // For public buckets, we can generate a signed URL
      const { data, error } = await supabase.storage
        .from('quote-files')
        .createSignedUrl(fileUrl, 60); // 60 seconds expiry
      
      if (error) {
        console.error('Error creating signed URL:', error);
        toast.dismiss();
        toast.error(`Failed to download ${fileName}: ${error.message}`);
        return;
      }
      
      // Create a download link
      const link = document.createElement('a');
      link.href = data.signedUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.dismiss();
      toast.success(`Downloaded ${fileName}`);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.dismiss();
      toast.error('Failed to download file. Please try again.');
    }
  };
  
  const handlePreview = async (fileUrl: string, fileType: string | null) => {
    try {
      // Only attempt to preview files that are typically viewable in browser
      const viewableTypes = ['image/', 'text/', 'application/pdf'];
      const isViewable = fileType && viewableTypes.some(type => fileType.startsWith(type));
      
      if (!isViewable) {
        toast.error("This file type cannot be previewed in browser");
        return;
      }
      
      toast.loading("Loading preview...");
      
      const { data, error } = await supabase.storage
        .from('quote-files')
        .createSignedUrl(fileUrl, 60);
      
      if (error) {
        console.error('Error creating signed URL for preview:', error);
        toast.dismiss();
        toast.error(`Failed to preview file: ${error.message}`);
        return;
      }
      
      setPreviewUrl(data.signedUrl);
      toast.dismiss();
    } catch (error) {
      console.error('Error previewing file:', error);
      toast.dismiss();
      toast.error('Failed to load preview');
    }
  };
  
  const closePreview = () => {
    setPreviewUrl(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quote Files</h1>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            refetch();
            toast.success("Quote files refreshed");
          }}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Quote Files</CardTitle>
          <CardDescription>Files uploaded through the quote form</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
          ) : files && files.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell className="font-medium">{file.file_name}</TableCell>
                    <TableCell>{file.file_type || 'Unknown'}</TableCell>
                    <TableCell>{file.file_size ? formatFileSize(file.file_size) : 'N/A'}</TableCell>
                    <TableCell>{new Date(file.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handlePreview(file.file_url, file.file_type)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownload(file.file_url, file.file_name)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteFile(file)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the file
                              "{fileToDelete?.file_name}" from the storage and database.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium">No Quote Files Uploaded</h3>
              <p className="text-muted-foreground mt-2 max-w-md">
                When users submit quotes with files through your website's quote page, they will appear here.
              </p>
            </div>
          )}
        </CardContent>
        {files && files.length > 0 && (
          <CardFooter>
            <div className="w-full flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Showing {files.length} quote file{files.length !== 1 ? 's' : ''}
              </p>
            </div>
          </CardFooter>
        )}
      </Card>
      
      {/* File Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-medium">File Preview</h3>
              <Button variant="ghost" size="sm" onClick={closePreview}>
                Close
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
              <iframe 
                src={previewUrl} 
                className="w-full h-full border-0" 
                title="File Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
