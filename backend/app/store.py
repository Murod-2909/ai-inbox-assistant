"""Ma'lumotlar drayverini tanlash.

.env da SUPABASE_URL + SUPABASE_SERVICE_KEY bo'lsa -> Supabase (Postgres),
bo'lmasa -> lokal SQLite. Ikkala modul ham bir xil funksiyalarni beradi,
shuning uchun main.py va ai.py "qaysi baza?"ni umuman bilmaydi.

Bu — modullarga bo'lishning asosiy foydasi: bazani almashtirish uchun
faqat shu bitta fayl qaror qabul qiladi.
"""

import os

SUPABASE_ENABLED = bool(
    os.getenv("SUPABASE_URL") and os.getenv("SUPABASE_SERVICE_KEY")
)

if SUPABASE_ENABLED:
    from app import supabase_db as db  # noqa: F401
else:
    from app import database as db  # noqa: F401
