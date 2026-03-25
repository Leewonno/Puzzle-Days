let ctx: AudioContext | null = null;

function getContext(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

export async function playFanfare() {
  const audioCtx = getContext();
  if (audioCtx.state === "suspended") await audioCtx.resume();

  // C5 E5 G5 C6 E6 — 빠른 아르페지오 후 화음 유지
  const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];

  notes.forEach((freq, i) => {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = i < 3 ? "triangle" : "sine";
    oscillator.frequency.value = freq;

    const start = audioCtx.currentTime + i * 0.08;
    const hold = start + 0.05;
    const end = start + 1.2 - i * 0.1;

    gainNode.gain.setValueAtTime(0, start);
    gainNode.gain.linearRampToValueAtTime(0.25, hold);
    gainNode.gain.exponentialRampToValueAtTime(0.001, end);

    oscillator.start(start);
    oscillator.stop(end);
  });
}

export async function playSuccessSound() {
  const audioCtx = getContext();

  // iOS에서 suspended 상태일 경우 resume
  if (audioCtx.state === "suspended") {
    await audioCtx.resume();
  }

  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5

  notes.forEach((freq, i) => {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = "sine";
    oscillator.frequency.value = freq;

    const start = audioCtx.currentTime + i * 0.1;
    const end = start + 0.3;

    gainNode.gain.setValueAtTime(0, start);
    gainNode.gain.linearRampToValueAtTime(0.3, start + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, end);

    oscillator.start(start);
    oscillator.stop(end);
  });
}
