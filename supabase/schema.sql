-- ═══════════════════════════════════════════════════════════════
-- DÍ TỚI — Supabase Schema
-- Run in: Supabase dashboard → SQL Editor → New query → Run
-- ═══════════════════════════════════════════════════════════════

-- 1. Config table
create table if not exists site_config (
  key        text primary key,
  value      text,
  updated_at timestamptz default now()
);

-- 2. Seed default values
insert into site_config (key, value) values
  ('maps_link',            'https://maps.app.goo.gl/UjS1d73B7dVM6FyH9'),
  ('menu_link',            'https://example.com/menu'),
  ('hotline',              '0979838250'),
  ('slogan',               'ĐÃ ''DÍ'' LÀ PHẢI ''TỚI'''),
  ('promo_fb',             'GIẢM 10%'),
  ('promo_tt',             'TẶNG 1 MÓN'),
  ('promo_checkin',        'GIẢM 5%'),
  ('promo_review',         'TẶNG NƯỚC'),
  ('background_image_url', ''),
  ('logo_url',             ''),
  ('brand_font_url',       '')
on conflict (key) do nothing;

-- 3. New config keys for booking + menu gallery
insert into site_config (key, value) values
  ('branch_name',      '1A Tam Đảo, P. Hoà Hưng, Q.10, HCM'),
  ('menu_cover_url',   ''),
  ('menu_drinks_url',  '')
on conflict (key) do nothing;

-- 4. Row-level security
alter table site_config enable row level security;

-- Anyone can read (customer page fetches without auth)
create policy "Public read"
  on site_config for select
  using (true);

-- Only authenticated users (admin) can write
create policy "Admin write"
  on site_config for all
  using (auth.role() = 'authenticated');

-- ═══════════════════════════════════════════════════════════════
-- 5. Bookings table
-- ═══════════════════════════════════════════════════════════════
create table if not exists bookings (
  id            uuid default gen_random_uuid() primary key,
  customer_name text not null,
  phone         text not null,
  branch        text,
  guests        integer default 1,
  booking_date  date,
  booking_time  text,
  promotion     text,
  created_at    timestamptz default now()
);

alter table bookings enable row level security;

-- Public can insert (no auth needed to make a booking)
create policy "Public insert"
  on bookings for insert
  with check (true);

-- Only admin can read bookings
create policy "Admin read"
  on bookings for select
  using (auth.role() = 'authenticated');

-- ═══════════════════════════════════════════════════════════════
-- AFTER running this SQL, also do manually in the dashboard:
--
-- Storage → New bucket → Name: media → Public: ON
--
-- Authentication → Add user:
--   Email:    admin@ditoi.vn   (or your preferred email)
--   Password: (strong password)
-- ═══════════════════════════════════════════════════════════════
