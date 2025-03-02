import React from "react";
import { Eye, Calendar, FileIcon, Share2 } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FileCardProps {
  id?: string;
  name?: string;
  type?: string;
  uploadDate?: Date;
  thumbnailUrl?: string;
  onView?: (id: string) => void;
  onShare?: (id: string) => void;
}

const FileCard = ({
  id = "file-1",
  name = "Document.pdf",
  type = "PDF",
  uploadDate = new Date(),
  thumbnailUrl = "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  onView = () => {},
  onShare = () => {},
}: FileCardProps) => {
  const formattedDate = uploadDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const handleViewClick = () => {
    onView(id);
  };

  return (
    <Card className="w-[280px] h-[320px] overflow-hidden flex flex-col bg-background hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-[180px] overflow-hidden bg-muted">
        {type.toLowerCase().includes("pdf") ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <FileIcon className="w-16 h-16 text-gray-400" />
          </div>
        ) : (
          <img
            src={thumbnailUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <CardContent className="flex-1 p-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <h3 className="font-medium text-lg truncate">{name}</h3>
            </TooltipTrigger>
            <TooltipContent>
              <p>{name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="flex items-center mt-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 mr-1" />
          <span>{formattedDate}</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          onClick={handleViewClick}
          className="flex-1 flex items-center justify-center gap-2"
          variant="outline"
        >
          <Eye className="w-4 h-4" />
          View
        </Button>
        <Button
          onClick={() => onShare(id)}
          className="flex items-center justify-center"
          variant="ghost"
          size="icon"
        >
          <Share2 className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FileCard;
