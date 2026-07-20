"use client";

import Sidebar from "@/components/Sidebar";
import { ProtectedLayout } from "@/components/ProtectedLayout";
import styles from "./layout.module.scss";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedLayout>
      <div className={styles.shell}>
        <Sidebar />
        <main className={styles.content}>{children}</main>
      </div>
    </ProtectedLayout>
  );
}
