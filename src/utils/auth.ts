import { Capacitor } from "@capacitor/core";
import { supabase } from "../lib/supabase";

const REDIRECT_URL = Capacitor.isNativePlatform()
  ? "com.lwn.jigsaw://auth/callback"
  : window.location.origin;

export async function signInWithGoogle(): Promise<void> {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: REDIRECT_URL,
      skipBrowserRedirect: Capacitor.isNativePlatform(),
    },
  });
  if (error) throw error;
  if (data.url && Capacitor.isNativePlatform()) {
    const { Browser } = await import("@capacitor/browser");
    await Browser.open({ url: data.url });
  }
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}
