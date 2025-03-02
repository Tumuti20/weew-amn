import React, { useState } from "react";
import { X, Send, Copy, Check, Plus, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ShareModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  file?: {
    id: string;
    name: string;
    type: string;
  };
  onShareComplete?: (emails: string[], options: ShareOptions) => void;
}

interface ShareOptions {
  expiryDate: string;
  passwordProtected: boolean;
  preventDownload: boolean;
  trackViews: boolean;
  watermarkEnabled: boolean;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen = false,
  onClose = () => {},
  file = { id: "file-1", name: "Document.pdf", type: "PDF" },
  onShareComplete = () => {},
}) => {
  const [emails, setEmails] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [shareOptions, setShareOptions] = useState<ShareOptions>({
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    passwordProtected: true,
    preventDownload: true,
    trackViews: true,
    watermarkEnabled: true,
  });

  // Generate a secure link (in a real app, this would be a unique URL)
  const secureLink = `https://secureshare.example.com/view/${file.id}?token=${Math.random().toString(36).substring(2, 15)}`;

  const handleAddEmail = () => {
    if (
      currentEmail &&
      !emails.includes(currentEmail) &&
      isValidEmail(currentEmail)
    ) {
      setEmails([...emails, currentEmail]);
      setCurrentEmail("");
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails(emails.filter((email) => email !== emailToRemove));
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(secureLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    onShareComplete(emails, shareOptions);
    onClose();
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-lg bg-background">
        <DialogHeader>
          <DialogTitle className="text-xl">Share "{file.name}"</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="email" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="link">Secure Link</TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-input">Send to email addresses</Label>
              <div className="flex space-x-2">
                <Input
                  id="email-input"
                  placeholder="Enter email address"
                  type="email"
                  value={currentEmail}
                  onChange={(e) => setCurrentEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddEmail()}
                />
                <Button onClick={handleAddEmail} type="button" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {emails.length > 0 && (
              <div className="bg-muted p-3 rounded-md">
                <div className="flex flex-wrap gap-2">
                  {emails.map((email) => (
                    <Badge
                      key={email}
                      variant="secondary"
                      className="flex items-center gap-1 pl-2"
                    >
                      <User className="h-3 w-3" />
                      {email}
                      <button
                        onClick={() => handleRemoveEmail(email)}
                        className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="link" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="secure-link">Secure link</Label>
              <div className="flex space-x-2">
                <Input
                  id="secure-link"
                  value={secureLink}
                  readOnly
                  className="font-mono text-xs"
                />
                <Button
                  onClick={handleCopyLink}
                  type="button"
                  size="icon"
                  variant="outline"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Anyone with this link can access the file with the security
                settings below
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="my-4" />

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Security options</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="expiry-date">Expiry date</Label>
                <p className="text-xs text-muted-foreground">
                  File access will expire after this date
                </p>
              </div>
              <Input
                id="expiry-date"
                type="date"
                value={shareOptions.expiryDate}
                onChange={(e) =>
                  setShareOptions({
                    ...shareOptions,
                    expiryDate: e.target.value,
                  })
                }
                className="w-40"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Password protection</Label>
                <p className="text-xs text-muted-foreground">
                  Recipients will need a password to access
                </p>
              </div>
              <Switch
                checked={shareOptions.passwordProtected}
                onCheckedChange={(checked) =>
                  setShareOptions({
                    ...shareOptions,
                    passwordProtected: checked,
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Prevent download</Label>
                <p className="text-xs text-muted-foreground">
                  Recipients can only view but not download
                </p>
              </div>
              <Switch
                checked={shareOptions.preventDownload}
                onCheckedChange={(checked) =>
                  setShareOptions({ ...shareOptions, preventDownload: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Track views</Label>
                <p className="text-xs text-muted-foreground">
                  Get notified when file is viewed
                </p>
              </div>
              <Switch
                checked={shareOptions.trackViews}
                onCheckedChange={(checked) =>
                  setShareOptions({ ...shareOptions, trackViews: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Add watermark</Label>
                <p className="text-xs text-muted-foreground">
                  Apply watermark with viewer's information
                </p>
              </div>
              <Switch
                checked={shareOptions.watermarkEnabled}
                onCheckedChange={(checked) =>
                  setShareOptions({
                    ...shareOptions,
                    watermarkEnabled: checked,
                  })
                }
              />
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleShare}
            disabled={emails.length === 0 && !copied}
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            Share
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
