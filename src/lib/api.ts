import { supabase } from "./supabase";

// File operations
export async function uploadFile(file: File, userId: string) {
  try {
    // Create a unique file path
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from("secure-files")
      .upload(filePath, file);

    if (error) throw error;

    // Get public URL (or secure URL in production)
    const { data: urlData } = supabase.storage
      .from("secure-files")
      .getPublicUrl(filePath);

    // Save file metadata to database
    const { data: fileData, error: dbError } = await supabase
      .from("files")
      .insert([
        {
          name: file.name,
          type: file.type,
          size: file.size,
          path: filePath,
          url: urlData.publicUrl,
          user_id: userId,
        },
      ])
      .select();

    if (dbError) throw dbError;

    return fileData[0];
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

// Get all files for a user
export async function getUserFiles(userId: string) {
  try {
    const { data, error } = await supabase
      .from("files")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching files:", error);
    throw error;
  }
}

// Share file with other users
export async function shareFile(
  fileId: string,
  recipientEmails: string[],
  options: any,
) {
  try {
    // For each recipient, create a share record
    const shares = recipientEmails.map((email) => ({
      file_id: fileId,
      recipient_email: email,
      expiry_date: options.expiryDate,
      password_protected: options.passwordProtected,
      prevent_download: options.preventDownload,
      track_views: options.trackViews,
      watermark_enabled: options.watermarkEnabled,
      access_token:
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15),
    }));

    const { data, error } = await supabase
      .from("file_shares")
      .insert(shares)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error sharing file:", error);
    throw error;
  }
}

// Get file access details for a shared file
export async function getSharedFileAccess(token: string) {
  try {
    const { data, error } = await supabase
      .from("file_shares")
      .select("*, files(*)")
      .eq("access_token", token)
      .single();

    if (error) throw error;

    // Check if share has expired
    if (data.expiry_date && new Date(data.expiry_date) < new Date()) {
      throw new Error("This shared file has expired");
    }

    return data;
  } catch (error) {
    console.error("Error getting shared file:", error);
    throw error;
  }
}

// Log a file view
export async function logFileView(shareId: string, viewerInfo: any) {
  try {
    const { data, error } = await supabase
      .from("file_views")
      .insert([
        {
          share_id: shareId,
          viewer_ip: viewerInfo.ip,
          viewer_device: viewerInfo.device,
          viewer_browser: viewerInfo.browser,
        },
      ])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error logging file view:", error);
    throw error;
  }
}
