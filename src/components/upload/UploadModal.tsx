import React, { useState, useCallback } from "react";
import { Upload, X, FileIcon, CheckCircle, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface UploadModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onUploadComplete?: (files: File[]) => void;
}

interface FileUploadState {
  file: File;
  progress: number;
  status: "uploading" | "complete" | "error";
  error?: string;
}

const UploadModal: React.FC<UploadModalProps> = ({
  isOpen = true,
  onClose = () => {},
  onUploadComplete = () => {},
}) => {
  const [files, setFiles] = useState<FileUploadState[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles: File[]) => {
    const fileStates = newFiles.map((file) => ({
      file,
      progress: 0,
      status: "uploading" as const,
    }));

    setFiles((prev) => [...prev, ...fileStates]);

    // Simulate upload progress for each file
    fileStates.forEach((fileState) => {
      simulateFileUpload(fileState.file);
    });
  };

  const simulateFileUpload = (file: File) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        setFiles((prev) =>
          prev.map((f) =>
            f.file === file ? { ...f, progress: 100, status: "complete" } : f,
          ),
        );

        // Check if all files are complete
        setTimeout(() => {
          setFiles((prev) => {
            const allComplete = prev.every((f) => f.status === "complete");
            if (allComplete && prev.length > 0) {
              // Only call onUploadComplete when all files are done
              setTimeout(() => {
                onUploadComplete(prev.map((f) => f.file));
              }, 100);
            }
            return prev;
          });
        }, 500);
      } else {
        setFiles((prev) =>
          prev.map((f) => (f.file === file ? { ...f, progress } : f)),
        );
      }
    }, 300);
  };

  const removeFile = (fileToRemove: File) => {
    setFiles((prev) => prev.filter((f) => f.file !== fileToRemove));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-lg bg-background">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
        </DialogHeader>

        <div
          className={`mt-4 border-2 border-dashed rounded-lg p-6 transition-colors ${isDragging ? "border-primary bg-primary/5" : "border-gray-300"}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-3">
            <Upload className="h-10 w-10 text-gray-400" />
            <div className="text-center">
              <p className="text-base font-medium">
                Drag and drop your files here
              </p>
              <p className="text-sm text-gray-500">or</p>
            </div>
            <label htmlFor="file-upload" className="cursor-pointer">
              <Button variant="outline" className="mt-2">
                Browse Files
              </Button>
              <input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileInput}
              />
            </label>
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-4 max-h-60 overflow-y-auto">
            <h3 className="text-sm font-medium mb-2">Files ({files.length})</h3>
            <div className="space-y-3">
              {files.map((fileState, index) => (
                <div
                  key={index}
                  className="flex items-center p-2 bg-gray-50 rounded-md"
                >
                  <div className="flex-shrink-0 mr-3">
                    <FileIcon className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0 mr-2">
                    <p className="text-sm font-medium truncate">
                      {fileState.file.name}
                    </p>
                    <div className="mt-1">
                      <Progress value={fileState.progress} className="h-1.5" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {fileState.status === "uploading"
                        ? `${Math.round(fileState.progress)}%`
                        : fileState.status === "complete"
                          ? "Complete"
                          : "Error"}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {fileState.status === "complete" ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : fileState.status === "error" ? (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    ) : (
                      <button
                        onClick={() => removeFile(fileState.file)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={
              files.length === 0 || !files.some((f) => f.status === "complete")
            }
            onClick={() =>
              onUploadComplete(
                files.filter((f) => f.status === "complete").map((f) => f.file),
              )
            }
          >
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadModal;
