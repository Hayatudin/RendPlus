
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
import { Download, Calculator, AlertCircle, RefreshCw, Eye, Trash2, User, Mail, Phone, MessageSquare, Calendar } from "lucide-react";
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface QuoteSubmission {
  id: string;
  user_name: string;
  user_email: string;
  user_phone?: string;
  project_description?: string;
  service_type?: string;
  preferred_deadline?: string;
  created_at: string;
  files: Array<{
    id: string;
    file_name: string;
    file_url: string;
    file_type: string | null;
    file_size: number | null;
    description?: string;
  }>;
}

export function ProjectsView() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();
  
  const { data: quoteSubmissions, isLoading, refetch } = useQuery({
    queryKey: ['quote-submissions'],
    queryFn: async () => {
      // Get all quote files from the enhanced table
      const { data: files, error: filesError } = await supabase
        .from('quote_files')
        .select('*')
        .order('created_at', { ascending: false });

      if (filesError) throw filesError;

      console.log('Fetched quote files:', files);

      if (!files || files.length === 0) {
        return [];
      }

      // Group files by quote submission (using quote_id or user info + date)
      const submissionsMap = new Map<string, QuoteSubmission>();
      
      files.forEach(file => {
        // Create a unique key for grouping submissions
        const key = file.quote_id || `${file.user_email || 'anonymous'}_${new Date(file.created_at || '').toDateString()}`;
        
        if (!submissionsMap.has(key)) {
          submissionsMap.set(key, {
            id: key,
            user_name: file.user_name || 'Anonymous User',
            user_email: file.user_email || 'No email provided',
            user_phone: file.user_phone,
            project_description: file.project_description,
            service_type: file.service_type,
            preferred_deadline: file.preferred_deadline,
            created_at: file.created_at || new Date().toISOString(),
            files: []
          });
        }
        
        submissionsMap.get(key)!.files.push({
          id: file.id,
          file_name: file.file_name,
          file_url: file.file_url,
          file_type: file.file_type,
          file_size: file.file_size,
          description: file.description
        });
      });

      const submissions = Array.from(submissionsMap.values());
      console.log('Processed quote submissions:', submissions);
      
      return submissions;
    }
  });

  const deleteFileMutation = useMutation({
    mutationFn: async (fileId: string) => {
      const { error } = await supabase
        .from('quote_files')
        .delete()
        .eq('id', fileId);
      
      if (error) throw error;
      return fileId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quote-submissions'] });
      toast.success("File deleted successfully");
    },
    onError: (error) => {
      console.error('Error deleting file:', error);
      toast.error("Failed to delete file. Please try again.");
    }
  });

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      toast.loading("Preparing download...");
      
      const { data, error } = await supabase.storage
        .from('quote_submissions')
        .createSignedUrl(fileUrl, 60);
      
      if (error) {
        console.error('Error creating signed URL:', error);
        toast.dismiss();
        toast.error(`Failed to download ${fileName}: ${error.message}`);
        return;
      }
      
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
      const viewableTypes = ['image/', 'text/', 'application/pdf'];
      const isViewable = fileType && viewableTypes.some(type => fileType.startsWith(type));
      
      if (!isViewable) {
        toast.error("This file type cannot be previewed in browser");
        return;
      }
      
      toast.loading("Loading preview...");
      
      const { data, error } = await supabase.storage
        .from('quote_submissions')
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

  const toggleRowExpansion = (submissionId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(submissionId)) {
      newExpanded.delete(submissionId);
    } else {
      newExpanded.add(submissionId);
    }
    setExpandedRows(newExpanded);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quote Management</h1>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            refetch();
            toast.success("Quote submissions refreshed");
          }}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Quote Submissions</CardTitle>
          <CardDescription>All user quote requests with complete information</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
          ) : quoteSubmissions && quoteSubmissions.length > 0 ? (
            <div className="space-y-4">
              {quoteSubmissions.map((submission) => (
                <Card key={submission.id} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-blue-500" />
                          <span className="font-semibold">{submission.user_name}</span>
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Mail className="h-3 w-3" />
                            <span>{submission.user_email}</span>
                          </div>
                          {submission.user_phone && (
                            <div className="flex items-center space-x-1">
                              <Phone className="h-3 w-3" />
                              <span>{submission.user_phone}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(submission.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        {submission.service_type && (
                          <div className="text-sm">
                            <span className="font-medium">Service: </span>
                            <Badge variant="secondary">{submission.service_type}</Badge>
                          </div>
                        )}
                        {submission.preferred_deadline && (
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium">Deadline: </span>
                            {new Date(submission.preferred_deadline).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleRowExpansion(submission.id)}
                      >
                        {expandedRows.has(submission.id) ? 'Collapse' : 'Expand'}
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <Collapsible 
                    open={expandedRows.has(submission.id)}
                    onOpenChange={() => toggleRowExpansion(submission.id)}
                  >
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        {submission.project_description && (
                          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-start space-x-2">
                              <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5" />
                              <div>
                                <p className="text-sm font-medium text-gray-700">Project Description:</p>
                                <p className="text-sm text-gray-600 mt-1">{submission.project_description}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div className="space-y-3">
                          <h4 className="font-medium text-sm text-gray-700">
                            Uploaded Files ({submission.files.length})
                          </h4>
                          {submission.files.map((file) => (
                            <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-100 rounded">
                                  <Calculator className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{file.file_name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {file.file_type || 'Unknown'} • {file.file_size ? formatFileSize(file.file_size) : 'N/A'}
                                  </p>
                                  {file.description && (
                                    <p className="text-xs text-gray-500 mt-1">{file.description}</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handlePreview(file.file_url, file.file_type)}
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  Preview
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleDownload(file.file_url, file.file_name)}
                                >
                                  <Download className="h-3 w-3 mr-1" />
                                  Download
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <Trash2 className="h-3 w-3 mr-1" />
                                      Delete
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the file
                                        "{file.file_name}" from the storage and database.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => deleteFileMutation.mutate(file.id)}
                                        className="bg-red-500 hover:bg-red-600"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <Calculator className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium">No Quote Submissions</h3>
              <p className="text-muted-foreground mt-2 max-w-md">
                When users submit quotes with files through your website's quote page, they will appear here with complete user information.
              </p>
            </div>
          )}
        </CardContent>
        {quoteSubmissions && quoteSubmissions.length > 0 && (
          <CardFooter>
            <div className="w-full flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Showing {quoteSubmissions.length} quote submission{quoteSubmissions.length !== 1 ? 's' : ''}
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
              <Button variant="ghost" size="sm" onClick={() => setPreviewUrl(null)}>
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
