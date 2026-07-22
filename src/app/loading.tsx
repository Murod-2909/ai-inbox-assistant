import styles from "./loading.module.scss";

// Next.js App Router: sahifalar/marshrutlar orasida avtomatik ko'rsatiladi
// (Suspense chegarasi). Tezkor va yengil bo'lishi uchun faqat CSS
// animatsiyasi ishlatiladi — JS kutish shart emas.
export default function Loading() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.spinner}>
        <div className={styles.mark}>AI</div>
        <div className={styles.ring} />
      </div>
      <p>Yuklanmoqda...</p>
    </div>
  );
}
