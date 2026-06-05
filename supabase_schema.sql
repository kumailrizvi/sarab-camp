-- CampMaster / LaborConnect Supabase schema
-- Run this in Supabase SQL Editor before using the app.

create extension if not exists "pgcrypto";

create table if not exists public.camps (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  cluster text,
  location text,
  rooms integer default 0,
  capacity integer default 0,
  occupancy_rate numeric default 0,
  status text default 'Operational',
  maintenance_count integer default 0
);

create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  tenant_code text,
  name text not null,
  company text,
  room text,
  camp_name text,
  emirates_id text,
  check_in_date date,
  lease_end_date date,
  status text default 'Active',
  docs_complete boolean default false
);

create table if not exists public.charges (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  tenant_name text not null,
  company text,
  room text,
  camp_name text,
  charge_type text not null default 'Rent',
  period text,
  amount_due numeric not null default 0,
  amount_paid numeric not null default 0,
  balance numeric generated always as (greatest(amount_due - amount_paid, 0)) stored,
  status text default 'Unpaid',
  receipt_no text
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  charge_id uuid references public.charges(id) on delete set null,
  tenant_name text not null,
  amount numeric not null default 0,
  payment_date date not null default current_date,
  method text default 'Cash',
  receipt_no text,
  notes text
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  category text not null,
  vendor text not null,
  amount numeric not null default 0,
  expense_date date not null default current_date,
  status text default 'Paid',
  invoice_no text,
  invoice_path text
);

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  subject text not null,
  description text,
  priority text default 'Normal',
  status text default 'Open'
);

alter table public.camps enable row level security;
alter table public.tenants enable row level security;
alter table public.charges enable row level security;
alter table public.payments enable row level security;
alter table public.expenses enable row level security;
alter table public.support_tickets enable row level security;

-- Authenticated users can manage company ERP data. Tighten this later with role-based policies.
do $$ begin
  create policy "authenticated manage camps" on public.camps for all to authenticated using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "authenticated manage tenants" on public.tenants for all to authenticated using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "authenticated manage charges" on public.charges for all to authenticated using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "authenticated manage payments" on public.payments for all to authenticated using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "authenticated manage expenses" on public.expenses for all to authenticated using (true) with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "authenticated manage support" on public.support_tickets for all to authenticated using (true) with check (true);
exception when duplicate_object then null; end $$;

insert into storage.buckets (id, name, public)
values ('invoices', 'invoices', false)
on conflict (id) do nothing;

-- Allow signed-in users to upload/read invoices.
do $$ begin
  create policy "authenticated upload invoices" on storage.objects for insert to authenticated with check (bucket_id = 'invoices');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "authenticated read invoices" on storage.objects for select to authenticated using (bucket_id = 'invoices');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "authenticated update invoices" on storage.objects for update to authenticated using (bucket_id = 'invoices') with check (bucket_id = 'invoices');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "authenticated delete invoices" on storage.objects for delete to authenticated using (bucket_id = 'invoices');
exception when duplicate_object then null; end $$;
