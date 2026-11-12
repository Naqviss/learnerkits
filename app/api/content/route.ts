import { publicContent } from "@/lib/admin/public-content";
import { supabaseAdmin } from "@/lib/server/supabase";

export async function POST(request: Request) {
  return publicContent(request, supabaseAdmin({
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  }));
}
