"use client";

import { useEffect } from "react";
import Link from "next/link";
import styles from "./success.module.scss";

export default function SuccessPage() {
  useEffect(() => {
    // Success analytics yuboring (optional)
    console.log("To'lov muvaffaqiyatli bo'ldi");
  }, []);

  return (
    <div className={styles.successPage}>
      <div className={styles.container}>
        <div className={styles.icon}>✓</div>
        <h1>To'lov Muvaffaqiyatli!</h1>
        <p>Raxmat! Sizning obunangiz faollashtirildi.</p>

        <div className={styles.details}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div>
              <strong>Akkauntingiz tayyorlandı</strong>
              <p>Barcha xususiyatlar o'rnatildi va ishlatish uchun tayyor.</p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div>
              <strong>Telegram botini ulang</strong>
              <p>
                Sozlamalarda @BotFather'dan olingan tokenni kiriting — ishga
                tushirish uchun 1 daqiqa kifoya.
              </p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div>
              <strong>Xabarlar oqib keladi</strong>
              <p>
                Barcha mijoz xabarlari darhol inbox'ingizga tushadi. AI tahlil
                avtomatik ishlaydi.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <Link href="/inbox" className={styles.primaryButton}>
            Inbox'ga o'tish
          </Link>
          <Link href="/settings" className={styles.secondaryButton}>
            Sozlamalar
          </Link>
        </div>

        <p className={styles.support}>
          Biror savolingiz bo'lsa,{" "}
          <a href="mailto:support@example.com">support@example.com</a> ga
          yozing.
        </p>
      </div>
    </div>
  );
}
