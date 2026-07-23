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
    -- Facebook Page + unga ulangan Instagram Business akkaunt BITTA token bilan
    -- ishlaydi (Meta App tayyor bo'lgach, docs/meta-setup.md'ga qarang)
    facebook_page_id text,
    facebook_page_token text,
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
    channel text not null default 'telegram' check (channel in ('telegram', 'whatsapp', 'instagram', 'facebook')),
    username text,
    telegram_chat_id bigint,
    -- Facebook/Instagram foydalanuvchi ID'si (PSID/IGSID) — matn, Telegram'nikidan farqli
    platform_user_id text,
    created_at timestamptz not null default now(),
    unique (business_id, telegram_chat_id),
    unique (business_id, platform_user_id)
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
-- operator_id ixtiyoriy: backend service-key bilan yozganda (auth'siz demo)
-- author matni ishlatiladi; Auth to'liq ulangach operator_id to'ldiriladi.
create table if not exists internal_notes (
    id uuid primary key default gen_random_uuid(),
    business_id uuid not null references businesses (id) on delete cascade,
    conversation_id uuid not null references conversations (id) on delete cascade,
    operator_id uuid references operators (id),
    author text not null default 'Operator',
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

-- ---------- Boshlang'ich ma'lumotlar ----------

-- Default biznes: loyiha hozircha bitta biznes bilan ishlaydi (single-tenant).
-- Ko'p biznesga o'tilganda har signup o'z biznesini yaratadigan qilinadi.
insert into businesses (name)
select 'Demo biznes'
where not exists (select 1 from businesses);

-- Boshlang'ich javob shablonlari
insert into reply_templates (business_id, title, text)
select b.id, t.title, t.text
from (select id from businesses limit 1) b,
     (values
        ('Salomlashish', 'Assalomu alaykum! Xush kelibsiz, sizga qanday yordam bera olamiz?'),
        ('Ish vaqti', 'Ish vaqtimiz: dushanba–shanba, 9:00 dan 18:00 gacha.'),
        ('Kutish', 'Xabaringizni oldik! Mutaxassisimiz tez orada javob beradi.'),
        ('Rahmat', 'Murojaatingiz uchun rahmat! Yana savollaringiz bo''lsa, bemalol yozing.')
     ) as t(title, text)
where not exists (select 1 from reply_templates);

-- ---------- Auth trigger ----------
-- Yangi Supabase Auth foydalanuvchisi ro'yxatdan o'tganda avtomatik ravishda
-- operators jadvaliga yozib, default biznesga bog'laymiz.
create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
    insert into operators (id, business_id, full_name)
    values (
        new.id,
        (select id from businesses order by created_at limit 1),
        coalesce(new.raw_user_meta_data ->> 'full_name', '')
    );
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function handle_new_user();

-- ---------- Backend uchun qulay view ----------
-- Suhbatlar ro'yxati: mijoz ma'lumoti + suhbatning ENG OXIRGI AI tahlili.
-- security_invoker = on: view so'rovni chaqiruvchining huquqlari bilan bajaradi,
-- ya'ni RLS bu yerda ham amal qiladi.
create or replace view conversation_overview
with (security_invoker = on) as
select
    c.id, c.business_id, c.last_message, c.last_message_at, c.unread_count,
    cu.id  as customer_id, cu.name, cu.channel, cu.username,
    a.sentiment, a.intent, a.suggested_reply,
    c.assigned_operator_id
from conversations c
join customers cu on cu.id = c.customer_id
left join lateral (
    select an.sentiment, an.intent, an.suggested_reply
    from analyses an
    join messages m on m.id = an.message_id
    where m.conversation_id = c.id
    order by m.sent_at desc
    limit 1
) a on true;

-- ---------- Statistika funksiyasi ----------
-- Tahlil sahifasining barcha agregatlari bitta so'rovda (backend RPC chaqiradi).
-- Kalitlar frontend kutadigan camelCase formatda.
create or replace function get_stats() returns jsonb
language sql stable as $$
select jsonb_build_object(
    'todayMessages', (
        select count(*) from messages
        where sender = 'customer' and sent_at::date = now()::date
    ),
    'unanswered', (
        select count(*) from conversations where unread_count > 0
    ),
    'avgResponseMinutes', (
        select round(avg(extract(epoch from (m.sent_at - prev.asked_at)) / 60)::numeric, 1)
        from messages m
        cross join lateral (
            select max(p.sent_at) as asked_at from messages p
            where p.conversation_id = m.conversation_id
              and p.sender = 'customer' and p.sent_at < m.sent_at
        ) prev
        where m.sender = 'business' and prev.asked_at is not null
    ),
    'sentiment', jsonb_build_object(
        'positive', (select count(*) from analyses where sentiment = 'positive'),
        'neutral',  (select count(*) from analyses where sentiment = 'neutral'),
        'negative', (select count(*) from analyses where sentiment = 'negative')
    ),
    'intents', coalesce((
        select jsonb_agg(jsonb_build_object('intent', intent, 'count', n) order by n desc)
        from (select intent, count(*) as n from analyses group by intent) i
    ), '[]'::jsonb),
    'week', coalesce((
        select jsonb_object_agg(day, n)
        from (
            select sent_at::date::text as day, count(*) as n
            from messages
            where sender = 'customer' and sent_at >= now() - interval '6 days'
            group by sent_at::date
        ) w
    ), '{}'::jsonb)
);
$$;
