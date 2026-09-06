-- Padmodaya Campus Supabase schema
-- Run this entire file in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  date date not null,
  priority text not null default 'normal' check (priority in ('normal','important','urgent')),
  active boolean not null default true,
  image_url text,
  file_url text,
  file_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;
alter table public.notices enable row level security;
alter table public.admin_users enable row level security;

create or replace function public.is_padmodaya_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

revoke all on function public.is_padmodaya_admin() from public;
grant execute on function public.is_padmodaya_admin() to anon, authenticated;

-- Public website can read site settings and active notices.
drop policy if exists "Public read site settings" on public.site_settings;
create policy "Public read site settings" on public.site_settings for select to anon, authenticated using (true);

drop policy if exists "Admins manage site settings" on public.site_settings;
create policy "Admins manage site settings" on public.site_settings for all to authenticated using (public.is_padmodaya_admin()) with check (public.is_padmodaya_admin());

drop policy if exists "Public read active notices" on public.notices;
create policy "Public read active notices" on public.notices for select to anon, authenticated using (active = true or public.is_padmodaya_admin());

drop policy if exists "Admins manage notices" on public.notices;
create policy "Admins manage notices" on public.notices for all to authenticated using (public.is_padmodaya_admin()) with check (public.is_padmodaya_admin());

-- Admins may see only their own admin_users row; public does not need this table.
drop policy if exists "Admins read own admin record" on public.admin_users;
create policy "Admins read own admin record" on public.admin_users for select to authenticated using (user_id = auth.uid());

-- Least-privilege Data API grants.
grant select on public.site_settings to anon, authenticated;
grant select on public.notices to anon, authenticated;
grant insert, update, delete on public.site_settings to authenticated;
grant insert, update, delete on public.notices to authenticated;
grant select on public.admin_users to authenticated;

-- Storage bucket: public read, authenticated admin write/delete.
insert into storage.buckets (id, name, public) values ('notices','notices',true)
on conflict (id) do update set public = true;

drop policy if exists "Public read notice files" on storage.objects;
create policy "Public read notice files" on storage.objects for select to public using (bucket_id = 'notices');

drop policy if exists "Admins upload notice files" on storage.objects;
create policy "Admins upload notice files" on storage.objects for insert to authenticated with check (bucket_id = 'notices' and public.is_padmodaya_admin());

drop policy if exists "Admins update notice files" on storage.objects;
create policy "Admins update notice files" on storage.objects for update to authenticated using (bucket_id = 'notices' and public.is_padmodaya_admin()) with check (bucket_id = 'notices' and public.is_padmodaya_admin());

drop policy if exists "Admins delete notice files" on storage.objects;
create policy "Admins delete notice files" on storage.objects for delete to authenticated using (bucket_id = 'notices' and public.is_padmodaya_admin());

-- Seed site content.
insert into public.site_settings (key, value) values ('site', '{
  "heroTagline":"Quality Education at Affordable Cost",
  "heroDescription":"One and only a renowned public campus of Lumbini province providing Bachelor level faculties of Management (BBS) and Science (BSc) affiliated to Tribhuvan University, Nepal.",
  "about":"Padmodaya Campus, established in 2013 AD (2070 BS), is a community campus located in Ghorahi-17, Dang, Lumbini Province, Nepal. It operates as a subsidiary institute of Padmodaya Public Secondary School Ghorahi and is affiliated with Tribhuvan University for bachelor-level academic programs.\n\nThe campus offers undergraduate study in Management and Science through Bachelor of Business Studies (BBS) and Bachelor of Science (BSc) programs. Its academic setting is built around morning-shift classes, science laboratory access, library book support, transportation, and scholarship provisions for selected student groups.",
  "mission":"To provide accessible, affordable, and quality higher education in Management and Science to students of Dang and surrounding regions, empowering them with knowledge, skills, and values for personal and professional growth.",
  "vision":"To become a leading community campus in Lumbini Province recognized for academic excellence, research-oriented learning, and holistic student development.",
  "contact":{"address":"Ghorahi-17, Chaughera, Dang, Lumbini Province, Nepal","phone":"082-590754","mobile1":"9857863574","mobile2":"9847857046","email":"padmodayacampus@gmail.com","facebook":"https://www.facebook.com/profile.php?id=100063941974490"}
}'::jsonb)
on conflict (key) do nothing;

-- Seed notices only if the table is empty.
do $$
begin
  if not exists (select 1 from public.notices) then
    insert into public.notices (title, content, date, priority, active) values
    ('Admission Open for BBS and BSc 2083','Padmodaya Campus announces admission open for Bachelor of Business Studies (BBS) and Bachelor of Science (BSc) for the academic session 2082/083. Interested students are requested to contact the campus administration office for application forms and detailed information.','2026-08-09','urgent',true),
    ('First Year Orientation Program 2082','The first-year orientation program for newly admitted BBS and BSc students will be held on 2082/05/15 at the campus hall. All first-year students are required to attend. The program will include an introduction to faculty members, campus rules, and academic calendar.','2026-08-01','important',true),
    ('BSc Entrance Examination Notice','Tribhuvan University has scheduled the BSc entrance examination for the upcoming academic session. Eligible candidates must fill the entrance form at the campus office within the deadline. Contact the administration for dates and further details.','2026-07-20','important',true),
    ('Scholarship Information for Female BSc Students','Under the Provincial Government of Lumbini scholarship scheme, female students enrolled in BSc program at Padmodaya Campus are eligible for scholarship support. Interested students should submit their applications with required documents to the administration office.','2026-07-15','normal',true),
    ('Library Facility Notice','All students are informed that the campus library and e-library facilities are now fully operational. Students can borrow books and access digital resources during campus hours. Library cards will be issued to all enrolled students.','2026-07-01','normal',true);
  end if;
end $$;
