/**
 * Web Speech API helper for authentic Spanish pronunciation.
 */

let synth: SpeechSynthesis | null = null;
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  synth = window.speechSynthesis;
}

export function speakSpanish(text: string, rate: number = 0.9): Promise<void> {
  return new Promise((resolve) => {
    if (!synth) {
      resolve();
      return;
    }

    try {
      synth.cancel(); // Stop any currently playing audio

      // Clean markdown or unwanted symbols
      const cleanText = text
        .replace(/[«»""''—–]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'es-ES';
      utterance.rate = rate; // slightly slower for language learners
      utterance.pitch = 1.0;

      // Find an es-ES or es voice if available
      const voices = synth.getVoices();
      const spanishVoice =
        voices.find((v) => v.lang.startsWith('es-ES')) ||
        voices.find((v) => v.lang.startsWith('es'));
      if (spanishVoice) {
        utterance.voice = spanishVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      synth.speak(utterance);
    } catch {
      resolve();
    }
  });
}

export function stopSpeaking(): void {
  if (synth) {
    synth.cancel();
  }
}
