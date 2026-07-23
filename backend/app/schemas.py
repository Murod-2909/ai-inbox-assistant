"""Pydantic sxemalar — API kirish/chiqish ma'lumotlarining "shakli".

FastAPI bu klasslar orqali:
- kiruvchi JSON'ni avtomatik tekshiradi (masalan, bo'sh text kelsa 422 xato)
- chiquvchi JSON'ni avtomatik hujjatlashtiradi (http://localhost:8000/docs)

Bu klasslar frontend'dagi src/lib/types.ts bilan mos — ikkala tomon
bir xil "til"da gaplashadi.
"""

from typing import Optional

from pydantic import BaseModel, Field


class Customer(BaseModel):
    id: str
    name: str
    channel: str = "telegram"
    username: Optional[str] = None


class AiAnalysis(BaseModel):
    sentiment: str
    intent: str
    suggestedReply: str  # frontend camelCase kutadi


class Conversation(BaseModel):
    id: str
    customer: Customer
    lastMessage: str
    lastMessageAt: str
    unreadCount: int
    analysis: Optional[AiAnalysis] = None


class Message(BaseModel):
    id: str
    conversationId: str
    # frontend 'from' deb ataydi, lekin 'from' Python'da kalit so'z —
    # shuning uchun Field(alias=...) ishlatamiz
    from_: str = Field(alias="from")
    text: str
    sentAt: str

    class Config:
        populate_by_name = True


class ReplyRequest(BaseModel):
    """POST /api/conversations/{id}/reply so'rovining tanasi."""
    text: str = Field(min_length=1, max_length=4000)


class TemplateRequest(BaseModel):
    """Yangi javob shabloni yaratish."""
    title: str = Field(min_length=1, max_length=100)
    text: str = Field(min_length=1, max_length=2000)


class NoteRequest(BaseModel):
    """Suhbatga ichki eslatma qo'shish."""
    text: str = Field(min_length=1, max_length=2000)
    author: str = "Operator"  # Auth qo'shilgach haqiqiy operator ismi bo'ladi


class AssignRequest(BaseModel):
    """Suhbatni operatorga tayinlash. operatorId=None — tayinlashni bekor qiladi.

    Backend endpointlar hozircha JWT tekshirmaydi (service_role bilan ishlaydi),
    shuning uchun operator ID'ni frontend Supabase sessiyasidan o'zi yuboradi.
    """
    operatorId: Optional[str] = None


class WorkingHours(BaseModel):
    """Har kuni bir xil vaqt oralig'i — soddalashtirilgan model.

    Yoqilsa, shu oraliqdan tashqarida kelgan birinchi xabarga avtomatik
    javob yuboriladi (webhook handlerlarda ishlatiladi).
    """
    enabled: bool = False
    start: str = "09:00"  # "HH:MM"
    end: str = "18:00"
    message: str = "Ish vaqtimiz tugadi. Ertaga javob beramiz!"


class BusinessUpdateRequest(BaseModel):
    """PUT /api/business — ikkala maydon ham ixtiyoriy, faqat berilgani yangilanadi."""
    name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    workingHours: Optional[WorkingHours] = None


class InviteRequest(BaseModel):
    """POST /api/team/invite — jamoaga yangi operator taklif qilish."""
    email: str = Field(min_length=3, max_length=200)
    fullName: Optional[str] = None
