# Supabase Realtime - Live Message Updates

Frontend'ni polling'dan (4 soniya) live subscriptions'ga o'tish.

## How It Works

```
Frontend (Next.js)
    ↓ subscribes to Supabase
Supabase Realtime Channel
    ↓ listens to postgres_changes
Backend (writes to DB)
    ↓ triggers
Database Tables (messages, conversations)
    ↓ emits event
Realtime Listeners
    ↓ receive immediately
Frontend UI updates (0ms latency)
```

## Setup Steps

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - **Name**: `ai-inbox` (or any name)
   - **Database Password**: strong password
   - **Region**: Choose nearest (e.g., `ap-southeast-1` for Asia)
4. Wait ~2 minutes for provisioning

### 2. Load Database Schema

1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click "New Query"
3. Paste entire contents of `backend/supabase/schema.sql`
4. Click **Run** (⏵ button)
5. Check for "Success" message

**What gets created:**
- 9 tables (businesses, operators, customers, conversations, messages, analyses, reply_templates, internal_notes, audit_log)
- RLS policies (each tenant sees only their data)
- Realtime publication (messages and conversations tables)
- View: `conversation_overview` (with latest AI analysis)
- Function: `get_stats()` (aggregated analytics)
- Auth trigger: auto-creates operator on signup
- 4 demo reply templates

### 3. Get API Keys

1. Go to **Project Settings** (⚙️ icon, bottom left)
2. Click **API** tab
3. Copy these values:

| Key | Value | Where |
|-----|-------|-------|
| **Project URL** | `https://xxxx.supabase.co` | Copy as-is |
| **Anon Key** | `eyJhbGc...` (starts with eyJ) | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| **Service Role Key** | `eyJhbGc...` (different one) | Backend only: `SUPABASE_SERVICE_KEY` |

⚠️ **IMPORTANT**: 
- Anon key is public (safe - RLS protects data)
- Service role key is SECRET (backend only, never in frontend)

### 4. Update Environment Variables

**Frontend (.env.local):**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

**Backend (.env):**
```bash
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGc...  # service_role key
```

### 5. Restart Servers

```bash
# Backend (Ctrl+C to stop, then restart)
python3 -m uvicorn app.main:app --reload --port 8000

# Frontend (new terminal)
npm run dev
```

**Check logs:**
- Backend: Should show `[store] Baza rejimi: Supabase`
- Frontend: Browser console should show `[realtime] ✓ Supabase Realtime active (no polling)`

## Testing

### Test 1: Real-time Message Updates

1. Open `/inbox` in browser
2. Open **Browser DevTools** → **Console**
3. Send a message via `/api/conversations/{id}/reply` (or from Telegram):
   ```bash
   curl -X POST http://localhost:8000/api/conversations/{conv_id}/reply \
     -H "Content-Type: application/json" \
     -d '{"text":"Test message"}'
   ```
4. Watch console:
   ```
   [realtime] message change: INSERT
   [realtime] conversation change: UPDATE
   ```
5. Message appears instantly (no 4-second delay)

### Test 2: Telegram Webhook

```bash
# Send test message to webhook
curl -X POST http://localhost:8000/telegram/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "chat": {"id": 987654321, "first_name": "Test", "username": "testuser"},
      "text": "Hello from webhook!"
    }
  }'
```

Browser should update instantly.

## Troubleshooting

### "Connection refused" or "socket timeout"
- Check `NEXT_PUBLIC_SUPABASE_URL` is correct
- Verify project is running (Supabase dashboard shows "Running")

### Messages still polling (4s delay)
- Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
- Check console for `[realtime] subscription status` errors
- Keys must be from same project

### RLS Policy Errors
- Ensure schema.sql was run successfully
- Check Supabase dashboard → **Authentication → Users** (should have users created)
- Run schema.sql again if tables missing

### Realtime Not Working in Production
- Must use WSS (WebSocket Secure) over HTTPS
- Check Supabase firewall settings
- Enable Realtime in Project Settings → Integrations

## Architecture Explanation

### Why Realtime is Better

| Aspect | Polling | Realtime |
|--------|---------|----------|
| Latency | 4 seconds | <100ms |
| Network | 1 request/4s | 1 WebSocket |
| CPU | High (repeated calls) | Low (event-driven) |
| Scalability | Bad (O(n) requests) | Good (pub/sub) |
| UX | Stale data | Live updates |

### What Triggers Updates

- New message → `messages` table INSERT
- Message deleted → `messages` table DELETE
- Conversation updated → `conversations` table UPDATE
- AI analysis saved → `analyses` table INSERT

Each triggers the Realtime listener → frontend refresh.

### Fallback to Polling

If Supabase keys missing:
1. Frontend supabase.ts returns `null`
2. InboxView detects `supabase === null`
3. Falls back to setInterval(refresh, 4000)
4. App works (just slower)

## Security

### RLS Protects Data

```sql
-- From schema.sql
create policy "own conversations" on conversations
    for all using (business_id = current_business_id());
```

- Anon key user sees ONLY conversations where `business_id = their_id`
- Service key (backend) bypasses RLS (needed for webhooks)
- Frontend never gets service key

### API Keys Rotation

In Supabase dashboard:
1. **Project Settings** → **API**
2. Click **Rotate** on anon key
3. Update `.env.local`
4. Restart frontend

(Old key invalidated immediately)

## Next Steps

1. ✅ Realtime active - no polling
2. **Auth Pages** - Wire signup/login to Supabase Auth
3. **Telegram Bot** - Production bot token + webhook
4. **Payment Webhooks** - Handle subscription events

## References

- [Supabase Docs](https://supabase.com/docs)
- [Realtime Guide](https://supabase.com/docs/guides/realtime)
- [RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Auth Guide](https://supabase.com/docs/guides/auth)
