# Telegram Bot Integration

Complete guide to integrate Telegram bot for receiving customer messages.

## Architecture

```
Customer sends message on Telegram
    ↓
Telegram servers detect message
    ↓
POST to webhook: https://your-domain.com/telegram/webhook
    ↓
Backend (FastAPI) receives update
    ↓
parse_update() extracts: chat_id, name, text, media, etc.
    ↓
find_or_create_customer() → creates or finds customer record
    ↓
add_message() → saves message to database
    ↓
analyze_message() → Claude/heuristic AI analysis
    ↓
save_analysis() → cache in analyses table
    ↓
Supabase Realtime emits event
    ↓
Frontend subscribes → message appears instantly in /inbox ✅
```

## Setup Steps

### 1. Create Bot with @BotFather

1. **Open Telegram:**
   - Search: `@BotFather` (verify ✓ badge)
   - Click "Start"

2. **Create bot:**
   - Send: `/newbot`
   - BotFather asks: "Alright! New bot. How are we going to call it?"
   - Reply: "AI Inbox Assistant Test" (or your bot name)
   - BotFather asks: "Good. Now choose a username for your bot..."
   - Reply: `ai_inbox_yourusername_bot` (must be unique, ends with `_bot`)

3. **Copy Token:**
   ```
   Done! Congratulations on your new bot. You will find it at t.me/ai_inbox_yourusername_bot.
   You can now add a description, about section and profile picture for your bot, see /help for a list of commands.
   
   Use this token to access the HTTP API:
   5678901234:ABCDEFGHijklmnOPQRSTUV
   ```
   Copy this token → `.env` file

### 2. Environment Setup

**backend/.env:**
```bash
TELEGRAM_BOT_TOKEN=5678901234:ABCDEFGHijklmnOPQRSTUV
API_URL=http://localhost:8000  # local: ngrok URL
```

### 3. Expose Backend to Internet (Local Testing)

**Option A: ngrok (easiest for local)**

```bash
# Install
brew install ngrok  # macOS
# OR download from ngrok.com

# Run
ngrok http 8000

# Output:
# Forwarding https://abc123def456.ngrok.io -> http://localhost:8000
```

Copy the HTTPS URL (not HTTP).

**Option B: cloudflare tunnel**

```bash
brew install cloudflare-wrangler
wrangler tunnel --url localhost:8000
```

**Option C: Production (real domain)**

Use your actual domain with HTTPS:
```
https://yourdomain.com/telegram/webhook
```

### 4. Register Webhook with Telegram

```bash
# Get token from .env
TOKEN=5678901234:ABCDEFGHijklmnOPQRSTUV
WEBHOOK_URL=https://abc123def456.ngrok.io

# Register webhook
curl "https://api.telegram.org/bot${TOKEN}/setWebhook?url=${WEBHOOK_URL}/telegram/webhook"

# Response should be:
# {"ok":true,"result":{"url":"https://abc123def456.ngrok.io/telegram/webhook",...}}
```

**Verify webhook:**
```bash
curl "https://api.telegram.org/bot${TOKEN}/getWebhookInfo"

# Shows current webhook status, last error, etc.
```

### 5. Test the Bot

1. **Find your bot:**
   - Telegram search: `@ai_inbox_yourusername_bot`
   - Click "Start"

2. **Send messages:**
   - Text: "Salom! Bu test xabaridir"
   - Photo: Send an image with caption
   - Voice: Record audio message
   - Video: Send a video

3. **Check backend logs:**
   ```
   [telegram] Webhook received: chat_id=123456789, text=Salom! Bu test xabaridir
   [store] Message saved to conversations table
   [ai] Analyzing message with Claude...
   [realtime] message INSERT event triggered
   ```

4. **Check frontend:**
   - Open `/inbox`
   - Should see new conversation with your bot username
   - Message appears instantly ✅

## Message Types Supported

| Type | Handler | Result |
|------|---------|--------|
| **Text** | parse_media → kind: "text" | Message.text |
| **Photo** | extract file_id + caption | Message.mediaUrl (proxied) |
| **Voice** | extract file_id, transcribe (TODO) | Message.kind: "voice" |
| **Video** | extract file_id | Message.mediaUrl |
| **Sticker** | extract emoji + file_id | Message.kind: "sticker" |

**Example payloads:**

