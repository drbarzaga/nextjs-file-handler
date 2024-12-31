"use client";

import FileHandler from "@/components/FileHandler";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export default function Home() {
  const [availableFiles, setAvailableFiles] = useState<string[]>([]);

  const fetchAvailableFiles = useCallback(async () => {
    try {
      const response = await axios.get("/api/files");
      setAvailableFiles(response.data.files);
    } catch (error) {
      console.error("Error fetching available files:", error);
    }
  }, []);

  useEffect(() => {
    fetchAvailableFiles();
  }, [fetchAvailableFiles]);

  const simulateFileOperation = (duration: number): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(resolve, duration);
    });
  };

  const handleUpload = async () => {
    fetchAvailableFiles();
  };

  const handleDownload = async (fileName: string): Promise<void> => {
    // Simular una operación de descarga que toma 2 segundos
    await simulateFileOperation(2000);
    console.log(`Archivo "${fileName}" descargado exitosamente`);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <FileHandler
          availableFiles={availableFiles}
          onUpload={handleUpload}
          onDownload={handleDownload}
        />
      </main>
    </div>
  );
}
