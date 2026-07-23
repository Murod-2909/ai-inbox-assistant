import styles from "./SetupSteps.module.scss";

interface Step {
  icon: string;
  text: React.ReactNode;
}

// Har bir qadam uchun raqamli doira + amal turini bildiruvchi belgi +
// ulovchi chiziq — oddiy matnli ro'yxatdan ko'ra tezroq o'qiladi.
// Bu HAQIQIY skrinshot emas (Telegram/Facebook hisobingizga kira olmaymiz),
// balki sxematik ko'rsatma — shuning uchun soxta interfeys tasvirlanmagan.
export function SetupSteps({ steps }: { steps: Step[] }) {
  return (
    <ol className={styles.steps}>
      {steps.map((step, i) => (
        <li key={i} className={styles.step}>
          <span className={styles.stepNum}>{i + 1}</span>
          <span className={styles.stepIcon}>{step.icon}</span>
          <span className={styles.stepText}>{step.text}</span>
        </li>
      ))}
    </ol>
  );
}