```json
// Text message
{
  "message": {
    "chat": {"id": 123456789, "first_name": "Ali", "username": "ali_user"},
    "text": "Narx qancha?"
  }
}

// Photo with caption
{
  "message": {
    "chat": {"id": 123456789, "first_name": "Ali"},
    "photo": [{...}, {"file_id": "AgACAgIAAxkBAAIBZ..."}],
    "caption": "Rasm sifatini tekshiring"
  }
}

// Voice message
{
  "message": {
    "chat": {"id": 123456789},
    "voice": {"file_id": "AwACAgIAAxkBAAIBZ..."}
  }
}
```

## Backend Processing

**File**: `backend/app/telegram.py`

### parse_update()

Extracts relevant fields from Telegram JSON:

```python
def parse_update(update: dict):
    message = update.get("message")  # None if not a message
    
    # Extract chat info
    chat_id = message["chat"]["id"]  # required
    name = message["chat"].get("first_name", "")
    username = message["chat"].get("username")
    
    # Extract content
    text = message.get("text")
    media = _parse_media(message)
    
    # Media priority: photo/voice/video/sticker
    # Falls back to text if no media
    
    return {
        "chat_id": chat_id,
        "name": name,
        "username": "@" + username if username else None,
        "text": text or media["text"],
        "kind": media["kind"] if media else "text",
        "media_file_id": media["file_id"] if media else None,
        "ai_text": text or transcript  # for AI analysis
    }
```

### Webhook Handler

**File**: `backend/app/main.py`

```python
@app.post("/telegram/webhook")
async def telegram_webhook(update: dict):
    # 1. Parse update
    parsed = telegram.parse_update(update)
    if not parsed:
        return {"ok": True}  # Ignore non-messages
    
    # 2. Find or create customer
    ids = database.find_or_create_customer(
        telegram_chat_id=parsed["chat_id"],
        name=parsed["name"],
        username=parsed["username"]
    )
    
    # 3. Save message
    message = database.add_message(
        conversation_id=ids["conversation_id"],
        sender="customer",
        text=parsed["text"],
        kind=parsed["kind"],
        media_file_id=parsed["media_file_id"]
    )
    
    # 4. Analyze with AI (async, don't wait)
    if parsed["ai_text"]:
        ai.analyze_message(message["id"], ids["conversation_id"], parsed["ai_text"])
    
    return {"ok": True}
```

## Media Handling

### Photo (Image)

```
Customer sends photo with caption
    ↓
file_id extracted (largest size)
    ↓
Stored in messages.media_file_id
    ↓
Frontend calls: GET /api/media/{file_id}
    ↓
Backend proxies to Telegram: getFile()
    ↓
Returns raw image bytes
    ↓
Browser displays image
```

**Why proxy?**
- Bot token stays secret (not exposed to frontend)
- Secure: only authenticated calls reach backend
- Can add access control later

### Voice (Audio)

```
Customer sends voice message
    ↓
file_id stored
    ↓
kind="voice", text="🎤 Ovozli xabar"
    ↓
Frontend shows audio player + transcript (if available)
    ↓
transcribe_voice() TODO:
    - Call Whisper API (or alternatives)
    - Convert audio to text
    - Save in messages.transcript
```

Currently stubbed - ready for Whisper integration.

## Sending Messages (Business → Customer)

**File**: `backend/app/telegram.py`

```python
def send_message(chat_id: int, text: str) -> bool:
    """Send message from business back to customer on Telegram."""
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    
    # POST to Telegram API
    response = httpx.post(
        f"https://api.telegram.org/bot{token}/sendMessage",
        json={"chat_id": chat_id, "text": text}
    )
    
    return response.status_code == 200
```

**Used by:**
- `/api/conversations/{id}/reply` endpoint
- Operator clicks "Yuborish" in dashboard
- Message sent to customer's Telegram instantly

## Customer Model

**File**: `backend/app/database.py`

```python
customers table:
├─ id (uuid)
├─ business_id (foreign key → businesses)
├─ name (customer full name)
├─ channel ("telegram", "whatsapp", "instagram")
├─ username ("@ali_user" or None)
├─ telegram_chat_id (unique - used to find existing customer)
└─ created_at

Unique constraint: (business_id, telegram_chat_id)
→ Same customer for same Telegram ID per business
```

## Conversation Creation

First message from new customer:

```
parse_update() → chat_id=123456789
    ↓
find_or_create_customer(telegram_chat_id=123456789, ...)
    ↓
Query customers table: telegram_chat_id=123456789?
    ↓
Not found → CREATE customer
    ↓
CREATE conversation (empty, unread_count=0)
    ↓
Return {customer_id, conversation_id}
    ↓
Save message to conversation ✅
```

