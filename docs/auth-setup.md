# Authentication - Supabase Auth Integration

Complete auth system: signup → email verification → dashboard access.

## How It Works

```
Landing Page
    ↓ (unauthenticated)
/signup → Create account (email + password)
    ↓
Email verification (Supabase sends link)
    ↓ (user clicks link in email)
/onboarding → Business profile setup
    ↓
/inbox (protected - requires auth)

/login → Sign in with email/password
    ↓ (if password wrong)
/reset → Password recovery
```

## Authentication Flow

### 1. Signup (New User)

**File**: `src/app/(auth)/signup/page.tsx`

Steps:
1. User fills: Name, Email, Password
2. Frontend calls `supabase.auth.signUp()`
3. Supabase sends confirmation email
4. User clicks link in email → email verified
5. Redirect to `/onboarding` → Business info → `/inbox`

**Validation:**
- Name: 2+ characters
- Email: Valid format
- Password: 6+ characters

**Error handling:**
- "User already registered" → link to login
- Other errors → show message

### 2. Login (Existing User)

**File**: `src/app/(auth)/login/page.tsx`

1. User enters Email + Password
2. Frontend calls `supabase.auth.signInWithPassword()`
3. Supabase validates credentials
4. If OK → session created → `/inbox`
5. If wrong → "Email or password incorrect"

**Security:**
- No email enumeration (same error for wrong email/password)
- Session stored in localStorage (Supabase manages it)
- "Remember me" checkbox (saves session)

### 3. Password Reset

**File**: `src/app/(auth)/reset/page.tsx`

1. User enters email
2. Frontend calls `supabase.auth.resetPasswordForEmail()`
3. Supabase sends reset link (expires in 1 hour)
4. User clicks link → password reset form
5. New password set → redirect to login

**Security:**
- No email enumeration (always says "sent" even if email not found)
- Reset link expires after 1 hour
- Random token (can't guess)

## Frontend Protection

### Protected Routes (Dashboard)

**File**: `src/components/ProtectedLayout.tsx`

```typescript
useAuth() {
  // Get current user + listen to auth changes
  // If not authenticated → redirect to /login
}
```

**Protected pages:**
- `/inbox` (conversations, messages)
- `/channels` (Telegram, WhatsApp, Instagram)
- `/analytics` (statistics)
- `/settings` (templates, notes, business)
- `/checkout` (payment)
- `/success` (post-payment)

**What happens:**
1. User tries to access `/inbox`
2. ProtectedLayout checks `useAuth()`
3. If no user → redirect to `/login`
4. If user → show dashboard

### Public Routes (Auth)

**File**: `src/components/PublicAuthLayout.tsx`

```typescript
// If user already logged in → redirect to /inbox
```

**Public pages:**
- `/` (landing)
- `/login`
- `/signup`
- `/reset`

**What happens:**
1. User tries to access `/login` while logged in
2. PublicAuthLayout checks `useAuth()`
3. If user exists → redirect to `/inbox`
4. If no user → show login form

## Backend Integration

### Supabase Auth → Operator Table

**File**: `backend/supabase/schema.sql`

```sql
-- Trigger: when user signs up, auto-create operator record
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function handle_new_user();

-- Function creates:
INSERT INTO operators (id, business_id, full_name)
VALUES (
  new.id,
  (select id from businesses limit 1),  -- default business
  new.raw_user_meta_data->'full_name'
);
```

**Result:**
- User signup in Auth → Operator record created
- Operator linked to default business
- Can immediately use dashboard

### RLS (Row Level Security)

Every table has RLS policy:

```sql
-- "own business" policy
for select using (business_id = current_business_id());

-- current_business_id() function:
select business_id from operators where id = auth.uid();
```

**Result:**
- Operator sees ONLY their business's data
- Frontend anon key can't access other businesses
- Backend service key bypasses RLS (webhooks)

## Setup Checklist

### Prerequisites
- ✅ Supabase project created
- ✅ `schema.sql` run in SQL Editor
- ✅ API keys in `.env` files

### Verify

1. **Signup flow:**
   ```bash
   # Terminal 1: Backend running
   python3 -m uvicorn app.main:app --reload --port 8000
   
   # Terminal 2: Frontend running
   npm run dev
   ```

2. **Open browser:** `http://localhost:3000/signup`

3. **Fill form:**
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "password123"

4. **Click "Ro'yxatdan o'tish"**
   - Should see "Check your email" message
   - Email arrives (check spam folder)

5. **Click email link**
   - Redirects to Supabase callback
   - Then to `/onboarding`

6. **Fill business info:**
   - Name: "Test Shop"
   - Category: Select one
   - Click "Dashboard'ga o'tish"

7. **Should see `/inbox`** ✅

### Testing Login

1. `/login` page
2. Enter email + password from signup
3. Should redirect to `/inbox` ✅

### Testing Password Reset

1. `/reset` page
2. Enter email
3. "Sent" message appears
4. Check email for reset link
5. Click link
6. Set new password
7. Login with new password ✅

## Email Templates

Supabase sends these emails:

| Event | Customization |
|-------|---|
| Confirmation | `Authentication → Email Templates → Confirm signup` |
| Password Reset | `Authentication → Email Templates → Reset password` |
| Magic Link | `Authentication → Email Templates → Magic Link` |

**In dashboard**, you can:
- Edit email subject + body
- Use `{{ .ConfirmationURL }}`, `{{ .EmailAddress }}` variables
- Translate to Uzbek

## Security Best Practices

✅ **Done:**
- Passwords never logged
- Service key never in frontend
- RLS on all tables
- Email unverified users can't access data (until they verify)
- Password reset tokens expire (1 hour)

⚠️ **TODO:**
- Enable HTTPS in production (WSS requirement)
- Rate limit auth endpoints (prevent brute force)
- Monitor failed login attempts
- Enable MFA (multi-factor auth) - optional

## Troubleshooting

### "User already registered"
- Email exists in Supabase Auth
- Go to `/login` or `/reset`

### "Email not confirmed"
- User clicked signup but didn't verify email
- Resend email link (in Supabase dashboard)

### "Invalid or expired token"
- Reset link > 1 hour old
- Go to `/reset` to get new link

### User can access `/inbox` without auth
- Check `NEXT_PUBLIC_SUPABASE_URL` + key are set
- Check browser console for `[realtime]` errors
- Try without Supabase (fallback to demo mode)

### Can't see email
- Check spam/promotions folder
- Create new test email (some providers block Supabase)
- Resend in Supabase dashboard: `Authentication → Users → [user] → Resend`

## Next Steps

1. ✅ **Auth Pages** - Signup/Login/Reset working
2. **Telegram Bot** - Real message webhook
3. **Payment Webhooks** - Handle subscription events
4. **Google OAuth** - Optional 3rd auth method
5. **Multi-tenant** - Different businesses per workspace

## References

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Password Reset](https://supabase.com/docs/reference/javascript/auth-resetpasswordforemail)
- [Email Templates](https://supabase.com/docs/guides/auth/email-templates)
- [RLS](https://supabase.com/docs/guides/auth/row-level-security)
