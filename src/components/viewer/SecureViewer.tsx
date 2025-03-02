import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Download,
  AlertTriangle,
  Maximize,
  Minimize,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SecureViewerProps {
  isOpen?: boolean;
  onClose?: () => void;
  file?: {
    id: string;
    name: string;
    type: string;
    url: string;
    content?: string;
  };
  userName?: string;
}

const SecureViewer: React.FC<SecureViewerProps> = ({
  isOpen = true,
  onClose = () => {},
  file = {
    id: "file-1",
    name: "Sample Document.pdf",
    type: "pdf",
    url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
    content: "This is a sample secure document content.",
  },
  userName = "John Doe",
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5); // Mock total pages
  const viewerRef = useRef<HTMLDivElement>(null);

  // Function to toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      viewerRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Update fullscreen state based on document state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Enhanced security measures to prevent screenshots and copying
  useEffect(() => {
    if (!isOpen) return;

    // Prevent right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
    };

    // Prevent keyboard shortcuts for screenshots and copying
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent print screen, ctrl+P, ctrl+C, ctrl+S, etc.
      if (
        e.key === "PrintScreen" ||
        (e.ctrlKey &&
          (e.key === "p" ||
            e.key === "P" ||
            e.key === "c" ||
            e.key === "C" ||
            e.key === "s" ||
            e.key === "S"))
      ) {
        e.preventDefault();
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 3000);
      }
    };

    // Detect when window loses focus (potential screenshot attempt)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 3000);
      }
    };

    // Detect and prevent screen capture API
    const detectScreenCapture = async () => {
      try {
        // @ts-ignore - TypeScript doesn't know about getDisplayMedia
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          // Override getDisplayMedia to prevent screen recording
          // @ts-ignore
          const originalGetDisplayMedia =
            navigator.mediaDevices.getDisplayMedia;
          // @ts-ignore
          navigator.mediaDevices.getDisplayMedia = function () {
            setShowWarning(true);
            setTimeout(() => setShowWarning(false), 3000);
            return Promise.reject(new Error("Screen recording is not allowed"));
          };
        }
      } catch (error) {
        console.error("Error setting up screen capture prevention:", error);
      }
    };

    // Prevent selection of content
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
    };

    // Prevent drag and drop
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("selectstart", handleSelectStart);
    document.addEventListener("dragstart", handleDragStart);
    detectScreenCapture();

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("selectstart", handleSelectStart);
      document.removeEventListener("dragstart", handleDragStart);
    };
  }, [isOpen]);

  // Handle page navigation
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Generate watermark text with user info
  const generateWatermark = () => {
    const date = new Date().toLocaleString();
    return `Viewed by ${userName} on ${date} - CONFIDENTIAL`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-5xl w-[95vw] max-h-[90vh] p-0 overflow-hidden bg-white"
        ref={viewerRef}
      >
        <DialogHeader className="p-4 border-b">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-semibold truncate">
              {file.name}
            </DialogTitle>
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleFullscreen}
                      className="h-8 w-8"
                    >
                      {isFullscreen ? (
                        <Minimize className="h-4 w-4" />
                      ) : (
                        <Maximize className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Document viewer area */}
        <div className="relative flex-1 overflow-auto h-[calc(90vh-10rem)] bg-gray-100">
          {/* Watermark overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="text-gray-300 text-2xl font-bold opacity-20 transform -rotate-45 select-none">
              {generateWatermark()}
            </div>
          </div>

          {/* Document content with enhanced security */}
          <div className="relative z-0 flex items-center justify-center h-full">
            {file.type.toLowerCase() === "pdf" ? (
              <div className="bg-white shadow-lg w-[80%] h-[90%] flex items-center justify-center">
                <div className="relative w-full h-full overflow-hidden">
                  {/* Add a transparent overlay to prevent direct interaction with the content */}
                  <div
                    className="absolute inset-0 z-10"
                    onClick={(e) => e.preventDefault()}
                  ></div>
                  <img
                    src={file.url}
                    alt={file.name}
                    className="max-w-full max-h-full object-contain"
                    style={{
                      userSelect: "none",
                      pointerEvents: "none",
                      WebkitUserSelect: "none",
                      MozUserSelect: "none",
                      msUserSelect: "none",
                    }}
                    onDragStart={(e) => e.preventDefault()}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                </div>
              </div>
            ) : file.type.toLowerCase().includes("image") ||
              file.type.toLowerCase().includes("jpg") ||
              file.type.toLowerCase().includes("jpeg") ||
              file.type.toLowerCase().includes("png") ||
              file.type.toLowerCase().includes("gif") ? (
              <div className="relative">
                {/* Add a transparent overlay to prevent direct interaction with the content */}
                <div
                  className="absolute inset-0 z-10"
                  onClick={(e) => e.preventDefault()}
                ></div>
                <img
                  src={file.url}
                  alt={file.name}
                  className="max-w-[80%] max-h-[90%] object-contain shadow-lg"
                  style={{
                    userSelect: "none",
                    pointerEvents: "none",
                    WebkitUserSelect: "none",
                    MozUserSelect: "none",
                    msUserSelect: "none",
                  }}
                  onDragStart={(e) => e.preventDefault()}
                  onContextMenu={(e) => e.preventDefault()}
                />
              </div>
            ) : (
              <div className="bg-white p-8 shadow-lg w-[80%] h-[90%] overflow-auto">
                <div className="relative">
                  {/* Add a transparent overlay to prevent direct interaction with the content */}
                  <div
                    className="absolute inset-0 z-10"
                    onClick={(e) => e.preventDefault()}
                  ></div>
                  <pre
                    className="whitespace-pre-wrap"
                    style={{
                      userSelect: "none",
                      pointerEvents: "none",
                      WebkitUserSelect: "none",
                      MozUserSelect: "none",
                      msUserSelect: "none",
                    }}
                  >
                    {file.content}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Security warning alert */}
          {showWarning && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-md flex items-center shadow-lg z-50 animate-in fade-in-0 zoom-in-95">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <span>
                Security violation detected! This activity has been logged.
              </span>
            </div>
          )}
        </div>

        {/* Footer with pagination controls */}
        <DialogFooter className="p-4 border-t flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevPage}
              disabled={currentPage <= 1}
              className="h-8"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              disabled={currentPage >= totalPages}
              className="h-8"
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SecureViewer;
