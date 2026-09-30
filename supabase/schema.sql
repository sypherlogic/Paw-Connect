create table if not exists public.providers (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  photo_url text,
  service_type text not null check (service_type in ('dog_sitter','trainer','groomer','vet_clinic')),
  bio text,
  years_experience integer not null default 0 check (years_experience >= 0),
  certifications text[] not null default '{}',
  services_offered jsonb not null default '[]'::jsonb check (jsonb_typeof(services_offered) = 'array'),
  location text not null,
  address text,
  phone text,
  email text,
  website text,
  availability text[] not null default '{}',
  rating numeric(3,1) not null default 0 check (rating >= 0 and rating <= 5),
  review_count integer not null default 0 check (review_count >= 0),
  verified boolean not null default false,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id text primary key default gen_random_uuid()::text,
  provider_id text not null references public.providers(id) on delete cascade,
  reviewer_name text,
  reviewer_email text,
  rating integer not null check (rating between 1 and 5),
  title text,
  comment text not null check (length(trim(comment)) between 1 and 5000),
  service_used text,
  verified_booking boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists reviews_provider_created_idx on public.reviews(provider_id, created_at desc);

create table if not exists public.bookings (
  id text primary key default gen_random_uuid()::text,
  provider_id text not null references public.providers(id),
  provider_name text not null,
  service_name text not null,
  service_price numeric(10,2) not null default 0 check (service_price >= 0),
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  pet_name text,
  pet_type text not null default 'dog' check (pet_type in ('dog','cat','other')),
  pet_breed text,
  date date not null check (date >= current_date),
  time text not null,
  notes text check (notes is null or length(notes) <= 3000),
  status text not null default 'pending' check (status in ('pending','confirmed','completed','cancelled')),
  created_at timestamptz not null default now(),
  constraint bookings_customer_email_valid check (customer_email ~* '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$')
);
create index if not exists bookings_provider_date_idx on public.bookings(provider_id, date);

alter table public.providers enable row level security;
alter table public.reviews enable row level security;
alter table public.bookings enable row level security;

drop policy if exists "providers are publicly readable" on public.providers;
create policy "providers are publicly readable" on public.providers for select to anon, authenticated using (true);
drop policy if exists "reviews are publicly readable" on public.reviews;
create policy "reviews are publicly readable" on public.reviews for select to anon, authenticated using (true);
drop policy if exists "visitors can submit reviews" on public.reviews;
create policy "visitors can submit reviews" on public.reviews for insert to anon, authenticated with check (
  rating between 1 and 5
  and length(trim(comment)) between 1 and 5000
  and (reviewer_email is null or reviewer_email ~* '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$')
  and verified_booking = false
);
drop policy if exists "visitors can submit bookings" on public.bookings;
create policy "visitors can submit bookings" on public.bookings for insert to anon, authenticated with check (
  length(trim(customer_name)) > 0
  and customer_email ~* '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'
  and status = 'pending'
);

create or replace view public.reviews_public
with (security_invoker = true)
as
select id, provider_id, reviewer_name, rating, title, comment, service_used,
       verified_booking, created_at as created_date
from public.reviews;

grant usage on schema public to anon, authenticated;
revoke all on table public.providers, public.reviews, public.bookings, public.reviews_public from anon, authenticated;
grant select on table public.providers to anon, authenticated;
grant select (id, provider_id, reviewer_name, rating, title, comment, service_used, verified_booking, created_at) on public.reviews to anon, authenticated;
grant insert (provider_id, reviewer_name, reviewer_email, rating, title, comment, service_used) on public.reviews to anon, authenticated;
grant select on public.reviews_public to anon, authenticated;
grant insert (provider_id, provider_name, service_name, service_price, customer_name, customer_email, customer_phone, pet_name, pet_type, pet_breed, date, time, notes) on public.bookings to anon, authenticated;
