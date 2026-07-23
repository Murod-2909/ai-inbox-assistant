// Kanal brendlarining rasmiy logolari (SVG) — emoji o'rniga.
// Har biri o'z rasmiy rangida, kvadrat proporsiyada (className bilan o'lcham beriladi).

interface IconProps {
  className?: string;
}

export function TelegramIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      <circle cx="120" cy="120" r="120" fill="#29A9EB" />
      <path
        fill="#fff"
        d="M53.6 118.2c46.3-20.2 77.2-33.5 92.6-40 44.1-18.3 53.3-21.5 59.2-21.6 1.3 0 4.3.3 6.2 1.9 1.6 1.3 2.1 3.1 2.3 4.4.2 1.3.5 4.1.3 6.4-2.5 26.5-13.4 90.8-19 120.4-2.3 12.5-7 16.8-11.4 17.2-9.7.9-17.1-6.4-26.5-12.6-14.7-9.7-23.1-15.7-37.4-25.1-16.5-10.9-5.8-16.9 3.6-26.7 2.5-2.6 45.3-41.5 46.1-45 .1-.4.2-2.1-.8-3-.9-.9-2.3-.6-3.3-.3-1.4.3-24 15.3-67.7 44.9-6.4 4.4-12.3 6.6-17.5 6.5-5.8-.1-16.9-3.3-25.2-6-10.1-3.3-18.2-5.1-17.5-10.8.4-2.9 4.4-5.9 12.1-8.9z"
      />
    </svg>
  );
}

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      <circle cx="120" cy="120" r="120" fill="#1877F2" />
      <path
        fill="#fff"
        d="M162.5 155.5l5.5-35.5h-34v-23c0-9.7 4.8-19.2 20-19.2h15.5V47.5S155.5 45 141.7 45c-28.8 0-47.7 17.5-47.7 49.1v27.4H62.7v35.5H94v85.9c6.3 1 12.7 1.5 19.3 1.5s13-.5 19.3-1.5v-85.9h29.9z"
      />
    </svg>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="ig-gradient" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#FFDD55" />
          <stop offset="10%" stopColor="#FFDD55" />
          <stop offset="50%" stopColor="#FF543E" />
          <stop offset="100%" stopColor="#C837AB" />
        </radialGradient>
      </defs>
      <rect width="240" height="240" rx="60" fill="url(#ig-gradient)" />
      <rect x="62" y="62" width="116" height="116" rx="32" fill="none" stroke="#fff" strokeWidth="12" />
      <circle cx="120" cy="120" r="32" fill="none" stroke="#fff" strokeWidth="12" />
      <circle cx="164" cy="76" r="8" fill="#fff" />
    </svg>
  );
}

export function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      <circle cx="120" cy="120" r="120" fill="#25D366" />
      <path
        fill="#fff"
        d="M120 52c-37.6 0-68 30.4-68 68 0 12 3.1 23.6 9.1 33.8L52 188l35.1-9.2c9.8 5.4 20.9 8.2 32.9 8.2 37.6 0 68-30.4 68-68s-30.4-68-68-68zm0 124.4c-10.6 0-20.9-2.9-29.9-8.3l-2.1-1.3-22.2 5.8 5.9-21.6-1.4-2.2c-5.9-9.3-9-20-9-31.1 0-32.2 26.2-58.5 58.6-58.5s58.6 26.2 58.6 58.5-26.3 58.7-58.5 58.7z"
      />
      <path
        fill="#fff"
        d="M100.5 92.9c-1.2-2.7-2.5-2.8-3.7-2.8-.9 0-2 0-3 0-1.1 0-2.8.4-4.3 2-1.5 1.6-5.6 5.5-5.6 13.3s5.8 15.4 6.6 16.5c.8 1.1 11.3 18 27.9 24.6 13.8 5.5 16.6 4.4 19.6 4.1 3-.3 9.6-3.9 11-7.7 1.4-3.8 1.4-7 1-7.7-.4-.7-1.5-1.1-3.1-1.9-1.6-.8-9.6-4.7-11.1-5.3-1.5-.5-2.6-.8-3.6.8-1.1 1.6-4.2 5.3-5.1 6.4-.9 1.1-1.9 1.2-3.5.4-1.6-.8-6.7-2.5-12.8-7.9-4.7-4.2-7.9-9.4-8.8-11-.9-1.6-.1-2.5.7-3.3.7-.7 1.6-1.9 2.4-2.8.8-.9 1.1-1.6 1.6-2.7.5-1.1.3-2.1-.1-2.9-.4-.8-3.5-8.9-5.1-12.1z"
      />
    </svg>
  );
}
