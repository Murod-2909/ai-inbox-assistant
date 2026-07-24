import type { Dictionary } from "./common";

export const auth = {
  "auth.divider.or": { uz: "yoki", ru: "или", en: "or" },
  "auth.divider.orEmail": { uz: "yoki email bilan", ru: "или через email", en: "or with email" },
  "auth.emailLabel": { uz: "Email", ru: "Email", en: "Email" },
  "auth.emailPlaceholder": { uz: "siz@biznes.uz", ru: "you@business.uz", en: "you@business.com" },
  "auth.passwordLabel": { uz: "Parol", ru: "Пароль", en: "Password" },
  "auth.nameLabel": { uz: "Ismingiz", ru: "Ваше имя", en: "Your name" },
  "auth.namePlaceholder": { uz: "Aziza Karimova", ru: "Азиза Каримова", en: "Aziza Karimova" },
  "auth.checkingSession": { uz: "Tekshirilmoqda...", ru: "Проверка...", en: "Checking..." },

  "auth.login.title": { uz: "Xush kelibsiz!", ru: "Добро пожаловать!", en: "Welcome back!" },
  "auth.login.subtitle": { uz: "Hisobingizga kiring", ru: "Войдите в свой аккаунт", en: "Sign in to your account" },
  "auth.login.googleLabel": { uz: "Google bilan kirish", ru: "Войти через Google", en: "Sign in with Google" },
  "auth.login.errorGeneric": {
    uz: "Email yoki parol noto'g'ri. Qayta urinib ko'ring.",
    ru: "Неверный email или пароль. Попробуйте снова.",
    en: "Incorrect email or password. Please try again.",
  },
  "auth.login.errorNotConfirmed": {
    uz: "Email hali tasdiqlanmagan — pochtangizdagi havolani bosing",
    ru: "Email ещё не подтверждён — перейдите по ссылке в письме",
    en: "Email not confirmed yet — click the link we sent you",
  },
  "auth.login.forgotPassword": { uz: "Parolni unutdingizmi?", ru: "Забыли пароль?", en: "Forgot password?" },
  "auth.login.rememberMe": { uz: "Meni eslab qol", ru: "Запомнить меня", en: "Remember me" },
  "auth.login.submit": { uz: "Kirish", ru: "Войти", en: "Log in" },
  "auth.login.submitting": { uz: "Kirilmoqda...", ru: "Вход...", en: "Signing in..." },
  "auth.login.noAccount": { uz: "Hisobingiz yo'qmi?", ru: "Нет аккаунта?", en: "Don't have an account?" },
  "auth.login.signupLink": { uz: "Ro'yxatdan o'ting", ru: "Зарегистрироваться", en: "Sign up" },

  "auth.signup.title": { uz: "Hisob yarating", ru: "Создайте аккаунт", en: "Create an account" },
  "auth.signup.subtitle": {
    uz: "Bepul boshlang — karta talab qilinmaydi",
    ru: "Начните бесплатно — карта не требуется",
    en: "Start for free — no card required",
  },
  "auth.signup.googleLabel": {
    uz: "Google bilan davom etish",
    ru: "Продолжить через Google",
    en: "Continue with Google",
  },
  "auth.signup.passwordPlaceholder": {
    uz: "Kamida 6 belgi",
    ru: "Минимум 6 символов",
    en: "At least 6 characters",
  },
  "auth.signup.submit": { uz: "Ro'yxatdan o'tish", ru: "Зарегистрироваться", en: "Sign up" },
  "auth.signup.submitting": { uz: "Yaratilmoqda...", ru: "Создание...", en: "Creating..." },
  "auth.signup.haveAccount": { uz: "Hisobingiz bormi?", ru: "Уже есть аккаунт?", en: "Already have an account?" },
  "auth.signup.loginLink": { uz: "Kirish", ru: "Войти", en: "Log in" },
  "auth.signup.errUserExists": {
    uz: "Bu email allaqachon ro'yxatdan o'tgan — Kirish sahifasidan foydalaning",
    ru: "Этот email уже зарегистрирован — используйте страницу входа",
    en: "This email is already registered — use the login page instead",
  },
  "auth.signup.errGeneric": {
    uz: "Ro'yxatdan o'tishda xatolik: {{message}}",
    ru: "Ошибка регистрации: {{message}}",
    en: "Sign-up error: {{message}}",
  },
  "auth.signup.errName": { uz: "Ismingizni kiriting", ru: "Введите ваше имя", en: "Enter your name" },
  "auth.signup.errEmail": {
    uz: "Email noto'g'ri formatda",
    ru: "Неверный формат email",
    en: "Invalid email format",
  },
  "auth.signup.errPassword": {
    uz: "Parol kamida 6 belgi bo'lsin",
    ru: "Пароль должен содержать не менее 6 символов",
    en: "Password must be at least 6 characters",
  },

  "auth.signup.verify.title": {
    uz: "Emailingizni tekshiring",
    ru: "Проверьте вашу почту",
    en: "Check your email",
  },
  "auth.signup.verify.text": {
    uz: "{{email}} manziliga tasdiqlash havolasi yubordik. Havolani bosganingizdan so'ng hisobingiz faollashadi.",
    ru: "Мы отправили ссылку для подтверждения на {{email}}. После перехода по ней ваш аккаунт будет активирован.",
    en: "We sent a confirmation link to {{email}}. Your account will be activated once you click it.",
  },
  "auth.signup.verify.demoNote": {
    uz: "(Demo rejim — hozircha xat yuborilmaydi)",
    ru: "(Демо-режим — письмо пока не отправляется)",
    en: "(Demo mode — no email is actually sent)",
  },
  "auth.signup.verify.continue": {
    uz: "Tasdiqladim — davom etish",
    ru: "Подтвердил — продолжить",
    en: "Confirmed — continue",
  },

  "auth.signup.onboarding.title": {
    uz: "Biznesingiz haqida",
    ru: "О вашем бизнесе",
    en: "About your business",
  },
  "auth.signup.onboarding.subtitle": {
    uz: "Dashboard'ni sizga moslashtirishimiz uchun bir daqiqa",
    ru: "Ещё минута, чтобы настроить дашборд под вас",
    en: "One more minute to tailor your dashboard",
  },
  "auth.signup.onboarding.businessNameLabel": {
    uz: "Biznes nomi",
    ru: "Название бизнеса",
    en: "Business name",
  },
  "auth.signup.onboarding.businessNamePlaceholder": {
    uz: "Masalan: Go'zallik saloni «Nilufar»",
    ru: "Например: Салон красоты «Нилуфар»",
    en: "e.g. Nilufar Beauty Salon",
  },
  "auth.signup.onboarding.categoryLabel": {
    uz: "Faoliyat turi",
    ru: "Сфера деятельности",
    en: "Business category",
  },
  "auth.signup.onboarding.submit": {
    uz: "Dashboard'ga o'tish →",
    ru: "Перейти в дашборд →",
    en: "Go to dashboard →",
  },

  "auth.category.shop": { uz: "Do'kon", ru: "Магазин", en: "Shop" },
  "auth.category.clinic": { uz: "Klinika", ru: "Клиника", en: "Clinic" },
  "auth.category.salon": { uz: "Salon", ru: "Салон", en: "Salon" },
  "auth.category.education": { uz: "O'quv markazi", ru: "Учебный центр", en: "Education center" },
  "auth.category.other": { uz: "Boshqa", ru: "Другое", en: "Other" },

  "auth.reset.title": { uz: "Parolni tiklash", ru: "Восстановление пароля", en: "Reset password" },
  "auth.reset.subtitle": {
    uz: "Email manzilingizni kiriting — tiklash havolasini yuboramiz",
    ru: "Введите свой email — мы отправим ссылку для восстановления",
    en: "Enter your email — we'll send a reset link",
  },
  "auth.reset.errInvalid": {
    uz: "Email manzilini to'g'ri kiriting",
    ru: "Введите корректный email",
    en: "Enter a valid email address",
  },
  "auth.reset.submit": { uz: "Havola yuborish", ru: "Отправить ссылку", en: "Send link" },
  "auth.reset.rememberedIt": { uz: "Esladingizmi?", ru: "Вспомнили пароль?", en: "Remembered it?" },
  "auth.reset.sent.title": { uz: "Havola yuborildi", ru: "Ссылка отправлена", en: "Link sent" },
  "auth.reset.sent.text": {
    uz: "Agar {{email}} ro'yxatdan o'tgan bo'lsa, parolni tiklash havolasi yuborildi. Pochtangizni (spam papkasini ham) tekshiring.",
    ru: "Если {{email}} зарегистрирован, ссылка для восстановления пароля отправлена. Проверьте почту (и папку «Спам»).",
    en: "If {{email}} is registered, a password reset link has been sent. Check your inbox (and spam folder).",
  },
  "auth.reset.backToLogin": {
    uz: "Kirish sahifasiga qaytish",
    ru: "Вернуться на страницу входа",
    en: "Back to login",
  },

  "auth.google.demoNote": {
    uz: "ℹ️ Google orqali kirish Supabase Auth ulangach ishlaydi (hozircha demo rejim — email va parol bilan davom eting).",
    ru: "ℹ️ Вход через Google заработает после подключения Supabase Auth (сейчас демо-режим — используйте email и пароль).",
    en: "ℹ️ Google sign-in will work once Supabase Auth is connected (currently demo mode — continue with email and password).",
  },
} satisfies Dictionary;
