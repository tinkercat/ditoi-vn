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

-- 3. Row-level security
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
-- AFTER running this SQL, also do manually in the dashboard:
--
-- Storage → New bucket → Name: media → Public: ON
--
-- Authentication → Add user:
--   Email:    admin@ditoi.vn   (or your preferred email)
--   Password: (strong password)
-- ═══════════════════════════════════════════════════════════════
