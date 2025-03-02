import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Initialize Supabase tables if they don't exist
export async function initializeSupabaseTables() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      "Supabase credentials not found. Please connect to Supabase in the Tempo platform.",
    );
    return;
  }

  try {
    // These SQL commands would normally be run through migrations
    // For demo purposes, we're checking if tables exist and creating them if needed

    // Check if the files table exists
    const { data: filesTable } = await supabase
      .from("files")
      .select("id")
      .limit(1);

    if (filesTable === null) {
      console.log("Creating necessary tables in Supabase...");

      // Create files table
      await supabase.rpc("create_files_table");

      // Create file_shares table
      await supabase.rpc("create_file_shares_table");

      // Create file_views table
      await supabase.rpc("create_file_views_table");

      console.log("Database tables created successfully");
    }
  } catch (error) {
    console.error("Error initializing Supabase tables:", error);
  }
}

// Call this function when the app starts
initializeSupabaseTables();
