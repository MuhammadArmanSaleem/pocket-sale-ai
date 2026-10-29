# Manual setup for the dev preview

This guide connects the **dev preview** to the Supabase project `pocket-sale-ai` (`qeqfptszpsipnxcjgsxb`). It is a development setup, not a production launch. The root page is still a demo with temporary data; the real admin and owner pages are separate. Some features such as real photo upload and persistent imports are not complete.

**Never send your Supabase password, database password, API secret, or app password in chat, GitHub, or a screenshot.** The `sb_publishable_...` key is public; an `sb_secret_...` key or legacy `service_role` key is private and gives broad access.

## 1. Disable public signup

1. Sign in to the [Supabase dashboard](https://supabase.com/dashboard) and open **pocket-sale-ai**. Check the project reference is `qeqfptszpsipnxcjgsxb` in project settings.
2. Open **Authentication → Sign In / Providers → Email** (the dashboard labels can change). Turn off **Allow new users to sign up** and save. If there is also a general signup switch, turn that off too. Keep email/password sign-in enabled.
3. Check the setting stays off after refreshing. Do not change email confirmation or other provider settings unless needed.

This blocks public registration; admins can still create users using trusted administrative tools.

## 2. Apply database migrations from your computer

Use the CLI so migration history matches the files in Git. You need Git, Node.js and npm. Docker is **not** required for these remote commands. If you're on a phone, ask a helper with a computer to do this, or tell the assistant once signup is disabled so it can check what it can safely do through the connected tools.

Open a terminal and run:

```sh
git clone https://github.com/MuhammadArmanSaleem/pocket-sale-ai.git
cd pocket-sale-ai
git switch dev
npx supabase --version
npx supabase login
npx supabase link --project-ref qeqfptszpsipnxcjgsxb
npx supabase migration list
npx supabase db push --dry-run
```

Follow the CLI's login prompts. If asked for the database password, enter the password you set for this **Supabase database**; it is not necessarily your dashboard password. Do not put it in the command, chat, or a screenshot. If you do not know it, stop and use Supabase's documented password recovery process.

Check that the dry run lists the 12 files under `supabase/migrations/`, in filename order. The twelve migrations were applied through the Supabase connector on 2026-10-29; the migration list should show matching local and remote versions. If it differs, stop and ask for a review. Do not use `db reset` and do not paste the migration files manually into the SQL editor: that would bypass CLI migration history.

If the dry run shows no pending migrations, the hosted schema is already up to date. Otherwise stop and ask for a review before applying anything. To verify:

```sh
npx supabase migration list
```

All 12 local versions should now have matching remote versions. If a command fails or the CLI suggests repairing history, stop and share the **error text after removing passwords, tokens, connection strings and keys**. Do not rerun or repair blindly.

## 3. Create your first admin identity

1. In Supabase, open **Authentication → Users → Add user** and create a user using an email address you control and a strong password. Use the dashboard's option to confirm the email if available. This is an app login, separate from your Supabase dashboard login. Keep its password private.
2. Copy that new user's **User UID** from the Users page. It is a UUID, not the email or password.
3. Open **SQL Editor → New query**. Replace `PASTE_ADMIN_USER_UID_HERE` in the following SQL with that UUID, keeping the single quotes. Read the UUID again carefully before running it: this grants that user admin access.

```sql
begin;
insert into public.profiles (user_id, display_name)
select id, 'Administrator' from auth.users
where id = 'PASTE_ADMIN_USER_UID_HERE'::uuid
on conflict (user_id) do nothing;

insert into private.admin_users (user_id)
select id from auth.users
where id = 'PASTE_ADMIN_USER_UID_HERE'::uuid
on conflict (user_id) do nothing;
commit;

select count(*) as matching_admins
from private.admin_users
where user_id = 'PASTE_ADMIN_USER_UID_HERE'::uuid;
```

The final result must be `1`. A result of `0` means the UUID did not identify a user; do not continue until corrected. Do not paste a password or API key into SQL. Admin membership is in the private database table, not editable user metadata.

## 4. Add the server secret to the Vercel dev preview

The public Supabase URL and publishable key were already added to Vercel for the `dev` branch preview. The remaining secret is needed only for the admin's owner-creation form.

1. In Supabase, open **Project Settings → API Keys → Publishable and secret API keys**. Find or create a secret key. Treat it like a password; it bypasses row-level security. Never select the publishable key for this step.
2. In Vercel, open **pocket-sale-ai → Settings → Environment Variables → Add New**.
3. Set the key name to `SUPABASE_SECRET_KEY`, paste the Supabase secret as its value, and mark it **Sensitive/Secret**. Target **Preview** and restrict it to Git branch **dev**. Do not add it to Production, and do not prefix the name with `NEXT_PUBLIC_`.
4. Save. Open **Deployments**, select the latest deployment for **dev**, and choose **Redeploy** so it picks up the new value. Wait for **Ready**.

The dev Vercel preview points to the selected Supabase project, not an isolated database branch. Use test data only. The preview may require signing in to Vercel.

## 5. Test the real pages

1. Open the latest **dev** deployment in Vercel. Go to `/auth-check`, or use the real-account link on the demo page.
2. Sign in with the **app admin email and password created in step 3**. A working admin account should reach `/admin`.
3. In the admin page, create a test owner and shop. The form asks for an initial password; share it securely with the test owner. It does not email an invitation. If the form says creation needs review, **do not retry**; inspect Auth Users and shop records first because the identity may have been created even if the response failed.
4. Sign out, sign in as the test owner, and check `/live`: add a product with a variant, refresh the page, and check that it remains. Test support and the password change page too.

The dashboard at `/` is a demo and resets its local changes. Successful tests on `/live` do not mean photo uploads, persistent imports, WhatsApp, AI, password reset, MFA or distributed rate limiting are complete. Hosted tenant-isolation, browser/mobile and Urdu RTL tests remain required.

## Common issues

- **Vercel asks you to sign in:** the preview has Vercel Authentication protection. Sign in to the account that owns the project.
- **Account unavailable / not provisioned:** check the correct user UUID and the result of step 3. For an owner, check that their shop record exists and is active.
- **Admin owner creation unavailable:** confirm `SUPABASE_SECRET_KEY` is a server-only **dev Preview** variable and redeploy. Do not send the value to anyone.
- **Migration command fails:** capture the command name and sanitized error; do not post credentials or run destructive reset commands.
- **Need help:** share which numbered step failed and a screenshot with emails, UUIDs, passwords, API keys and connection strings hidden.
