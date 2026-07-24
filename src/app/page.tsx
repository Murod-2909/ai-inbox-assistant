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
import {
  TelegramIcon,
  WhatsAppIcon,
  InstagramIcon,
} from "@/components/icons/BrandIcons";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import styles from "./landing.module.scss";

export default function LandingPage() {
  const { t } = useLanguage();

  const FEATURES = [
    { icon: "📥", title: t("landing.features.inbox.title"), text: t("landing.features.inbox.text") },
    { icon: "🧠", title: t("landing.features.ai.title"), text: t("landing.features.ai.text") },
    { icon: "✨", title: t("landing.features.suggestion.title"), text: t("landing.features.suggestion.text") },
    { icon: "🎤", title: t("landing.features.media.title"), text: t("landing.features.media.text") },
    { icon: "📊", title: t("landing.features.stats.title"), text: t("landing.features.stats.text") },
    { icon: "⚡", title: t("landing.features.templates.title"), text: t("landing.features.templates.text") },
  ];

  const STEPS = [
    { number: "1", title: t("landing.how.step1.title"), text: t("landing.how.step1.text") },
    { number: "2", title: t("landing.how.step2.title"), text: t("landing.how.step2.text") },
    { number: "3", title: t("landing.how.step3.title"), text: t("landing.how.step3.text") },
  ];

  const INDUSTRIES = [
    {
      icon: "🛍",
      title: t("landing.industry.shops.title"),
      subtitle: t("landing.industry.shops.subtitle"),
      detail: t("landing.industry.shops.detail"),
    },
    {
      icon: "🏥",
      title: t("landing.industry.clinics.title"),
      subtitle: t("landing.industry.clinics.subtitle"),
      detail: t("landing.industry.clinics.detail"),
    },
    {
      icon: "💇",
      title: t("landing.industry.salons.title"),
      subtitle: t("landing.industry.salons.subtitle"),
      detail: t("landing.industry.salons.detail"),
    },
    {
      icon: "📚",
      title: t("landing.industry.education.title"),
      subtitle: t("landing.industry.education.subtitle"),
      detail: t("landing.industry.education.detail"),
    },
  ];

  const CHANNELS = [
    {
      icon: <TelegramIcon />,
      label: t("landing.channels.telegram"),
      status: t("landing.channels.active"),
      active: true,
      angle: 0,
    },
    {
      icon: <WhatsAppIcon />,
      label: t("landing.channels.whatsapp"),
      status: t("landing.channels.soon"),
      angle: 120,
    },
    {
      icon: <InstagramIcon />,
      label: t("landing.channels.instagram"),
      status: t("landing.channels.soon"),
      angle: 240,
    },
  ];

  const PLANS = [
    {
      name: t("pricing.free.name"),
      slug: "free",
      price: "0",
      unit: t("pricing.unit"),
      features: [
        t("pricing.free.feature.1"),
        t("pricing.free.feature.2"),
        t("pricing.free.feature.3"),
        t("pricing.free.feature.4"),
      ],
      cta: t("pricing.free.cta"),
      highlighted: false,
    },
    {
      name: t("pricing.start.name"),
      slug: "start",
      price: "149 000",
      unit: t("pricing.unit"),
      features: [
        t("pricing.start.feature.1"),
        t("pricing.start.feature.2"),
        t("pricing.start.feature.3"),
        t("pricing.start.feature.4"),
        t("pricing.start.feature.5"),
      ],
      cta: t("pricing.start.cta"),
      highlighted: true,
    },
    {
      name: t("pricing.business.name"),
      slug: "business",
      price: "349 000",
      unit: t("pricing.unit"),
      features: [
        t("pricing.business.feature.1"),
        t("pricing.business.feature.2"),
        t("pricing.business.feature.3"),
        t("pricing.business.feature.4"),
        t("pricing.business.feature.5"),
      ],
      cta: t("pricing.business.cta"),
      highlighted: false,
    },
  ];

  const FAQ = [
    { q: t("landing.faq.q1"), a: t("landing.faq.a1") },
    { q: t("landing.faq.q2"), a: t("landing.faq.a2") },
    { q: t("landing.faq.q3"), a: t("landing.faq.a3") },
    { q: t("landing.faq.q4"), a: t("landing.faq.a4") },
  ];

  return (
    <div className={styles.landing}>
      {/* --- Navigatsiya --- */}
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <span className={styles.logoMark}>AI</span> Inbox Assistant
        </div>
        <div className={styles.navLinks}>
          <a href="#features">{t("landing.nav.features")}</a>
          <a href="#how">{t("landing.nav.how")}</a>
          <a href="#pricing">{t("landing.nav.pricing")}</a>
          <a href="#faq">{t("landing.nav.faq")}</a>
        </div>
        <div className={styles.navActions}>
          <LanguageSwitcher dropDirection="down" />
          <Link href="/login" className={styles.ghostButton}>
            {t("landing.nav.login")}
          </Link>
          <Magnetic strength={0.4}>
            <Link href="/signup" className={styles.primaryButton}>
              {t("landing.nav.signup")}
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
            {t("landing.hero.title1")}
            <br />
            <span className={styles.accent}>{t("landing.hero.title2")}</span>
          </h1>
          <p>{t("landing.hero.subtitle")}</p>
          <div className={styles.heroCtas}>
            <Magnetic strength={0.35}>
              <Link href="/signup" className={styles.primaryButtonLarge}>
                {t("landing.hero.ctaPrimary")}
              </Link>
            </Magnetic>
            <Magnetic strength={0.35}>
              <Link href="/inbox" className={styles.ghostButtonLarge}>
                {t("landing.hero.ctaSecondary")}
              </Link>
            </Magnetic>
          </div>
          <span className={styles.heroNote}>{t("landing.hero.note")}</span>
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
                  <strong>{t("landing.preview.customer1Name")}</strong>
                  <small>{t("landing.preview.customer1Msg")}</small>
                </div>
              </div>
              <div className={`${styles.previewRow} ${styles.previewRowActive}`}>
                <span className={`${styles.previewDot} ${styles.dotRed}`} />
                <div>
                  <strong>{t("landing.preview.customer2Name")}</strong>
                  <small>{t("landing.preview.customer2Msg")}</small>
                </div>
              </div>
              <div className={styles.previewRow}>
                <span className={`${styles.previewDot} ${styles.dotAmber}`} />
                <div>
                  <strong>{t("landing.preview.customer3Name")}</strong>
                  <small>{t("landing.preview.customer3Msg")}</small>
                </div>
              </div>
            </div>
            <div className={styles.previewPanel}>
              <div className={styles.previewBadges}>
                <span>{t("landing.preview.sentimentNegative")}</span>
                <span>{t("landing.preview.complaint")}</span>
              </div>
              <div className={styles.previewBubble}>{t("landing.preview.bubble")}</div>
              <div className={styles.previewSuggestion}>
                {t("landing.preview.suggestion")}
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </header>

      {/* --- Kimlar uchun (soha ko'rgazmasi) --- */}
      <section className={styles.audience}>
        <ScrollReveal>
          <h2>{t("landing.audience.title")}</h2>
        </ScrollReveal>
        <ScrollReveal delay={0.05}>
          <IndustryShowcase items={INDUSTRIES} />
        </ScrollReveal>
      </section>

      {/* --- Kanallar (orbit diagramma) --- */}
      <section className={styles.channels}>
        <ScrollReveal>
          <h2>{t("landing.channels.title")}</h2>
        </ScrollReveal>
        <ScrollReveal delay={0.08}>
          <OrbitDiagram centerIcon="💬" items={CHANNELS} />
        </ScrollReveal>
      </section>

      {/* --- Xususiyatlar --- */}
      <section id="features" className={styles.features}>
        <ScrollReveal>
          <h2>{t("landing.features.title")}</h2>
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
          <h2>{t("landing.how.title")}</h2>
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
          <h2>{t("landing.pricing.title")}</h2>
        </ScrollReveal>
        <ScrollReveal delay={0.05}>
          <p className={styles.pricingNote}>{t("landing.pricing.note")}</p>
        </ScrollReveal>
        <div className={styles.planGrid}>
          {PLANS.map((plan, i) => (
            <ScrollReveal key={plan.name} delay={i * 0.1}>
              <TiltCard
                className={`${styles.plan} ${plan.highlighted ? styles.planHighlighted : ""}`}
                maxTilt={6}
              >
                {plan.highlighted && (
                  <span className={styles.planBadge}>{t("pricing.badge")}</span>
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
                    href={
                      plan.slug === "free" ? "/inbox" : `/checkout?plan=${plan.slug}`
                    }
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
          <h2>{t("landing.faq.title")}</h2>
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
          <h2>{t("landing.finalCta.title")}</h2>
          <p>{t("landing.finalCta.text")}</p>
          <Magnetic strength={0.35}>
            <Link href="/signup" className={styles.primaryButtonLarge}>
              {t("landing.hero.ctaPrimary")}
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
            <p>{t("landing.footer.tagline")}</p>
          </div>
          <div className={styles.footerColumn}>
            <strong>{t("landing.footer.product")}</strong>
            <a href="#features">{t("landing.nav.features")}</a>
            <a href="#pricing">{t("landing.nav.pricing")}</a>
            <Link href="/inbox">{t("landing.footer.liveDemo")}</Link>
          </div>
          <div className={styles.footerColumn}>
            <strong>{t("landing.footer.account")}</strong>
            <Link href="/signup">{t("landing.footer.signup")}</Link>
            <Link href="/login">{t("landing.nav.login")}</Link>
            <Link href="/reset">{t("landing.footer.resetPassword")}</Link>
          </div>
        </div>
        <div className={styles.footerBottom}>
          © {new Date().getFullYear()} AI Inbox Assistant — {t("landing.footer.rights")}
        </div>
      </footer>
    </div>
  );
}
