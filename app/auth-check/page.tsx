import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export default async function AuthCheck({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error: signInError } = await searchParams;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const signedIn = !error && Boolean(data?.claims?.sub);
  return (
    <main className="mx-auto grid max-w-xl gap-5 px-6 py-10">
      <h1>Supabase authentication check</h1>
      <p>This development page checks a Supabase session only. The dashboard is still a demo; roles and shop access are not connected.</p>
      {signedIn ? (
        <form action={signOut}>
          <p>Supabase session verified.</p>
          <button className="underline" type="submit">Sign out</button>
        </form>
      ) : (
        <LoginForm failed={Boolean(signInError)} />
      )}
    </main>
  );
}
