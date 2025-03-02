import React, { useState } from "react";
import { Grid, List, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import FileCard from "./FileCard";
import FileRow from "./FileRow";

type ViewMode = "grid" | "list";

interface File {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  thumbnailUrl?: string;
}

interface FileDisplayProps {
  files?: File[];
  onViewFile?: (fileId: string) => void;
  onShareFile?: (fileId: string) => void;
}

const FileDisplay = ({
  files = [
    {
      id: "file-1",
      name: "Project Presentation.pdf",
      type: "PDF",
      size: 2500000,
      uploadDate: "2023-06-15T10:30:00Z",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: "file-2",
      name: "Company Logo.png",
      type: "PNG",
      size: 1200000,
      uploadDate: "2023-06-10T14:20:00Z",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1563089145-599997674d42?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: "file-3",
      name: "Financial Report Q2.xlsx",
      type: "XLSX",
      size: 3500000,
      uploadDate: "2023-06-05T09:15:00Z",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: "file-4",
      name: "User Manual.docx",
      type: "DOCX",
      size: 1800000,
      uploadDate: "2023-05-28T11:45:00Z",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: "file-5",
      name: "Product Roadmap.pdf",
      type: "PDF",
      size: 4200000,
      uploadDate: "2023-05-20T16:30:00Z",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
    {
      id: "file-6",
      name: "Team Photo.jpg",
      type: "JPG",
      size: 5500000,
      uploadDate: "2023-05-15T13:10:00Z",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
  ],
  onViewFile = (fileId) => console.log(`View file ${fileId}`),
  onShareFile = (fileId) => console.log(`Share file ${fileId}`),
}: FileDisplayProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");

  // Filter files based on search query
  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Sort files based on selected sort option
  const sortedFiles = [...filteredFiles].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "size":
        return b.size - a.size;
      case "type":
        return a.type.localeCompare(b.type);
      case "date":
      default:
        return (
          new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
        );
    }
  });

  return (
    <div className="w-full h-full flex flex-col bg-background">
      {/* Search and controls bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-b">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date (newest)</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="size">Size (largest)</SelectItem>
              <SelectItem value="type">Type (A-Z)</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Show all files</DropdownMenuItem>
              <DropdownMenuItem>Show only documents</DropdownMenuItem>
              <DropdownMenuItem>Show only images</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex border rounded-md overflow-hidden">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="rounded-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="rounded-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Files display area */}
      {sortedFiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 p-8 text-center">
          <div className="rounded-full bg-muted p-6 mb-4">
            <Search className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-2">No files found</h3>
          <p className="text-muted-foreground max-w-md">
            {searchQuery
              ? `No files matching "${searchQuery}" were found. Try a different search term.`
              : "You don't have any files yet. Upload your first file to get started."}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {sortedFiles.map((file) => (
              <FileCard
                key={file.id}
                id={file.id}
                name={file.name}
                type={file.type}
                uploadDate={new Date(file.uploadDate)}
                thumbnailUrl={file.thumbnailUrl}
                onView={onViewFile}
                onShare={onShareFile}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          <div className="divide-y">
            {sortedFiles.map((file) => (
              <FileRow
                key={file.id}
                file={file}
                onView={onViewFile}
                onShare={onShareFile}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileDisplay;
