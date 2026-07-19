-- =====================================================================
-- AI Inbox Assistant — Supabase (Postgres) sxemasi + RLS siyosatlari
-- =====================================================================
-- Ishlatish: Supabase loyihasi ochilgach, SQL Editor'ga shu faylni
-- to'liq nusxalab ishga tushiring. Keyin backend/.env ga SUPABASE_URL va
-- SUPABASE_SERVICE_KEY qo'shiladi, app/database.py Supabase klientiga
-- almashtiriladi (jadval/ustun nomlari SQLite bilan bir xil qilingan).
--
-- Ko'p-ijarali (multi-tenant) model: har bir yozuv business_id ga bog'lanadi,
-- RLS har bir biznes faqat O'Z ma'lumotini ko'rishini kafolatlaydi.

-- ---------- Jadvallar ----------

-- Bizneslar (tenant). Har bir Supabase Auth foydalanuvchisi bitta biznesga a'zo.
create table if not exists businesses (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    telegram_bot_token text,          -- shifrlangan saqlash uchun Vault ham ko'rib chiqilsin
    working_hours jsonb,              -- ish vaqti (avto-javob uchun), masalan {"mon": ["09:00","18:00"]}
    created_at timestamptz not null default now()
);

-- Operatorlar: auth.users bilan bog'lanadi (Supabase Auth)
create table if not exists operators (
    id uuid primary key references auth.users (id) on delete cascade,
    business_id uuid not null references businesses (id) on delete cascade,
    full_name text not null default '',
    role text not null default 'operator' check (role in ('owner', 'operator')),
    status text not null default 'available' check (status in ('available', 'busy', 'offline')),
    created_at timestamptz not null default now()
);

create table if not exists customers (
    id uuid primary key default gen_random_uuid(),
    business_id uuid not null references businesses (id) on delete cascade,
    name text not null,
    channel text not null default 'telegram' check (channel in ('telegram', 'whatsapp', 'instagram')),
    username text,
    telegram_chat_id bigint,
    created_at timestamptz not null default now(),
    unique (business_id, telegram_chat_id)
);

create table if not exists conversations (
    id uuid primary key default gen_random_uuid(),
    business_id uuid not null references businesses (id) on delete cascade,
    customer_id uuid not null references customers (id) on delete cascade,
    assigned_operator_id uuid references operators (id),   -- taqsimlash (5-bo'lim)
    last_message text not null default '',
    last_message_at timestamptz not null default now(),
    unread_count integer not null default 0
);

create table if not exists messages (
    id uuid primary key default gen_random_uuid(),
    business_id uuid not null references businesses (id) on delete cascade,
    conversation_id uuid not null references conversations (id) on delete cascade,
    sender text not null check (sender in ('customer', 'business')),
    text text not null,
    sent_at timestamptz not null default now(),
    kind text not null default 'text' check (kind in ('text', 'photo', 'voice', 'video', 'sticker')),
    media_file_id text,
    media_url text,
    transcript text
);

-- AI tahlil keshi: har bir xabar bir marta tahlil qilinadi (token tejash)
create table if not exists analyses (
    message_id uuid primary key references messages (id) on delete cascade,
    business_id uuid not null references businesses (id) on delete cascade,
    conversation_id uuid not null references conversations (id) on delete cascade,
    sentiment text not null check (sentiment in ('positive', 'neutral', 'negative')),
    intent text not null check (intent in ('question', 'complaint', 'order', 'feedback', 'other')),
    suggested_reply text not null default '',
    source text not null default 'heuristic',
    created_at timestamptz not null default now()
);

-- Ichki eslatmalar (operatorlar orasida, mijoz ko'rmaydi) — 5-bo'lim
create table if not exists internal_notes (
    id uuid primary key default gen_random_uuid(),
    business_id uuid not null references businesses (id) on delete cascade,
    conversation_id uuid not null references conversations (id) on delete cascade,
    operator_id uuid not null references operators (id),
    text text not null,
    created_at timestamptz not null default now()
);

-- Tezkor javob shablonlari — 5-bo'lim
create table if not exists reply_templates (
    id uuid primary key default gen_random_uuid(),
    business_id uuid not null references businesses (id) on delete cascade,
    title text not null,
    text text not null,
    created_at timestamptz not null default now()
);

-- Audit log — 8-bo'lim (kim, qachon, nima qildi)
create table if not exists audit_log (
    id bigint generated always as identity primary key,
    business_id uuid not null references businesses (id) on delete cascade,
    operator_id uuid references operators (id),
    action text not null,             -- masalan 'reply_sent', 'login', 'template_created'
    details jsonb,
    created_at timestamptz not null default now()
);

-- Tez-tez ishlatiladigan indekslar
create index if not exists idx_conversations_business on conversations (business_id, last_message_at desc);
create index if not exists idx_messages_conversation on messages (conversation_id, sent_at);
create index if not exists idx_customers_business on customers (business_id);

-- ---------- RLS (Row Level Security) ----------
-- Yoqilgach, siyosatga mos kelmagan har qanday so'rov bo'sh natija qaytaradi.
-- Backend service_role kaliti bilan ishlaganda RLS chetlab o'tiladi (webhook uchun);
-- frontend anon/user kaliti bilan faqat o'z biznesini ko'radi.

alter table businesses enable row level security;
alter table operators enable row level security;
alter table customers enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;
alter table analyses enable row level security;
alter table internal_notes enable row level security;
alter table reply_templates enable row level security;
alter table audit_log enable row level security;

-- Yordamchi: joriy foydalanuvchining business_id sini topish
create or replace function current_business_id() returns uuid
language sql stable security definer as $$
    select business_id from operators where id = auth.uid()
$$;

-- Har bir jadval uchun bir xil qolip: faqat o'z biznesining qatorlari
create policy "own business" on businesses
    for select using (id = current_business_id());

create policy "own operators" on operators
    for select using (business_id = current_business_id());
create policy "update self" on operators
    for update using (id = auth.uid());

create policy "own customers" on customers
    for all using (business_id = current_business_id());

create policy "own conversations" on conversations
    for all using (business_id = current_business_id());

create policy "own messages" on messages
    for all using (business_id = current_business_id());

create policy "own analyses" on analyses
    for all using (business_id = current_business_id());

create policy "own notes" on internal_notes
    for all using (business_id = current_business_id());

create policy "own templates" on reply_templates
    for all using (business_id = current_business_id());

-- Audit log: o'qish mumkin, o'zgartirish/o'chirish yo'q (faqat backend yozadi)
create policy "read own audit" on audit_log
    for select using (business_id = current_business_id());

-- ---------- Realtime ----------
-- Supabase Realtime: frontend shu jadvallardagi o'zgarishlarga obuna bo'ladi
-- (polling o'rniga). RLS Realtime'da ham amal qiladi.
alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table conversations;