Repeat customer:

```
parse_update() → chat_id=123456789
    ↓
find_or_create_customer(telegram_chat_id=123456789, ...)
    ↓
Query customers table: telegram_chat_id=123456789?
    ↓
Found → Return existing conversation_id
    ↓
Save message to existing conversation ✅
```

## AI Analysis (Automatic)

Every message triggers analysis:

```python
# File: app/main.py → telegram_webhook()

if parsed["ai_text"]:  # Only if text exists (not sticker)
    ai.analyze_message(message["id"], conversation_id, parsed["ai_text"])
```

**Three-stage analysis:**

1. **Pre-filter** (free, fast):
   - Trivial messages ("ok", "rahmat") → neutral/other
   - Greetings → neutral/other
   - Skip AI call (0 tokens)

2. **Claude Haiku** (cheap):
   - Sentiment: positive/neutral/negative
   - Intent: question/complaint/order/feedback/other
   - Suggested reply

3. **Claude Opus** (expensive, selective):
   - Only if negative/complaint
   - Generates empathetic, detailed reply
   - Caches last 5 messages (context)

**Result cached** in analyses table:
- Same message never re-analyzed
- Frontend shows suggestion immediately
- Operator can edit or send as-is

## Testing

### Manual Test (curl)

```bash
# Simulate customer message
curl -X POST http://localhost:8000/telegram/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "chat": {
        "id": 987654321,
        "first_name": "Test",
        "username": "testuser"
      },
      "text": "Narx qancha?"
    }
  }'

# Response: {"ok": true}

# Check browser: message appears in /inbox ✅
```

### Real Bot Test

1. Send actual message via Telegram
2. Watch backend logs for `[telegram]` messages
3. Refresh `/inbox` → message appears
4. Check Supabase dashboard → Tables → messages → new row

### Edge Cases

```bash
# No text, no media (ignored)
{"message": {"chat": {"id": 123}, "location": {...}}}
→ Webhook returns {"ok": true}, message discarded

# Photo without caption (caption="📷 Rasm")
{"message": {"chat": {"id": 123}, "photo": [...]}}
→ Saved with text="📷 Rasm", kind="photo"

# Sticker (emoji preserved)
{"message": {"chat": {"id": 123}, "sticker": {"emoji": "🎉"}}}
→ Saved with text="🎉", kind="sticker"
```

## Troubleshooting

### Webhook not receiving messages

**Check 1: Webhook registered?**
```bash
curl "https://api.telegram.org/bot${TOKEN}/getWebhookInfo"
# Should show: "url": "https://your-webhook-url/telegram/webhook"
```

**Check 2: Backend running?**
```bash
curl http://localhost:8000/health
# Should return: {"status": "ok", "store": "..."}
```

**Check 3: ngrok still running?**
```bash
ngrok http 8000
# Check Forwarding URL matches webhook URL
```

**Check 4: Backend logs?**
```
python3 -m uvicorn app.main:app --reload --port 8000
# Watch for [telegram] messages
```

### Photo/Voice not showing

**Issue**: file_id invalid or expired

**Solution**:
- Media expires after ~24 hours
- User can re-send
- Or implement batch download in maintenance task

### Message appears after 4 seconds (not instant)

**Issue**: Supabase Realtime not connected

**Solution**:
- Check `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`
- Check console: `[realtime] SUBSCRIBED`
- Falls back to polling

## Production Checklist

- [ ] Bot token in `.env` (not in code)
- [ ] HTTPS webhook URL (ngrok → real domain)
- [ ] Rate limiting (prevent abuse)
- [ ] Message validation (no SQL injection)
- [ ] Error logging (sentry/datadog)
- [ ] Webhook signature verification (Telegram secret)
- [ ] Max message size checks (prevent OOM)
- [ ] Conversation archival (old chats cleanup)

## Next Steps

1. ✅ **Telegram Bot** - Real messages
2. **Payment Webhooks** - Handle subscription events
3. **WhatsApp Integration** - Similar to Telegram
4. **Instagram DM Integration** - Messages from DMs
5. **Queue System** - Async message processing

## References

- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Webhook Guide](https://core.telegram.org/bots/webhooks)
- [Message Types](https://core.telegram.org/bots/api#message)
- [Security](https://core.telegram.org/bots/webhooks#testing-your-bot-with-curl)
