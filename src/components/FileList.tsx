import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface FileListProps {
  files: string[];
  onDownload: (fileName: string) => void;
  isDownloading: boolean;
}

export const FileList: React.FC<FileListProps> = ({
  files,
  onDownload,
  isDownloading,
}) => {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Archivos disponibles</h3>
      {files.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No hay archivos disponibles para descargar.
        </p>
      ) : (
        <ul className="space-y-2">
          {files.map((file) => (
            <li key={file} className="flex items-center justify-between">
              <span className="text-sm">{file}</span>
              <Button
                size="sm"
                onClick={() => onDownload(file)}
                disabled={isDownloading}
              >
                <Download className="mr-2 h-4 w-4" /> Descargar
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
