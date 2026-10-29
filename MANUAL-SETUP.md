# Manual setup for the dev preview

This guide connects the **dev preview** to the Supabase project `pocket-sale-ai` (`qeqfptszpsipnxcjgsxb`). It is a development setup, not a production launch. The root page opens the real account flow; `/demo` contains temporary sample data. Some features such as real photo upload and persistent imports are not complete.

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

The public Supabase URL and publishable key were already added to Vercel for the `dev` branch preview. This separate secret allows the admin's server-side owner-creation form to create Auth users. Keep it private: it bypasses database row-level security. These steps work on a phone; if a menu is hidden, try your browser's **Desktop site** option.

### A. Copy the secret from Supabase

1. Open the [Supabase dashboard](https://supabase.com/dashboard) and sign in. Select **pocket-sale-ai** (reference `qeqfptszpsipnxcjgsxb`).
2. Open **Project Settings** (gear icon) → **API Keys**. Select **Publishable and secret API keys** if tabs are shown.
3. Under **Secret keys**, find an existing secret key or use the dashboard's create option. A modern secret starts with `sb_secret_`. Copy it using the copy button. You may need to reveal it or complete a dashboard security check first. Do **not** copy the `sb_publishable_` key.
4. Keep the value in your clipboard only long enough to paste it into Vercel. Never paste it into chat, GitHub, a public document, or a screenshot.

### B. Save it in Vercel

1. Open [Vercel](https://vercel.com/dashboard) in another tab and sign in to the account that owns **pocket-sale-ai**.
2. Open the **pocket-sale-ai** project → **Settings** → **Environment Variables** → **Add New** (or **Add Environment Variable**).
3. In the **Key / Name** box, type exactly `SUPABASE_SECRET_KEY`. This is the variable name, not the secret itself.
4. In the **Value** box, paste the `sb_secret_...` value you copied from Supabase. Do not add quotes, spaces, or `NEXT_PUBLIC_` to the name.
5. Choose the **Secret** type (or enable **Sensitive**, if your dashboard uses that label). Select **Preview** only; deselect **Production** and **Development** if they are selected.
6. In the Preview branch selector, choose or enter **dev**. If you cannot find a branch selector, stop and ask for help rather than applying the secret to every preview branch.
7. Tap **Save**. You should see the name `SUPABASE_SECRET_KEY` in the list, scoped to Preview / `dev`; the value may be hidden after saving. Do not create a duplicate if it is already present—check its environment and branch instead.

### C. Redeploy the dev preview

1. In the same Vercel project, open **Deployments**.
2. Find the newest deployment whose Git branch is **dev**. Open its menu (often **⋯**) and choose **Redeploy**. If asked, make sure it is the **preview**, not production, deployment.
3. Wait until its status says **Ready**, then open that deployment. Adding an environment variable does not update an existing deployment until it is rebuilt or redeployed.
4. Tell the assistant the secret was saved and the deployment is Ready; don't send the value. The assistant can check the variable's name and scope without reading the secret, but a real owner-creation test is needed to verify its value works.

The dev Vercel preview points to the selected Supabase project, not an isolated database branch. Use test data only. The preview may require signing in to Vercel.

## 5. Test the real pages

1. Open the latest **dev** deployment in Vercel. The root page opens the real account flow; you can also go directly to `/auth-check`.
2. Sign in with the **app admin email and password created in step 3**. A working admin account should reach `/admin`.
3. In the admin page, create a test owner and shop. The form asks for an initial password; share it securely with the test owner. It does not email an invitation. If the form says creation needs review, **do not retry**; inspect Auth Users and shop records first because the identity may have been created even if the response failed.
4. Sign out, sign in as the test owner, and check `/live`: add a product with a variant, refresh the page, and check that it remains. Test support and the password change page too.

The dashboard at `/demo` is a demo and resets its local changes. Successful tests on `/live` do not mean photo uploads, persistent imports, WhatsApp, AI, password reset, MFA or distributed rate limiting are complete. Hosted tenant-isolation, browser/mobile and Urdu RTL tests remain required.

## Common issues

- **Vercel asks you to sign in:** the preview has Vercel Authentication protection. Sign in to the account that owns the project.
- **Account unavailable / not provisioned:** check the correct user UUID and the result of step 3. For an owner, check that their shop record exists and is active.
- **Admin owner creation unavailable:** confirm `SUPABASE_SECRET_KEY` is a server-only **dev Preview** variable and redeploy. Do not send the value to anyone.
- **Migration command fails:** capture the command name and sanitized error; do not post credentials or run destructive reset commands.
- **Need help:** share which numbered step failed and a screenshot with emails, UUIDs, passwords, API keys and connection strings hidden.
