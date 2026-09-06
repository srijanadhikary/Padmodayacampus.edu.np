# Padmodaya Campus — Vercel + Supabase CMS

This project keeps the existing static Padmodaya Campus design but replaces browser localStorage for notices/site content with Supabase PostgreSQL, Supabase Auth, and Supabase Storage.

## 1. Create Supabase project
Create a Supabase project, then open **SQL Editor** and run `supabase/schema.sql`.

## 2. Create the admin login
In Supabase: **Authentication → Users → Add user**. Create the administrator email/password.

Copy the new user's UUID. Then run:

```sql
insert into public.admin_users (user_id)
values ('PASTE-USER-UUID-HERE');
```

Do not put the password in this project or in GitHub.

## 3. Configure Vercel
In the Vercel project, open **Settings → Environment Variables** and add:

- `SUPABASE_URL` = your Supabase Project URL
- `SUPABASE_PUBLISHABLE_KEY` = your Supabase publishable key

Apply them to Production (and Preview/Development if desired), then redeploy.

## 4. Deploy
Push this folder to GitHub and connect the repository to Vercel, or import it directly into Vercel. No build command is required.

Your admin page will be:

`https://padmodayacampus.edu.np/admin/`

## 5. Features
- Secure Supabase email/password authentication
- Admin authorization using `admin_users` + Row Level Security
- Dynamic notices shared by all visitors
- Add/edit/delete/hide notices
- Urgent/Important/Normal priorities
- Notice image upload
- PDF upload and public open/download link
- Dynamic site/about/mission/vision/contact content
- JSON backup export
- Existing visual design retained

## 6. Security
Only use the Supabase **publishable** key in the browser. Never expose a Supabase service-role key in frontend code, GitHub, or Vercel client-side variables.

The `/api/config.js` Vercel function returns only the URL and publishable key to the browser. The database is protected with Row Level Security and admin policies.

## 7. File limits
The admin UI limits each notice image/PDF upload to 10 MB. Supabase recommends standard uploads for smaller files and resumable uploads for larger files.
