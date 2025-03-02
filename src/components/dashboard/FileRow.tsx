import React from "react";
import { Eye, MoreVertical, FileIcon, Share2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface FileRowProps {
  file?: {
    id: string;
    name: string;
    type: string;
    size: number;
    uploadDate: string;
    thumbnail?: string;
  };
  onView?: (fileId: string) => void;
  onShare?: (fileId: string) => void;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const FileRow: React.FC<FileRowProps> = ({
  file = {
    id: "file-1",
    name: "Project Presentation.pdf",
    type: "PDF",
    size: 2500000,
    uploadDate: "2023-06-15T10:30:00Z",
  },
  onView = () => console.log("View file clicked"),
  onShare = () => console.log("Share file clicked"),
}) => {
  const formattedDate = new Date(file.uploadDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex items-center justify-between p-3 border-b border-gray-200 hover:bg-gray-50 transition-colors bg-white">
      <div className="flex items-center space-x-3 flex-1">
        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-blue-100 rounded">
          <FileIcon className="h-5 w-5 text-blue-600" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900 truncate">
            {file.name}
          </p>
          <p className="text-xs text-gray-500">{file.type}</p>
        </div>
      </div>

      <div className="hidden md:flex items-center justify-center w-24">
        <span className="text-sm text-gray-500">
          {formatFileSize(file.size)}
        </span>
      </div>

      <div className="hidden md:flex items-center justify-center w-32">
        <span className="text-sm text-gray-500">{formattedDate}</span>
      </div>

      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onView(file.id)}
                className="h-8 w-8"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View file securely</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onShare(file.id)}
                className="h-8 w-8"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share file</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(file.id)}>
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onShare(file.id)}>
              Share
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("File details")}>
              Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log("Copy link")}
              className="text-amber-600"
            >
              Copy secure link
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default FileRow;
