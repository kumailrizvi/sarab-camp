-- LaborConnect / Sarab Al Madina Portal schema
-- Run this once in Supabase SQL Editor.
create extension if not exists "pgcrypto";

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  trade_license text,
  contact_name text,
  phone text,
  email text,
  status text default 'Active',
  balance numeric default 0
);

create table if not exists public.camps (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  location text,
  emirate text,
  rooms integer default 0,
  capacity integer default 0,
  maintenance_count integer default 0,
  status text default 'Operational'
);

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  camp_id uuid references public.camps(id) on delete set null,
  camp_name text,
  room_no text not null,
  floor text,
  capacity integer default 0,
  occupied integer default 0,
  status text default 'Available'
);

create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  tenant_code text,
  name text not null,
  company_id uuid references public.companies(id) on delete set null,
  company text,
  phone text,
  email text,
  emirates_id text,
  passport_no text,
  check_in_date date,
  lease_end_date date,
  camp_id uuid references public.camps(id) on delete set null,
  camp_name text,
  room_id uuid references public.rooms(id) on delete set null,
  room text,
  status text default 'Active',
  docs_complete boolean default false
);

create table if not exists public.allocations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  tenant_name text,
  company text,
  camp_id uuid references public.camps(id) on delete set null,
  camp_name text,
  room_id uuid references public.rooms(id) on delete set null,
  room text,
  allocation_date date default current_date,
  checkout_date date,
  status text default 'Active'
);

create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  contract_no text,
  company_id uuid references public.companies(id) on delete set null,
  company text,
  camp_id uuid references public.camps(id) on delete set null,
  camp_name text,
  start_date date,
  end_date date,
  monthly_rent numeric default 0,
  security_deposit numeric default 0,
  status text default 'Active',
  document_path text
);

create table if not exists public.charges (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  tenant_id uuid references public.tenants(id) on delete set null,
  tenant_name text,
  company text,
  camp_name text,
  room text,
  charge_type text default 'Rent',
  period text,
  due_date date,
  amount_due numeric default 0,
  amount_paid numeric default 0,
  status text default 'Unpaid',
  receipt_no text,
  balance numeric generated always as (greatest(amount_due - amount_paid, 0)) stored
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  charge_id uuid references public.charges(id) on delete set null,
  tenant_id uuid references public.tenants(id) on delete set null,
  tenant_name text,
  company text,
  payment_date date default current_date,
  method text default 'Cash',
  amount numeric not null default 0,
  receipt_no text,
  notes text
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  expense_no text,
  category text,
  vendor text,
  camp_id uuid references public.camps(id) on delete set null,
  camp_name text,
  expense_date date default current_date,
  amount numeric default 0,
  status text default 'Paid',
  payment_method text,
  invoice_no text,
  invoice_path text,
  notes text
);

create table if not exists public.cheques (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  cheque_no text,
  bank_name text,
  company text,
  tenant_name text,
  amount numeric default 0,
  cheque_date date,
  due_date date,
  status text default 'In Hand',
  notes text
);

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  subject text not null,
  description text,
  priority text default 'Normal',
  status text default 'Open'
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  entity_type text,
  entity_id uuid,
  file_name text,
  file_path text,
  document_type text
);

insert into storage.buckets (id, name, public) values ('invoices', 'invoices', false) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('documents', 'documents', false) on conflict (id) do nothing;

alter table public.companies enable row level security;
alter table public.camps enable row level security;
alter table public.rooms enable row level security;
alter table public.tenants enable row level security;
alter table public.allocations enable row level security;
alter table public.contracts enable row level security;
alter table public.charges enable row level security;
alter table public.payments enable row level security;
alter table public.expenses enable row level security;
alter table public.cheques enable row level security;
alter table public.support_tickets enable row level security;
alter table public.documents enable row level security;

do $$
declare t text;
begin
  foreach t in array array['companies','camps','rooms','tenants','allocations','contracts','charges','payments','expenses','cheques','support_tickets','documents'] loop
    execute format('drop policy if exists "authenticated read %1$s" on public.%1$I', t);
    execute format('drop policy if exists "authenticated write %1$s" on public.%1$I', t);
    execute format('create policy "authenticated read %1$s" on public.%1$I for select to authenticated using (true)', t);
    execute format('create policy "authenticated write %1$s" on public.%1$I for all to authenticated using (true) with check (true)', t);
  end loop;
end $$;
