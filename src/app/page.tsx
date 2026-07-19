// Landing (bosh) sahifa — struktura chatterapp.io / crisp.chat kabi
// SaaS landinglardan o'rganilgan: hero → kanallar → xususiyatlar →
// qadamlar → narxlar → FAQ → CTA → footer. Dizayn — o'zimizniki.
import Link from "next/link";
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
            <Link href="/signup" className={styles.primaryButtonLarge}>
              Bepul boshlash
            </Link>
            <Link href="/inbox" className={styles.ghostButtonLarge}>
              Jonli demo ko&apos;rish
            </Link>
          </div>
          <span className={styles.heroNote}>
            Karta talab qilinmaydi · 5 daqiqada ulanish
          </span>
        </div>

        {/* Mini dashboard ko'rinishi (CSS bilan chizilgan) */}
        <div className={styles.heroPreview} aria-hidden="true">
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
        </div>
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
        <h2>Kichik jamoa uchun katta imkoniyatlar</h2>
        <div className={styles.featureGrid}>
          {FEATURES.map((feature) => (
            <div key={feature.title} className={styles.featureCard}>
              <span className={styles.featureIcon}>{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- Qanday ishlaydi --- */}
      <section id="how" className={styles.how}>
        <h2>3 qadamda ishga tushiring</h2>
        <div className={styles.steps}>
          {STEPS.map((step) => (
            <div key={step.number} className={styles.step}>
              <span className={styles.stepNumber}>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- Narxlar --- */}
      <section id="pricing" className={styles.pricing}>
        <h2>Oddiy va oshkora narxlar</h2>
        <p className={styles.pricingNote}>
          Narxlar dastlabki — rasmiy ishga tushishda aniqlashtiriladi
        </p>
        <div className={styles.planGrid}>
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`${styles.plan} ${plan.highlighted ? styles.planHighlighted : ""}`}
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
                href="/signup"
                className={
                  plan.highlighted
                    ? styles.primaryButton
                    : styles.ghostButton
                }
              >
                {plan.cta}
              </Link>
            </div>
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
