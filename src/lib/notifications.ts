// Brauzer bildirishnomalari (Web Notifications API) — yangi mijoz xabari
// kelganda, tab fokusda bo'lmasa, foydalanuvchiga signal beradi.

export function isNotificationSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export function getNotificationPermission(): NotificationPermission | "unsupported" {
  if (!isNotificationSupported()) return "unsupported";
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) return "denied";
  return Notification.requestPermission();
}

export function showMessageNotification(
  title: string,
  body: string,
  onClick?: () => void,
): void {
  if (!isNotificationSupported()) return;
  if (Notification.permission !== "granted") return;
  // Tab ochiq va fokusda bo'lsa — ekrandagi flash/tovush yetarli, bildirishnoma shart emas
  if (document.visibilityState === "visible" && document.hasFocus()) return;

  const notification = new Notification(title, {
    body,
    icon: "/favicon.ico",
    tag: "ai-inbox-message",
  });
  if (onClick) {
    notification.onclick = () => {
      window.focus();
      onClick();
      notification.close();
    };
  }
}
