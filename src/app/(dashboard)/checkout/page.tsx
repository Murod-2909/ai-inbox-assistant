"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import styles from "./checkout.module.scss";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
);

type Plan = "free" | "start" | "business";

interface PlanDetails {
  title: string;
  price: number;
  description: string;
  features: string[];
  stripePriceId: string;
}

const PLANS: Record<Plan, PlanDetails> = {
  free: {
    title: "Bepul",
    price: 0,
    description: "Boshlash uchun yetarli",
    features: [
      "1 operator",
      "Telegram kanali",
      "Oyiga 100 AI tahlil",
      "Asosiy statistika",
    ],
    stripePriceId: "", // to'lovsiz
  },
  start: {
    title: "Start",
    price: 149000,
    description: "O'sib borayotgan bizneslar uchun",
    features: [
      "3 operator",
      "Media va ovozli xabarlar",
      "Cheksiz AI tahlil",
      "Javob shablonlari",
      "To'liq statistika",
    ],
    stripePriceId: "price_start_...", // Stripe dashboard'dan
  },
  business: {
    title: "Biznes",
    price: 349000,
    description: "Katta jamoa uchun",
    features: [
      "Cheksiz operator",
      "WhatsApp + Instagram (tez orada)",
      "CRM va eksport",
      "Avto-javoblar",
      "Ustuvor qo'llab-quvvatlash",
    ],
    stripePriceId: "price_business_...", // Stripe dashboard'dan
  },
};

export default function CheckoutPage() {
  const [selectedPlan, setSelectedPlan] = useState<Plan>("start");
  const [showCheckout, setShowCheckout] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>("");

  async function handleSelectPlan(plan: Plan) {
    if (plan === "free") {
      // Bepul plan — redirect to dashboard
      window.location.href = "/inbox";
      return;
    }

    setSelectedPlan(plan);
    // Backend'dan checkout session yaratish
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });

    const data = (await response.json()) as { clientSecret?: string };
    if (data.clientSecret) {
      setClientSecret(data.clientSecret);
      setShowCheckout(true);
    }
  }

  const plan = PLANS[selectedPlan];

  return (
    <div className={styles.checkoutPage}>
      {!showCheckout ? (
        <div className={styles.planSelector}>
          <h1>Tarif Tanlang</h1>
          <p>Sizning biznesingizga mos bo'lgan rejimni belgilang</p>

          <div className={styles.planGrid}>
            {(Object.entries(PLANS) as [Plan, PlanDetails][]).map(
              ([planKey, planData]) => (
                <div
                  key={planKey}
                  className={`${styles.planCard} ${
                    selectedPlan === planKey ? styles.selected : ""
                  }`}
                  onClick={() => setSelectedPlan(planKey)}
                >
                  <h2>{planData.title}</h2>
                  <div className={styles.price}>
                    <span className={styles.amount}>
                      {planData.price === 0
                        ? "Bepul"
                        : `${(planData.price / 1000).toFixed(0)}K so'm`}
                    </span>
                    {planData.price > 0 && (
                      <span className={styles.period}>/oy</span>
                    )}
                  </div>
                  <p className={styles.description}>{planData.description}</p>
                  <ul className={styles.features}>
                    {planData.features.map((feature) => (
                      <li key={feature}>✓ {feature}</li>
                    ))}
                  </ul>
                  <button
                    className={styles.selectButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPlan(planKey);
                    }}
                  >
                    {planKey === "free" ? "Boshlash" : "Tanlash"}
                  </button>
                </div>
              ),
            )}
          </div>
        </div>
      ) : (
        <div className={styles.checkoutContainer}>
          <button
            className={styles.backButton}
            onClick={() => setShowCheckout(false)}
          >
            ← Orqaga
          </button>

          <div className={styles.checkoutInfo}>
            <h2>{plan.title} Tarifi</h2>
            <p className={styles.amount}>
              {(plan.price / 1000).toFixed(0)}K so'm/oy
            </p>
          </div>

          {clientSecret && (
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{ clientSecret }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          )}
        </div>
      )}
    </div>
  );
}
