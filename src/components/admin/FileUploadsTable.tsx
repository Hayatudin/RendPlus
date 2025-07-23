
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatFileSize } from "@/lib/utils";

interface FileUpload {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  created_at: string;
  description: string | null;
}

export function FileUploadsTable() {
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('quote_files')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('quote-files')
        .download(fileUrl);

      if (error) throw error;

      // Create a download link
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  if (isLoading) {
    return <div>Loading files...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>File Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Uploaded</TableHead>
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
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDownload(file.file_url, file.file_name)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
