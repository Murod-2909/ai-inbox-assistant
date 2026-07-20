#!/bin/bash

# Telegram webhook'ni local'da test qilish
# Usage: ./test-telegram.sh

set -e

echo "🤖 Telegram Webhook Test"
echo "======================="

BACKEND_URL="${BACKEND_URL:-http://localhost:8000}"

# Test 1: Text message
echo -e "\n1️⃣ Text message:"
curl -X POST "$BACKEND_URL/telegram/webhook" \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "chat": {
        "id": 987654321,
        "first_name": "Test",
        "username": "testuser"
      },
      "text": "Salom! Bu test xabaridir."
    }
  }' \
  -w "\nStatus: %{http_code}\n"

# Test 2: Message with photo
echo -e "\n2️⃣ Message with photo:"
curl -X POST "$BACKEND_URL/telegram/webhook" \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "chat": {
        "id": 987654321,
        "first_name": "Test"
      },
      "photo": [
        {"file_id": "AgACAgIAAxkBAAIBZ2VscN", "width": 320, "height": 240},
        {"file_id": "AgACAgIAAxkBAAIBZ2ZscN", "width": 800, "height": 600}
      ],
      "caption": "Rasm sifatini tekshiring"
    }
  }' \
  -w "\nStatus: %{http_code}\n"

# Test 3: Sticker
echo -e "\n3️⃣ Sticker message:"
curl -X POST "$BACKEND_URL/telegram/webhook" \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "chat": {
        "id": 987654321,
        "first_name": "Test"
      },
      "sticker": {
        "file_id": "CAACAgIAAxkBAAIBZ",
        "emoji": "👍"
      }
    }
  }' \
  -w "\nStatus: %{http_code}\n"

# Test 4: Voice message
echo -e "\n4️⃣ Voice message:"
curl -X POST "$BACKEND_URL/telegram/webhook" \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "chat": {
        "id": 987654321,
        "first_name": "Test"
      },
      "voice": {
        "file_id": "AwACAgIAAxkBAAIBZ",
        "duration": 5
      }
    }
  }' \
  -w "\nStatus: %{http_code}\n"

echo -e "\n✅ All tests sent!"
echo "Check /inbox to see messages appear"
