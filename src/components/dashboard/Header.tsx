import React, { useState } from "react";
import { Upload, Moon, Sun, LogOut, User, ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface HeaderProps {
  onUpload?: () => void;
  onLogout?: () => void;
  onToggleTheme?: () => void;
  isDarkMode?: boolean;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
}

const Header = ({
  onUpload = () => {},
  onLogout = () => {},
  onToggleTheme = () => {},
  isDarkMode = false,
  userName = "John Doe",
  userEmail = "john.doe@example.com",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
}: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Add scroll event listener to add shadow when scrolled
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-10 w-full py-3 px-4 md:px-6 bg-background flex items-center justify-between transition-shadow duration-200 ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <div className="flex items-center">
        <div className="text-xl font-bold mr-2">SecureShare</div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onUpload}
                variant="outline"
                className="hidden md:flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload Files
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Upload new files securely</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onUpload}
                variant="outline"
                size="icon"
                className="md:hidden"
              >
                <Upload className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Upload new files</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="flex items-center space-x-2">
          <Moon
            className={`h-4 w-4 ${isDarkMode ? "text-primary" : "text-muted-foreground"}`}
          />
          <Switch checked={isDarkMode} onCheckedChange={onToggleTheme} />
          <Sun
            className={`h-4 w-4 ${!isDarkMode ? "text-primary" : "text-muted-foreground"}`}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 h-9 px-2"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                  <img
                    src={userAvatar}
                    alt="User avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium leading-none">{userName}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                    {userEmail}
                  </p>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center gap-2 p-2 md:hidden">
              <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden">
                <img
                  src={userAvatar}
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {userEmail}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator className="md:hidden" />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onLogout}
              className="cursor-pointer text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
