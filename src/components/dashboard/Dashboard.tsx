import React, { useState, useEffect } from "react";
import Header from "./Header";
import FileDisplay from "./FileDisplay";
import UploadModal from "../upload/UploadModal";
import SecureViewer from "../viewer/SecureViewer";
import ShareModal from "./ShareModal";

interface File {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  thumbnailUrl?: string;
  url?: string;
  content?: string;
}

interface DashboardProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  files?: File[];
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  onLogout?: () => void;
}

const Dashboard = ({
  userName = "John Doe",
  userEmail = "john.doe@example.com",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
  files = [
    {
      id: "file-1",
      name: "Project Presentation.pdf",
      type: "PDF",
      size: 2500000,
      uploadDate: "2023-06-15T10:30:00Z",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      url: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: "file-2",
      name: "Company Logo.png",
      type: "PNG",
      size: 1200000,
      uploadDate: "2023-06-10T14:20:00Z",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1563089145-599997674d42?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      url: "https://images.unsplash.com/photo-1563089145-599997674d42?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: "file-3",
      name: "Financial Report Q2.xlsx",
      type: "XLSX",
      size: 3500000,
      uploadDate: "2023-06-05T09:15:00Z",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      content: "Financial data for Q2 2023. Confidential information.",
    },
    {
      id: "file-4",
      name: "User Manual.docx",
      type: "DOCX",
      size: 1800000,
      uploadDate: "2023-05-28T11:45:00Z",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      url: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: "file-5",
      name: "Product Roadmap.pdf",
      type: "PDF",
      size: 4200000,
      uploadDate: "2023-05-20T16:30:00Z",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      url: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: "file-6",
      name: "Team Photo.jpg",
      type: "JPG",
      size: 5500000,
      uploadDate: "2023-05-15T13:10:00Z",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
  ],
  isDarkMode = false,
  onToggleTheme = () => {},
  onLogout = () => {},
}: DashboardProps) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [viewingFile, setViewingFile] = useState<File | null>(null);
  const [sharingFile, setSharingFile] = useState<File | null>(null);
  const [dashboardFiles, setDashboardFiles] = useState<File[]>(files);

  // Handle file upload completion with improved file handling
  const handleUploadComplete = (uploadedFiles: File[]) => {
    // In a real app, you would process the uploaded files here
    // For now, we'll just add mock entries to the files list
    const newFiles = uploadedFiles.map((file, index) => {
      // Determine file type and appropriate thumbnail
      const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
      const fileType = file.name.split(".").pop()?.toUpperCase() || "UNKNOWN";

      // Select appropriate thumbnail based on file type
      let thumbnailUrl =
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";

      // Choose different thumbnails based on file type
      if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension)) {
        thumbnailUrl =
          "https://images.unsplash.com/photo-1563089145-599997674d42?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";
      } else if (["pdf"].includes(fileExtension)) {
        thumbnailUrl =
          "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";
      } else if (["doc", "docx"].includes(fileExtension)) {
        thumbnailUrl =
          "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";
      } else if (["xls", "xlsx"].includes(fileExtension)) {
        thumbnailUrl =
          "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";
      }

      // Create a URL for the file (in a real app, this would be a secure URL)
      // For demo purposes, we're using the same URL as the thumbnail
      const url = thumbnailUrl;

      return {
        id: `new-file-${Date.now()}-${index}`,
        name: file.name,
        type: fileType,
        size: file.size,
        uploadDate: new Date().toISOString(),
        thumbnailUrl,
        url,
        // For text files, we could add content preview
        content: ["txt", "md", "json"].includes(fileExtension)
          ? "This is a preview of the uploaded content. In a real application, this would show the actual file content."
          : undefined,
      };
    });

    // Add new files at the beginning of the list so they appear first
    setDashboardFiles([...newFiles, ...dashboardFiles]);
    setIsUploadModalOpen(false);
  };

  // Handle file view request
  const handleViewFile = (fileId: string) => {
    const fileToView = dashboardFiles.find((file) => file.id === fileId);
    if (fileToView) {
      setViewingFile(fileToView);
    }
  };

  // Handle file share request
  const handleShareFile = (fileId: string) => {
    const fileToShare = dashboardFiles.find((file) => file.id === fileId);
    if (fileToShare) {
      setSharingFile(fileToShare);
    }
  };

  // Handle share completion
  const handleShareComplete = async (emails: string[], options: any) => {
    if (!sharingFile) return;

    try {
      // In a real app with Supabase connected, this would call the API
      // import { shareFile } from "@/lib/api";
      // await shareFile(sharingFile.id, emails, options);

      console.log(`Sharing file ${sharingFile.name} with:`, emails);
      console.log("Share options:", options);

      // Show a toast or notification that the file was shared successfully
      alert(`File shared with ${emails.length} recipients`);
    } catch (error) {
      console.error("Error sharing file:", error);
      alert("Failed to share file. Please try again.");
    } finally {
      setSharingFile(null);
    }
  };

  // Enhanced security measures when dashboard mounts
  useEffect(() => {
    // Disable developer tools and other security measures
    const setupSecurityMeasures = () => {
      // Prevent keyboard shortcuts for developer tools
      const handleKeyDown = (e: KeyboardEvent) => {
        // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U
        if (
          e.key === "F12" ||
          (e.ctrlKey && (e.key === "u" || e.key === "U")) ||
          (e.ctrlKey &&
            e.shiftKey &&
            (e.key === "I" || e.key === "J" || e.key === "C"))
        ) {
          e.preventDefault();
          return false;
        }
      };

      // Detect and disable browser's built-in developer tools
      const disableDevTools = () => {
        // Detect if dev tools are open
        const devToolsDetector = () => {
          const widthThreshold = window.outerWidth - window.innerWidth > 160;
          const heightThreshold = window.outerHeight - window.innerHeight > 160;
          if (widthThreshold || heightThreshold) {
            // Dev tools might be open, you could take action here
            console.log("Developer tools may be open");
          }
        };

        // Check periodically
        setInterval(devToolsDetector, 1000);

        // Override console methods in production
        if (process.env.NODE_ENV === "production") {
          // This is just a basic example - in a real app you'd want more sophisticated protection
          const noop = () => {};
          // @ts-ignore
          window.console = {
            ...window.console,
            log: noop,
            info: noop,
            warn: noop,
            error: noop,
            debug: noop,
          };
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      disableDevTools();

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    };

    const cleanup = setupSecurityMeasures();

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header
        userName={userName}
        userEmail={userEmail}
        userAvatar={userAvatar}
        isDarkMode={isDarkMode}
        onToggleTheme={onToggleTheme}
        onLogout={onLogout}
        onUpload={() => setIsUploadModalOpen(true)}
      />

      <main className="flex-1 overflow-hidden">
        <FileDisplay
          files={dashboardFiles}
          onViewFile={handleViewFile}
          onShareFile={handleShareFile}
        />
      </main>

      {/* Modals */}
      {isUploadModalOpen && (
        <UploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onUploadComplete={handleUploadComplete}
        />
      )}

      {viewingFile && (
        <SecureViewer
          isOpen={!!viewingFile}
          onClose={() => setViewingFile(null)}
          file={{
            id: viewingFile.id,
            name: viewingFile.name,
            type: viewingFile.type,
            url: viewingFile.url || "",
            content: viewingFile.content,
          }}
          userName={userName}
        />
      )}

      {sharingFile && (
        <ShareModal
          isOpen={!!sharingFile}
          onClose={() => setSharingFile(null)}
          file={{
            id: sharingFile.id,
            name: sharingFile.name,
            type: sharingFile.type,
          }}
          onShareComplete={handleShareComplete}
        />
      )}
    </div>
  );
};

export default Dashboard;
