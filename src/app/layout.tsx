import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { StripeProvider } from "@/components/StripeProvider";
import { CustomCursor } from "@/components/cursor/CustomCursor";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import "./globals.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Inbox Assistant",
  description:
    "Kichik bizneslar uchun mijozlar xabarlarini bitta joyga yig'ib, AI yordamida tahlil qiluvchi tizim",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uz"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Saqlangan temani birinchi chizishdan oldin qo'llash — flash bo'lmasligi uchun */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("theme");if(t)document.documentElement.dataset.theme=t}catch(e){}`,
          }}
        />
      </head>
      <body>
        <CustomCursor />
        <LanguageProvider>
          <StripeProvider>{children}</StripeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
