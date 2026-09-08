import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { updatePreservedProfile } from "@/lib/profileService";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/student/profile";

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data?.session?.user) {
      const user = data.session.user;
      const email = user.email || "krishna.addanki633@gmail.com";
      const fullName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.user_metadata?.user_name ||
        user.user_metadata?.preferred_username ||
        "Krishna Addanki";
      const avatarUrl =
        user.user_metadata?.avatar_url ||
        user.user_metadata?.picture ||
        "https://avatars.githubusercontent.com/u/101566537?v=4";
      const githubUsername =
        user.user_metadata?.user_name ||
        user.user_metadata?.preferred_username ||
        (user.app_metadata?.provider === "github" ? "shannu760" : undefined);
      const authProvider = user.app_metadata?.provider === "github" ? "github" : "google";

      try {
        await updatePreservedProfile({
          email,
          fullName,
          avatarUrl,
          githubUsername,
          authProvider,
        });
      } catch (err) {
        console.error("Failed to sync profile during OAuth exchange:", err);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
