"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import styles from "./checkout.module.scss";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
);

type Plan = "free" | "start" | "business";

function isPlan(value: string | null): value is Plan {
  return value === "free" || value === "start" || value === "business";
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const requestedPlan = searchParams.get("plan");
  const [selectedPlan, setSelectedPlan] = useState<Plan>(
    isPlan(requestedPlan) ? requestedPlan : "start",
  );
  const [showCheckout, setShowCheckout] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>("");

  const PLANS: Record<
    Plan,
    { title: string; price: number; description: string; features: string[] }
  > = {
    free: {
      title: t("pricing.free.name"),
      price: 0,
      description: t("pricing.free.description"),
      features: [
        t("pricing.free.feature.1"),
        t("pricing.free.feature.2"),
        t("pricing.free.feature.3"),
        t("pricing.free.feature.4"),
      ],
    },
    start: {
      title: t("pricing.start.name"),
      price: 149000,
      description: t("pricing.start.description"),
      features: [
        t("pricing.start.feature.1"),
        t("pricing.start.feature.2"),
        t("pricing.start.feature.3"),
        t("pricing.start.feature.4"),
        t("pricing.start.feature.5"),
      ],
    },
    business: {
      title: t("pricing.business.name"),
      price: 349000,
      description: t("pricing.business.description"),
      features: [
        t("pricing.business.feature.1"),
        t("pricing.business.feature.2"),
        t("pricing.business.feature.3"),
        t("pricing.business.feature.4"),
        t("pricing.business.feature.5"),
      ],
    },
  };

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
          <h1>{t("checkout.title")}</h1>
          <p>{t("checkout.subtitle")}</p>

          <div className={styles.planGrid}>
            {(Object.entries(PLANS) as [Plan, (typeof PLANS)[Plan]][]).map(
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
                        ? t("checkout.free")
                        : t("checkout.priceLabel", {
                            amount: (planData.price / 1000).toFixed(0),
                          })}
                    </span>
                    {planData.price > 0 && (
                      <span className={styles.period}>{t("checkout.periodMonth")}</span>
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
                    {planKey === "free" ? t("checkout.selectFree") : t("checkout.selectOther")}
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
            ← {t("common.back")}
          </button>

          <div className={styles.checkoutInfo}>
            <h2>{t("checkout.planHeading", { plan: plan.title })}</h2>
            <p className={styles.amount}>
              {t("checkout.priceLabelMonthly", { amount: (plan.price / 1000).toFixed(0) })}
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
