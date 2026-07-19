import Sidebar from "@/components/Sidebar";
import styles from "./layout.module.scss";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <main className={styles.content}>{children}</main>
    </div>
  );
}
