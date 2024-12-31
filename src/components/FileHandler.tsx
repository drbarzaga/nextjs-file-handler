import { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload } from "lucide-react";
import { FileList } from "./FileList";
import axios, { AxiosProgressEvent } from "axios";

type Props = {
  availableFiles: string[];
  onUpload: (file: File) => Promise<void>;
  onDownload: (file: string) => Promise<void>;
};

const FileHandler: FC<Props> = ({ availableFiles, onUpload, onDownload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setProgress(0);
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          }
        },
      });

      console.log("File uploaded successfully", response.data);
      onUpload(selectedFile);
      setSelectedFile(null);
    } catch (error) {
      console.log(`Error uploading file: ${error}`);
      setProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (fileName: string) => {
    setIsDownloading(true);
    setProgress(0);
    try {
      const response = await axios.get(`/api/download/${fileName}`, {
        responseType: "blob",
        onDownloadProgress: (progressEvent: AxiosProgressEvent) => {
          const percentCompleted = Math.round(
            progressEvent.total
              ? (progressEvent.loaded * 100) / progressEvent.total
              : 0
          );
          setProgress(percentCompleted);
        },
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      onDownload(fileName);
    } catch (error) {
      console.log(`Error downloading file: ${error}`);
      setProgress(0);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Manejador de Archivos</CardTitle>
        <CardDescription>
          Sube o descarga archivos y monitorea el progreso
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Input
              type="file"
              onChange={handleFileChange}
              disabled={isUploading || isDownloading}
            />
            <Button
              className="mt-2"
              variant="outline"
              onClick={handleUpload}
              disabled={!selectedFile || isUploading || isDownloading}
            >
              <Upload className="mr-2 h-4 w-4" /> Subir
            </Button>
          </div>
          <FileList
            files={availableFiles}
            onDownload={handleDownload}
            isDownloading={isDownloading}
          />
          {(isUploading || isDownloading) && (
            <Progress value={progress} className="w-full" />
          )}
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          {isUploading
            ? "Subiendo archivo..."
            : isDownloading
            ? "Descargando archivo..."
            : selectedFile
            ? `Archivo seleccionado: ${selectedFile.name}`
            : "Ningún archivo seleccionado"}
        </p>
      </CardFooter>
    </Card>
  );
};

export default FileHandler;
