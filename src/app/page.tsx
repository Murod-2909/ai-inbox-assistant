// Landing (bosh) sahifa — struktura chatterapp.io / crisp.chat kabi
// SaaS landinglardan o'rganilgan: hero → kanallar → xususiyatlar →
// qadamlar → narxlar → FAQ → CTA → footer. Dizayn — o'zimizniki.
//
// Animatsiyalar: scroll-reveal, magnetik CTA tugmalar, 3D tilt kartalar,
// fonda suzib yuruvchi "xabar" zarrachalari, kanallar orbit diagrammasi,
// soha ko'rgazmasi (hover-expand) — barchasi src/components/animations
// va src/components/cursor'da.
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Magnetic } from "@/components/animations/Magnetic";
import { TiltCard } from "@/components/animations/TiltCard";
import { MessageParticles } from "@/components/animations/MessageParticles";
import { OrbitDiagram } from "@/components/animations/OrbitDiagram";
import { IndustryShowcase } from "@/components/animations/IndustryShowcase";
import styles from "./landing.module.scss";

const FEATURES = [
  {
    icon: "📥",
    title: "Yagona inbox",
    text: "Telegram (keyin WhatsApp, Instagram) xabarlari bitta oynada — hech narsa e'tibordan chetda qolmaydi.",
  },
  {
    icon: "🧠",
    title: "AI tahlil",
    text: "Har bir xabarning kayfiyati va maqsadi (savol, buyurtma, shikoyat) avtomatik aniqlanadi.",
  },
  {
    icon: "✨",
    title: "Javob taklifi",
    text: "AI mijozga mos javob taklif qiladi — operator bir bosishda tasdiqlab yuboradi.",
  },
  {
    icon: "🎤",
    title: "Media va ovoz",
    text: "Rasm, video, stiker va ovozli xabarlar dashboard'da ochiladi; ovoz matnga aylanadi.",
  },
  {
    icon: "📊",
    title: "Jonli statistika",
    text: "Javob tezligi, kayfiyat va murojaat turlari bo'yicha real vaqtdagi hisobotlar.",
  },
  {
    icon: "⚡",
    title: "Tezkor shablonlar",
    text: "Ko'p so'raladigan savollarga tayyor javoblar — jamoa bir xilda va tez javob beradi.",
  },
];

const STEPS = [
  {
    number: "1",
    title: "Botni ulang",
    text: "@BotFather'dan olingan tokenni kiriting — 1 daqiqada tayyor.",
  },
  {
    number: "2",
    title: "Xabarlar oqib keladi",
    text: "Mijozlaringiz yozgan har bir xabar darhol inbox'ingizga tushadi.",
  },
  {
    number: "3",
    title: "AI bilan javob bering",
    text: "Tahlil va tayyor javob taklifini ko'rib, bir bosishda yuboring.",
  },
];

const INDUSTRIES = [
  {
    icon: "🛍",
    title: "Do'konlar",
    subtitle: "Mahsulot va buyurtma savollari",
    detail:
      "Narx, mavjudlik va yetkazib berish holati haqidagi savollarga AI darhol javob taklif qiladi — siz faqat tasdiqlaysiz.",
  },
  {
    icon: "🏥",
    title: "Klinikalar",
    subtitle: "Navbat va konsultatsiya so'rovlari",
    detail:
      "Bemorlarning yozilish va ish vaqti haqidagi murojaatlari avtomatik tartiblanadi, shoshilinch xabarlar ajratib ko'rsatiladi.",
  },
  {
    icon: "💇",
    title: "Salonlar",
    subtitle: "Yozilish va bandlik savollari",
    detail:
      "Mijozlar bo'sh vaqtlarni so'raganda, tayyor javob shablonlari bilan bir necha soniyada javob bering.",
  },
  {
    icon: "📚",
    title: "O'quv markazlari",
    subtitle: "Kurs va ro'yxatga olish savollari",
    detail:
      "Kurs narxi, jadvali va ro'yxatdan o'tish bo'yicha takroriy savollarni AI hal qiladi, murakkab holatlar operatorga qoladi.",
  },
];

const CHANNELS = [
  { icon: "✈️", label: "Telegram", status: "Faol", active: true, angle: 0 },
  { icon: "💚", label: "WhatsApp", status: "Tez orada", angle: 120 },
  { icon: "📸", label: "Instagram", status: "Tez orada", angle: 240 },
];

const PLANS = [
  {
    name: "Bepul",
    price: "0",
    unit: "so'm/oy",
    features: ["1 operator", "Telegram kanali", "Oyiga 100 AI tahlil", "Asosiy statistika"],
    cta: "Bepul boshlash",
    highlighted: false,
  },
  {
    name: "Start",
    price: "149 000",
    unit: "so'm/oy",
    features: [
      "3 operator",
      "Media va ovozli xabarlar",
      "Cheksiz AI tahlil",
      "Javob shablonlari",
      "To'liq statistika",
    ],
    cta: "Boshlash",
    highlighted: true,
  },
  {
    name: "Biznes",
    price: "349 000",
    unit: "so'm/oy",
    features: [
      "Cheksiz operator",
      "WhatsApp + Instagram (tez orada)",
      "CRM va eksport",
      "Avto-javoblar",
      "Ustuvor qo'llab-quvvatlash",
    ],
    cta: "Bog'lanish",
    highlighted: false,
  },
];

