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

-- 4. File(7) page config keys
insert into site_config (key, value) values
  ('address',          '195 Hoàng Sa, P. Tân Định, Quận 1, TP.HCM'),
  ('opening_hours',    '4h chiều – 2h sáng · Thứ 2 – Chủ Nhật'),
  ('zalo_link',        ''),
  ('fb_link',          'https://www.facebook.com/ditoi.nhauchatmoingon/'),
  ('messenger_link',   'https://m.me/ditoi.nhauchatmoingon'),
  ('maps_embed_url',   ''),
  ('parking_image_url',''),
  ('menu_tab_1',  ''), ('menu_tab_2',  ''), ('menu_tab_3',  ''),
  ('menu_tab_4',  ''), ('menu_tab_5',  ''), ('menu_tab_6',  ''),
  ('menu_tab_7',  ''), ('menu_tab_8',  ''), ('menu_tab_9',  ''), ('menu_tab_10', ''),
  ('hero_slide_1',''), ('hero_slide_2',''), ('hero_slide_3',''),
  ('hero_slide_4',''), ('hero_slide_5',''), ('hero_slide_6',''),
  ('review_photo_1',''), ('review_photo_2',''), ('review_photo_3','')
on conflict (key) do nothing;

-- 4. Row-level security
alter table site_config enable row level security;

-- Anyone can read (customer page fetches without auth)
drop policy if exists "Public read" on site_config;
create policy "Public read"
  on site_config for select
  using (true);

-- Only authenticated users (admin) can write
drop policy if exists "Admin write" on site_config;
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
drop policy if exists "Public insert" on bookings;
create policy "Public insert"
  on bookings for insert
  with check (true);

-- Only admin can read bookings
drop policy if exists "Admin read" on bookings;
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
