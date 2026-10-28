import { createClient } from "@/lib/supabase/server";
import { signIn, signOut } from "./actions";

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
        <form action={signIn} className="grid gap-4">
          <label>Email <input className="block w-full rounded border p-2" type="email" name="email" autoComplete="username" required /></label>
          <label>Password <input className="block w-full rounded border p-2" type="password" name="password" autoComplete="current-password" required /></label>
          <button className="rounded border p-2" type="submit">Sign in</button>
          {signInError && <p role="alert">Unable to sign in. Check your credentials or contact the administrator.</p>}
        </form>
      )}
    </main>
  );
}