const FAQ = [
  {
    q: "Ulanish uchun texnik bilim kerakmi?",
    a: "Yo'q. Telegram'da @BotFather orqali bot yaratib, tokenni tizimga kiritasiz — qolganini biz qilamiz. Butun jarayon 5 daqiqadan oshmaydi.",
  },
  {
    q: "AI mijozga o'zi javob yuboradimi?",
    a: "Yo'q — AI faqat taklif qiladi. Har bir javob operator tasdiqlagandan keyingina yuboriladi. Ish vaqtidan tashqarida esa ixtiyoriy avto-javobni yoqishingiz mumkin.",
  },
  {
    q: "Qaysi kanallar qo'llab-quvvatlanadi?",
    a: "Hozir Telegram to'liq ishlaydi. WhatsApp va Instagram Direct integratsiyalari ustida ishlayapmiz — tez orada qo'shiladi.",
  },
  {
    q: "Ma'lumotlarim xavfsizmi?",
    a: "Har bir biznes faqat o'z ma'lumotlarini ko'radi (satr darajasidagi himoya — RLS), API kalitlar serverda saqlanadi va mijoz ma'lumotlari uchinchi tomonga berilmaydi.",
  },
];

export default function LandingPage() {
  return (
    <div className={styles.landing}>
      {/* --- Navigatsiya --- */}
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <span className={styles.logoMark}>AI</span> Inbox Assistant
        </div>
        <div className={styles.navLinks}>
          <a href="#features">Xususiyatlar</a>
          <a href="#how">Qanday ishlaydi</a>
          <a href="#pricing">Narxlar</a>
          <a href="#faq">FAQ</a>
        </div>
        <div className={styles.navActions}>
          <Link href="/login" className={styles.ghostButton}>
            Kirish
          </Link>
          <Magnetic strength={0.4}>
            <Link href="/signup" className={styles.primaryButton}>
              Bepul boshlash
            </Link>
          </Magnetic>
        </div>
      </nav>

      {/* --- Hero --- */}
      <header className={styles.hero}>
        <MessageParticles count={24} />
        <motion.div
          className={styles.heroText}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1>
            Barcha mijoz xabarlari.
            <br />
            <span className={styles.accent}>Bitta joyda. AI bilan.</span>
          </h1>
          <p>
            Do&apos;kon, klinika, salon yoki o&apos;quv markazi uchun: Telegram
            xabarlarini yagona inbox&apos;ga yig&apos;ing, AI tahlili va tayyor
            javob takliflari bilan mijozlarga 3 barobar tez javob bering.
          </p>
          <div className={styles.heroCtas}>
            <Magnetic strength={0.35}>
              <Link href="/signup" className={styles.primaryButtonLarge}>
                Bepul boshlash
              </Link>
            </Magnetic>
            <Magnetic strength={0.35}>
              <Link href="/inbox" className={styles.ghostButtonLarge}>
                Jonli demo ko&apos;rish
              </Link>
            </Magnetic>
          </div>
          <span className={styles.heroNote}>
            Karta talab qilinmaydi · 5 daqiqada ulanish
          </span>
        </motion.div>

        {/* Mini dashboard ko'rinishi — 3D tilt bilan */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <TiltCard className={styles.heroPreview} maxTilt={6} ariaHidden>
            <div className={styles.previewList}>
              <div className={styles.previewRow}>
                <span className={`${styles.previewDot} ${styles.dotGreen}`} />
                <div>
                  <strong>Dilnoza K.</strong>
                  <small>Ertaga 15:00 ga yozilsam...</small>
                </div>
              </div>
              <div className={`${styles.previewRow} ${styles.previewRowActive}`}>
                <span className={`${styles.previewDot} ${styles.dotRed}`} />
                <div>
                  <strong>Jasur T.</strong>
                  <small>Buyurtmam kelmayapti!</small>
                </div>
              </div>
              <div className={styles.previewRow}>
                <span className={`${styles.previewDot} ${styles.dotAmber}`} />
                <div>
                  <strong>Madina R.</strong>
                  <small>Narxi qancha?</small>
                </div>
              </div>
            </div>
            <div className={styles.previewPanel}>
              <div className={styles.previewBadges}>
                <span>😠 Salbiy</span>
                <span>⚠️ Shikoyat</span>
              </div>
              <div className={styles.previewBubble}>
                Buyurtmam 3 kundan beri kelmayapti!
              </div>
              <div className={styles.previewSuggestion}>
                ✨ AI taklifi: &quot;Uzr so&apos;raymiz! Buyurtma raqamingizni
                yuboring, hoziroq tekshiramiz.&quot;
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </header>

      {/* --- Kimlar uchun (soha ko'rgazmasi) --- */}
      <section className={styles.audience}>
        <ScrollReveal>
          <h2>Sohangizga moslashtirilgan</h2>
        </ScrollReveal>
        <ScrollReveal delay={0.05}>
          <IndustryShowcase items={INDUSTRIES} />
        </ScrollReveal>
      </section>

      {/* --- Kanallar (orbit diagramma) --- */}
      <section className={styles.channels}>
        <ScrollReveal>
          <h2>Mijozlaringiz qayerda bo&apos;lsa — siz ham o&apos;sha yerdasiz</h2>
        </ScrollReveal>
        <ScrollReveal delay={0.08}>
          <OrbitDiagram centerIcon="💬" items={CHANNELS} />
        </ScrollReveal>
      </section>

      {/* --- Xususiyatlar --- */}
      <section id="features" className={styles.features}>
        <ScrollReveal>
          <h2>Kichik jamoa uchun katta imkoniyatlar</h2>
        </ScrollReveal>
        <div className={styles.featureGrid}>
          {FEATURES.map((feature, i) => (
            <ScrollReveal key={feature.title} delay={i * 0.06}>
              <TiltCard className={styles.featureCard} maxTilt={8}>
                <span className={styles.featureIcon}>{feature.icon}</span>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* --- Qanday ishlaydi --- */}
      <section id="how" className={styles.how}>
        <ScrollReveal>
          <h2>3 qadamda ishga tushiring</h2>
        </ScrollReveal>
        <div className={styles.steps}>
          {STEPS.map((step, i) => (
            <ScrollReveal key={step.number} delay={i * 0.12}>
              <div className={styles.step}>
                <motion.span
                  className={styles.stepNumber}
                  initial={{ scale: 0.6, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 300, damping: 15, delay: i * 0.12 }}
                >
                  {step.number}
                </motion.span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* --- Narxlar --- */}
      <section id="pricing" className={styles.pricing}>
        <ScrollReveal>
          <h2>Oddiy va oshkora narxlar</h2>
        </ScrollReveal>
        <ScrollReveal delay={0.05}>
          <p className={styles.pricingNote}>
            Narxlar dastlabki — rasmiy ishga tushishda aniqlashtiriladi
          </p>
        </ScrollReveal>
        <div className={styles.planGrid}>
          {PLANS.map((plan, i) => (
            <ScrollReveal key={plan.name} delay={i * 0.1}>
              <TiltCard
                className={`${styles.plan} ${plan.highlighted ? styles.planHighlighted : ""}`}
                maxTilt={6}
              >
                {plan.highlighted && (
                  <span className={styles.planBadge}>Eng ommabop</span>
                )}
                <h3>{plan.name}</h3>
                <div className={styles.planPrice}>
                  {plan.price} <small>{plan.unit}</small>
                </div>
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>✓ {feature}</li>
                  ))}
                </ul>
                <Magnetic strength={0.3}>
                  <Link
                    href={plan.name === "Bepul" ? "/inbox" : "/checkout"}
                    className={
                      plan.highlighted ? styles.primaryButton : styles.ghostButton
                    }
                  >
                    {plan.cta}
                  </Link>
                </Magnetic>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* --- FAQ --- */}
      <section id="faq" className={styles.faq}>
        <ScrollReveal>
          <h2>Ko&apos;p so&apos;raladigan savollar</h2>
        </ScrollReveal>
        <div className={styles.faqList}>
          {FAQ.map((item, i) => (
            <ScrollReveal key={item.q} delay={i * 0.06}>
              <details className={styles.faqItem}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* --- Yakuniy CTA --- */}
      <section className={styles.finalCta}>
        <ScrollReveal>
          <h2>Mijozlaringizni kuttirmang</h2>
          <p>Bugun ulaning — birinchi xabarlar 5 daqiqada inbox&apos;ingizda.</p>
          <Magnetic strength={0.35}>
            <Link href="/signup" className={styles.primaryButtonLarge}>
              Bepul boshlash
            </Link>
          </Magnetic>
        </ScrollReveal>
      </section>

      {/* --- Footer --- */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <div className={styles.logo}>
              <span className={styles.logoMark}>AI</span> Inbox Assistant
            </div>
            <p>Kichik bizneslar uchun AI yordamchili mijozlar inbox&apos;i.</p>
          </div>
          <div className={styles.footerColumn}>
            <strong>Mahsulot</strong>
            <a href="#features">Xususiyatlar</a>
            <a href="#pricing">Narxlar</a>
            <Link href="/inbox">Jonli demo</Link>
          </div>
          <div className={styles.footerColumn}>
            <strong>Hisob</strong>
            <Link href="/signup">Ro&apos;yxatdan o&apos;tish</Link>
            <Link href="/login">Kirish</Link>
            <Link href="/reset">Parolni tiklash</Link>
          </div>
        </div>
        <div className={styles.footerBottom}>
          © {new Date().getFullYear()} AI Inbox Assistant — barcha huquqlar
          himoyalangan
        </div>
      </footer>
    </div>
  );
}
