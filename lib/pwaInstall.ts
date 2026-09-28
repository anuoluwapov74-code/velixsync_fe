"use client";

/**
 * Captures the browser's `beforeinstallprompt` event (Chrome/Edge on Android
 * and desktop) so we control when the install prompt appears, instead of
 * Chrome showing its own automatic mini-infobar. iOS Safari never fires this
 * event — there is no programmatic install API there, only the manual
 * "Add to Home Screen" steps shown in the install modal.
 *
 * Runs at module scope (not inside a React effect) so the listener attaches
 * as soon as this module loads on the client, before any component mounts.
 */

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
  });
  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
  });
}

/** Whether we can trigger the native Chrome/Edge install prompt right now. */
export function canPromptNatively(): boolean {
  return deferredPrompt !== null;
}

/** Fires the captured native install prompt. Resolves "unavailable" if none was captured (iOS, unsupported browser, or already installed). */
export async function triggerNativeInstall(): Promise<"accepted" | "dismissed" | "unavailable"> {
  if (!deferredPrompt) return "unavailable";
  const prompt = deferredPrompt;
  deferredPrompt = null;
  await prompt.prompt();
  const choice = await prompt.userChoice;
  return choice.outcome;
}
