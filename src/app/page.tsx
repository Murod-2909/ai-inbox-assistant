// Landing (bosh) sahifa — struktura chatterapp.io / crisp.chat kabi
// SaaS landinglardan o'rganilgan: hero → kanallar → xususiyatlar →
// qadamlar → narxlar → FAQ → CTA → footer. Dizayn — o'zimizniki.
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { FloatingElement } from "@/components/animations/FloatingElement";
import { AnimatedCounter } from "@/components/animations/AnimatedCounter";
import { GradientBg } from "@/components/animations/GradientBg";
import { HeroScene } from "@/components/3d/HeroScene";
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
      <GradientBg />
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
          <Link href="/signup" className={styles.primaryButton}>
            Bepul boshlash
          </Link>
        </div>
      </nav>

      {/* --- Hero --- */}
      <header className={styles.hero}>
        <div className={styles.heroText}>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Barcha mijoz xabarlari.
            <br />
            <span className={styles.accent}>Bitta joyda. AI bilan.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Do&apos;kon, klinika, salon yoki o&apos;quv markazi uchun: Telegram
            xabarlarini yagona inbox&apos;ga yig&apos;ing, AI tahlili va tayyor
            javob takliflari bilan mijozlarga 3 barobar tez javob bering.
          </motion.p>
          <motion.div
            className={styles.heroCtas}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/signup" className={styles.primaryButtonLarge}>
                Bepul boshlash
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/inbox" className={styles.ghostButtonLarge}>
                Jonli demo ko&apos;rish
              </Link>
            </motion.div>
          </motion.div>
          <motion.span
            className={styles.heroNote}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Karta talab qilinmaydi · 5 daqiqada ulanish
          </motion.span>
        </div>

        {/* 3D Hero Scene */}
        <FloatingElement delay={0.5} distance={30}>
          <HeroScene />
        </FloatingElement>

        {/* Mini dashboard ko'rinishi (CSS bilan chizilgan) */}
        <motion.div
          className={styles.heroPreview}
          aria-hidden="true"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
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
        </motion.div>
      </header>

      {/* --- Kimlar uchun --- */}
      <section className={styles.audience}>
        <span>Kimlar uchun:</span>
        <div className={styles.audienceChips}>
          <span>🛍 Do&apos;konlar</span>
          <span>🏥 Klinikalar</span>
          <span>💇 Salonlar</span>
          <span>📚 O&apos;quv markazlari</span>
        </div>
      </section>

      {/* --- Kanallar --- */}
      <section className={styles.channels}>
        <h2>Mijozlaringiz qayerda bo&apos;lsa — siz ham o&apos;sha yerdasiz</h2>
        <div className={styles.channelCards}>
          <div className={`${styles.channelCard} ${styles.channelActive}`}>
            <span className={styles.channelIcon}>✈️</span>
            <strong>Telegram</strong>
            <em>Faol</em>
          </div>
          <div className={styles.channelCard}>
            <span className={styles.channelIcon}>💚</span>
            <strong>WhatsApp</strong>
            <em>Tez orada</em>
          </div>
          <div className={styles.channelCard}>
            <span className={styles.channelIcon}>📸</span>
            <strong>Instagram</strong>
            <em>Tez orada</em>
          </div>
        </div>
      </section>

      {/* --- Xususiyatlar --- */}
      <section id="features" className={styles.features}>
        <ScrollReveal>
          <h2>Kichik jamoa uchun katta imkoniyatlar</h2>
        </ScrollReveal>
        <div className={styles.featureGrid}>
          {FEATURES.map((feature, index) => (
            <ScrollReveal key={feature.title} delay={index * 0.1}>
              <motion.div
                className={styles.featureCard}
                whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(79, 70, 229, 0.2)" }}
                transition={{ duration: 0.3 }}
              >
                <span className={styles.featureIcon}>{feature.icon}</span>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </motion.div>
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
          {STEPS.map((step) => (
            <ScrollReveal key={step.number} delay={parseInt(step.number) * 0.15}>
              <motion.div
                className={styles.step}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <motion.span
                  className={styles.stepNumber}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: parseInt(step.number) * 0.3 }}
                >
                  {step.number}
                </motion.span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* --- Narxlar --- */}
      <section id="pricing" className={styles.pricing}>
        <ScrollReveal>
          <h2>Oddiy va oshkora narxlar</h2>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <p className={styles.pricingNote}>
            Narxlar dastlabki — rasmiy ishga tushishda aniqlashtiriladi
          </p>
        </ScrollReveal>
        <div className={styles.planGrid}>
          {PLANS.map((plan, index) => (
            <ScrollReveal key={plan.name} delay={index * 0.15}>
              <motion.div
                className={`${styles.plan} ${plan.highlighted ? styles.planHighlighted : ""}`}
                whileHover={{ y: -10, boxShadow: "0 30px 60px rgba(79, 70, 229, 0.2)" }}
                transition={{ duration: 0.3 }}
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
              <Link
                href={plan.name === "Bepul" ? "/inbox" : "/checkout"}
                className={
                  plan.highlighted
                    ? styles.primaryButton
                    : styles.ghostButton
                }
              >
                {plan.cta}
              </Link>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* --- FAQ --- */}
      <section id="faq" className={styles.faq}>
        <h2>Ko&apos;p so&apos;raladigan savollar</h2>
        <div className={styles.faqList}>
          {FAQ.map((item) => (
            <details key={item.q} className={styles.faqItem}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* --- Yakuniy CTA --- */}
      <section className={styles.finalCta}>
        <h2>Mijozlaringizni kuttirmang</h2>
        <p>Bugun ulaning — birinchi xabarlar 5 daqiqada inbox&apos;ingizda.</p>
        <Link href="/signup" className={styles.primaryButtonLarge}>
          Bepul boshlash
        </Link>
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
