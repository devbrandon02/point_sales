import { load } from "https://deno.land/std@0.222.1/dotenv/mod.ts";

export const LoadEnv = async () => {
  const ENV = await load();
  const DB_URL = ENV["DB_URL"];
  const API_VERSION = ENV["API_VERSION"]
  const REDIS_HOSTNAME = ENV["REDIS_HOSTNAME"];
  const REDIS_PORT = ENV["REDIS_PORT"];



  Deno.env.set("DB_URL", DB_URL)
  Deno.env.set("API_VERSION", API_VERSION)
  Deno.env.set("REDIS_PORT", REDIS_PORT)
  Deno.env.set("REDIS_HOSTNAME", REDIS_HOSTNAME)
}
