// Yangi xabar kelganda qisqa "ding" ovozi.
// Audio fayl kerak emas — Web Audio API bilan tovushni o'zimiz hosil qilamiz.
// Eslatma: brauzerlar foydalanuvchi sahifa bilan hech bo'lmasa bir marta
// muloqot qilmaguncha (klik/klaviatura) ovozga ruxsat bermaydi — shu holatda
// jimgina hech narsa qilmaymiz.

let audioContext: AudioContext | null = null;

export function playNewMessageSound(): void {
  try {
    if (!audioContext) {
      audioContext = new AudioContext();
    }
    if (audioContext.state === "suspended") {
      void audioContext.resume();
    }

    const now = audioContext.currentTime;

    // Ikki nota ("ding-dong" effekti): E6 keyin A6
    for (const [offset, frequency] of [
      [0, 1318.5],
      [0.12, 1760],
    ] as const) {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      // Ovoz balandligi: tez ko'tarilib, sekin so'nadi (shovqinsiz, yumshoq)
      gain.gain.setValueAtTime(0, now + offset);
      gain.gain.linearRampToValueAtTime(0.08, now + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.35);
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start(now + offset);
      oscillator.stop(now + offset + 0.4);
    }
  } catch {
    // Ovoz chiqmasa ham ilova ishlashda davom etadi
  }
}
