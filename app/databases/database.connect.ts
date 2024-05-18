import mongoose from "npm:mongoose";

export const ConnectDatabases = async () => {
  const DB_URL = Deno.env.get("DB_URL") || "" 
  console.log("🦕 Connecting Databases...");
  
  if (!DB_URL) {
    throw new Error("@ConnectDatabases: The connection values are required");
  }
  
  try {
    await mongoose.connect(DB_URL)
  } catch (error) {
    console.log("Connection Databases Failed... ❌");
    throw new Error("@ConnectDatabases: Failed connect Databases", error);
  }
}