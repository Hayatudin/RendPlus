import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, FileText, Image, File } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

interface FormData {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  projectDescription: string;
  preferredDeadline: string;
}

interface UploadedFile {
  file: File;
  id: string;
  description: string;
}

const QuotePage = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    serviceType: '',
    projectDescription: '',
    preferredDeadline: ''
  });
  
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    
    const newFiles = selectedFiles.map(file => ({
      file,
      id: uuidv4(),
      description: ''
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const updateFileDescription = (fileId: string, description: string) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, description } : f
    ));
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (fileType.includes('pdf') || fileType.includes('document')) return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const uploadFile = async (file: File, fileName: string) => {
    const { data, error } = await supabase.storage
      .from('quote_submissions')
      .upload(fileName, file);
    
    if (error) throw error;
    return data.path;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.serviceType || files.length === 0) {
      toast.error("Please fill in all required fields and upload at least one file");
      return;
    }

    setIsSubmitting(true);

    const submissionPromise = async () => {
      const quoteId = uuidv4();
      console.log('Starting quote submission with ID:', quoteId);
      
      // Upload files and save to database
      for (const fileData of files) {
        const fileName = `${quoteId}/${fileData.file.name}`;
        console.log('Uploading file:', fileName);
        const filePath = await uploadFile(fileData.file, fileName);
        
        const { error: dbError } = await supabase
          .from('quote_files')
          .insert({
            quote_id: quoteId,
            file_name: fileData.file.name,
            file_url: filePath,
            file_type: fileData.file.type,
            file_size: fileData.file.size,
            description: fileData.description || null,
            user_name: formData.name,
            user_email: formData.email,
            user_phone: formData.phone || null,
            project_description: formData.projectDescription || null,
            service_type: formData.serviceType,
            preferred_deadline: formData.preferredDeadline ? new Date(formData.preferredDeadline).toISOString() : null
          });
        
        if (dbError) throw dbError; // This will be caught by toast.promise
      }
      
      // Send notification to admin devices (don't fail the whole process if this fails)
      try {
        console.log('Invoking notification function for quote submission...');
        const { error: notificationError } = await supabase.functions.invoke('send-quote-notification', {
          body: {
            userName: formData.name,
            userEmail: formData.email
          }
        });
        if (notificationError) {
          // Log the error but don't throw, as the quote submission was successful
          console.error('Notification function error:', notificationError);
        }
      } catch (notificationError) {
        console.error('Error calling notification function:', notificationError);
      }
    };

    toast.promise(submissionPromise(), {
      loading: "Submitting your quote request...",
      success: () => {
        // Reset form on success
        setFormData({
          name: '', email: '', phone: '', serviceType: '',
          projectDescription: '', preferredDeadline: ''
        });
        setFiles([]);
        setIsSubmitting(false);
        return "Quote submitted successfully! The admin has been notified.";
      },
      error: (error) => {
        console.error('Error submitting quote:', error);
        setIsSubmitting(false);
        return "Failed to submit quote. Please try again.";
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Request a Quote</h1>
          <p className="text-xl text-gray-600">
            Tell us about your project and upload your files to get a detailed quote
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div>
                  <Label htmlFor="serviceType">Service Type *</Label>
                  <Select value={formData.serviceType} onValueChange={(value) => handleInputChange('serviceType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3d-modeling">3D Modeling</SelectItem>
                      <SelectItem value="architectural-visualization">Architectural Visualization</SelectItem>
                      <SelectItem value="interior-design">Interior Design</SelectItem>
                      <SelectItem value="product-visualization">Product Visualization</SelectItem>
                      <SelectItem value="animation">Animation</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="deadline">Preferred Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.preferredDeadline}
                    onChange={(e) => handleInputChange('preferredDeadline', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Project Description *</Label>
                <Textarea
                  id="description"
                  value={formData.projectDescription}
                  onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                  placeholder="Describe your project in detail..."
                  className="min-h-[120px]"
                  required
                />
              </div>
              
              <div>
                <Label>Upload Files *</Label>
                <div className="mt-2">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          Images, PDFs, CAD files, or any project-related files
                        </p>
                      </div>
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        accept="*/*"
                      />
                    </label>
                  </div>
                </div>
                
                {files.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <h3 className="font-medium">Uploaded Files:</h3>
                    {files.map((fileData) => (
                      <div key={fileData.id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="p-2 bg-blue-100 rounded">
                            {getFileIcon(fileData.file.type)}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{fileData.file.name}</p>
                            <p className="text-xs text-gray-500">
                              {fileData.file.type} • {(fileData.file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                            <Input
                              placeholder="Add file description (optional)"
                              value={fileData.description}
                              onChange={(e) => updateFileDescription(fileData.id, e.target.value)}
                              className="mt-2 text-xs"
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(fileData.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Quote Request"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuotePage;