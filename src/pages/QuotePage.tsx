import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowRight, FileUp, Info, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

const QuotePage = () => {
  const { toast } = useToast();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [referenceFiles, setReferenceFiles] = useState<File[]>([]);
  const [projectType, setProjectType] = useState("modeling-rendering");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Get plan from URL query parameter
  const queryParams = new URLSearchParams(location.search);
  const plan = queryParams.get("plan") || "";
  
  // Define available services by plan
  const serviceOptions = {
    basic: ["basic"],
    standard: ["standard", "basic-rendering", "advanced-rendering"],
    premium: ["advanced", "advanced-rendering", "animation", "full-package"],
    custom: ["custom-service"],
    "": ["basic", "standard", "advanced", "basic-rendering", "advanced-rendering", "animation", "full-package", "custom-service"]
  };
  
  // If no plan is selected, navigate to pricing section
  useEffect(() => {
    if (!plan && location.pathname === "/quote") {
      navigate("/#pricing");
    }
  }, [plan, location.pathname, navigate]);

  // Set default project type based on plan
  useEffect(() => {
    if (plan === "basic") {
      setProjectType("modeling-only");
    } else if (plan === "standard") {
      setProjectType("rendering-only");
    } else if (plan === "premium") {
      setProjectType("modeling-rendering");
    } else if (plan === "custom") {
      setProjectType("custom");
    }
  }, [plan]);

  const allowedFileTypes = [
    '.dwg', '.dxf', '.rvt', '.skp', 
    '.max', '.3dm', '.pln', '.dae'
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const extension = '.' + file.name.split('.').pop()?.toLowerCase();
      const isValid = allowedFileTypes.includes(extension);
      if (!isValid) {
        toast({
          title: "Invalid file type",
          description: `File "${file.name}" is not supported. Please upload files in the following formats: ${allowedFileTypes.join(', ')}`,
          variant: "destructive",
        });
      }
      return isValid;
    });

    setSelectedFiles(prevFiles => [...prevFiles, ...validFiles]);
  };

  const handleReferenceFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setReferenceFiles(prevFiles => [...prevFiles, ...files]);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, fileType: 'project' | 'reference') => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    
    if (fileType === 'project') {
      const validFiles = files.filter(file => {
        const extension = '.' + file.name.split('.').pop()?.toLowerCase();
        const isValid = allowedFileTypes.includes(extension);
        if (!isValid) {
          toast({
            title: "Invalid file type",
            description: `File "${file.name}" is not supported. Please upload files in the following formats: ${allowedFileTypes.join(', ')}`,
            variant: "destructive",
          });
        }
        return isValid;
      });
      setSelectedFiles(prevFiles => [...prevFiles, ...validFiles]);
    } else {
      setReferenceFiles(prevFiles => [...prevFiles, ...files]);
    }
  };

  const uploadFileToStorage = async (file: File): Promise<{ url: string, size: number, type: string } | null> => {
    try {
      const { data: bucketData, error: bucketError } = await supabase
        .storage
        .getBucket('quote-files');
        
      if (bucketError && bucketError.message.includes('does not exist')) {
        console.error('Bucket does not exist:', bucketError);
        toast({
          title: "Storage Error",
          description: "The storage system is not properly configured. Please contact support.",
          variant: "destructive",
        });
        return null;
      }
      
      const fileExt = file.name.split('.').pop();
      const filePath = `${uuidv4()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('quote-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        console.error('Error uploading file:', error);
        toast({
          title: "Upload Failed",
          description: `Failed to upload ${file.name}. ${error.message}`,
          variant: "destructive",
        });
        return null;
      }
      
      return {
        url: data.path,
        size: file.size,
        type: file.type
      };
    } catch (error) {
      console.error('Error in upload process:', error);
      toast({
        title: "Upload Error",
        description: "An unexpected error occurred during upload. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  // Save uploaded file information to "projects" table (instead of "quote_files")
  const saveProjectRecord = async ({
    userId,
    fileData,
    fileName,
    projectTitle,
    projectDescription,
  }: {
    userId: string;
    fileData: { url: string; size: number; type: string };
    fileName: string;
    projectTitle: string;
    projectDescription: string | null;
  }) => {
    try {
      const { error } = await supabase.from("projects").insert({
        user_id: userId,
        title: projectTitle,
        description: projectDescription,
        file_url: fileData.url,
        file_name: fileName,
        file_type: fileData.type,
        file_size: fileData.size,
      });
      if (error) {
        toast({
          title: "Database Error",
          description: `Could not save the file (${fileName}) to the database: ${error.message}`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    } catch (err) {
      toast({
        title: "Database Error",
        description: `Unexpected error while saving file to the project table.`,
        variant: "destructive",
      });
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit your quote request.",
        variant: "destructive",
      });
      navigate(
        `/login?returnTo=${encodeURIComponent(
          location.pathname + location.search
        )}`
      );
      return;
    }

    if (selectedFiles.length === 0) {
      toast({
        title: "Files Required",
        description:
          "Please upload at least one project file to submit your quote request.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      // Use project title as filename by default, and description from form
      const formData = new FormData(e.currentTarget);
      const projectTitle = formData.get("name") as string;
      const projectDescription = formData.get(
        "project-description"
      ) as string | null;

      const totalFiles = selectedFiles.length + referenceFiles.length;
      let completedFiles = 0;
      let failedFiles = 0;

      const projectUploadPromises = selectedFiles.map(async (file) => {
        const fileData = await uploadFileToStorage(file);
        if (fileData) {
          const result = await saveProjectRecord({
            userId: user.id,
            fileData,
            fileName: file.name,
            projectTitle,
            projectDescription,
          });
          completedFiles++;
          setUploadProgress(Math.floor((completedFiles / totalFiles) * 100));
          return result;
        }
        failedFiles++;
        return false;
      });

      const refUploadPromises = referenceFiles.map(async (file) => {
        const fileData = await uploadFileToStorage(file);
        if (fileData) {
          const result = await saveProjectRecord({
            userId: user.id,
            fileData,
            fileName: file.name,
            projectTitle: `${projectTitle || "Reference file"}`,
            projectDescription: "Reference material",
          });
          completedFiles++;
          setUploadProgress(Math.floor((completedFiles / totalFiles) * 100));
          return result;
        }
        failedFiles++;
        return false;
      });

      const results = await Promise.all([
        ...projectUploadPromises,
        ...refUploadPromises,
      ]);

      if (results.some((r) => !r)) {
        toast({
          title: "Some files failed to upload",
          description:
            "Not all files were uploaded successfully. Please try again or contact support.",
          variant: "destructive",
        });
      } else {
        sonnerToast("Quote Request Submitted!", {
          description:
            "Thank you for your request. We'll review your project details and contact you soon.",
        });

        setSelectedFiles([]);
        setReferenceFiles([]);
        setUploadProgress(0);
        formRef.current?.reset();
      }
    } catch (error) {
      console.error("Error submitting quote:", error);
      toast({
        title: "Submission Failed",
        description:
          "Failed to submit quote request. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeFile = (index: number, fileType: 'project' | 'reference') => {
    if (fileType === 'project') {
      setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    } else {
      setReferenceFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <section className="bg-rend-primary text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-montserrat font-bold text-4xl md:text-5xl mb-4">Request a Quote</h1>
            <p className="max-w-2xl mx-auto text-lg">
              Fill out the form below with your project details, and we'll provide a customized quote.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                  <h2 className="font-montserrat font-semibold text-xl text-rend-dark">1. Project Type</h2>
                  <RadioGroup 
                    value={projectType} 
                    onValueChange={setProjectType}
                    disabled={!!plan}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="modeling-only" id="modeling-only" disabled={plan === "standard"} />
                        <Label htmlFor="modeling-only" className={plan === "standard" ? "opacity-50" : ""}>3D Modeling Only</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="rendering-only" id="rendering-only" disabled={plan === "basic"} />
                        <Label htmlFor="rendering-only" className={plan === "basic" ? "opacity-50" : ""}>Rendering Only</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="modeling-rendering" id="modeling-rendering" disabled={plan === "basic" || plan === "standard"} />
                        <Label htmlFor="modeling-rendering" className={plan === "basic" || plan === "standard" ? "opacity-50" : ""}>3D Modeling & Rendering Package</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="custom" id="custom" disabled={plan !== "custom" && plan !== ""} />
                        <Label htmlFor="custom" className={plan !== "custom" && plan !== "" ? "opacity-50" : ""}>Custom Project</Label>
                      </div>
                    </div>
                  </RadioGroup>
                  {plan && (
                    <div className="bg-blue-50 p-3 rounded-md flex items-start gap-2">
                      <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-blue-700">
                        You've selected the {plan.charAt(0).toUpperCase() + plan.slice(1)} plan. To change project type, please select a different pricing plan.
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h2 className="font-montserrat font-semibold text-xl text-rend-dark">2. Service Type</h2>
                  <Select name="service-type" defaultValue={serviceOptions[plan as keyof typeof serviceOptions]?.[0] || "standard"}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {plan === "basic" || plan === "" ? (
                        <SelectItem value="basic">Basic 3D Model</SelectItem>
                      ) : null}
                      
                      {plan === "standard" || plan === "" || plan === "premium" ? (
                        <SelectItem value="standard">Standard 3D Model</SelectItem>
                      ) : null}
                      
                      {plan === "premium" || plan === "" ? (
                        <SelectItem value="advanced">Advanced 3D Model</SelectItem>
                      ) : null}
                      
                      {plan === "standard" || plan === "" || plan === "premium" ? (
                        <>
                          <SelectItem value="basic-rendering">Basic Rendering</SelectItem>
                          <SelectItem value="advanced-rendering">Advanced Rendering</SelectItem>
                        </>
                      ) : null}
                      
                      {plan === "premium" || plan === "" ? (
                        <>
                          <SelectItem value="animation">Animation & Walkthrough</SelectItem>
                          <SelectItem value="full-package">Full Package (Model + Rendering + Animation)</SelectItem>
                        </>
                      ) : null}
                      
                      {plan === "custom" || plan === "" ? (
                        <SelectItem value="custom-service">Custom Service</SelectItem>
                      ) : null}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <h2 className="font-montserrat font-semibold text-xl text-rend-dark">3. Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" name="name" placeholder="Your full name" defaultValue={user?.user_metadata?.full_name || ''} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" name="email" type="email" placeholder="your.email@example.com" defaultValue={user?.email || ''} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" name="phone" placeholder="Your phone number" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name (Optional)</Label>
                      <Input id="company" name="company" placeholder="Your company name" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="font-montserrat font-semibold text-xl text-rend-dark">4. Project Details</h2>
                  
                  <div className="space-y-2">
                    <Label htmlFor="project-description">Project Description</Label>
                    <Textarea 
                      id="project-description" 
                      name="project-description"
                      placeholder="Provide a brief description of your project, including type (architectural, product, interior), complexity, and any other relevant details..." 
                      rows={6} 
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeline">Preferred Timeline</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="timeline"
                          type="button"
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Select your preferred deadline</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          disabled={(date) => date < new Date()}
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    {date && (
                      <input 
                        type="hidden" 
                        name="preferred-deadline" 
                        value={date.toISOString()} 
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="font-montserrat font-semibold text-xl text-rend-dark">5. Project Files (Required)</h2>
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e, 'project')}
                  >
                    <FileUp className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Drag and drop project files here, or click to browse</p>
                    <p className="text-gray-500 text-sm mb-4">
                      Accepted formats: .DWG, .DXF, .RVT, .SKP, .MAX, .3DM, .PLN, .DAE (COLLADA)
                    </p>
                    <Button type="button" variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                      Browse Files
                    </Button>
                    <input 
                      type="file" 
                      id="file-upload"
                      className="hidden" 
                      multiple 
                      accept=".dwg,.dxf,.rvt,.skp,.max,.3dm,.pln,.dae"
                      onChange={handleFileChange}
                    />
                  </div>

                  {selectedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="font-semibold">Selected Project Files:</p>
                      <div className="space-y-2">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <span className="text-sm text-gray-600">{file.name}</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeFile(index, 'project')}
                              className="text-red-500 hover:text-red-700"
                              type="button"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h2 className="font-montserrat font-semibold text-xl text-rend-dark">6. Reference Materials (Optional)</h2>
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e, 'reference')}
                  >
                    <FileUp className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Drag and drop reference materials here, or click to browse</p>
                    <p className="text-gray-500 text-sm mb-4">
                      Photos, sketches, inspirations, or any other reference materials
                    </p>
                    <Button type="button" variant="outline" onClick={() => document.getElementById('reference-upload')?.click()}>
                      Browse Files
                    </Button>
                    <input 
                      type="file" 
                      id="reference-upload"
                      className="hidden" 
                      multiple 
                      onChange={handleReferenceFileChange}
                    />
                  </div>

                  {referenceFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="font-semibold">Selected Reference Materials:</p>
                      <div className="space-y-2">
                        {referenceFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <span className="text-sm text-gray-600">{file.name}</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeFile(index, 'reference')}
                              className="text-red-500 hover:text-red-700"
                              type="button"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {isSubmitting && uploadProgress > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                    <p className="text-sm text-gray-600 mt-1">Uploading: {uploadProgress}%</p>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : user ? "Submit Quote Request" : "Login to Submit Quote Request"}
                  {!isSubmitting && <ArrowRight className="ml-2" />}
                </Button>

                {!user && (
                  <div className="text-center mt-2 text-sm text-gray-500">
                    You need to be logged in to submit a quote request. Your form data will be saved.
                  </div>
                )}
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default QuotePage;
