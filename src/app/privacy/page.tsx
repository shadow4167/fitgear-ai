import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy – FitGear AI",
};

export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: "32px 20px", lineHeight: 1.6 }}>
      <h1>FitGear AI Privacy Policy</h1>
      <p>Last updated: October 29, 2026</p>

      <h2>The short version</h2>
      <p>
        FitGear AI does not ask for your name, email, or location. There are no accounts, no ads,
        and no tracking.
      </p>

      <h2>What gets sent to the AI</h2>
      <p>
        When you use Find My Gear or the chat coach, your answers (like skill level, position,
        budget, and the gear you want) and the messages you type are sent to Google&apos;s Gemini AI
        service so it can write a recommendation or reply. Please don&apos;t type personal information
        like your full name, address, or phone number into the chat. Google handles this data under
        its own privacy policy.
      </p>

      <h2>What stays on your device</h2>
      <p>
        Shootout game coins, the sticks you unlock, and whether you&apos;ve seen the game tutorial are
        saved only on your device. We never receive them.
      </p>

      <h2>Store links</h2>
      <p>
        Some products link to outside stores. If you tap one, you leave FitGear AI, and that
        store&apos;s own privacy policy applies.
      </p>

      <h2>Kids</h2>
      <p>
        FitGear AI is made for youth hockey players and their parents. We don&apos;t knowingly collect
        personal information from anyone, including children.
      </p>

      <h2>Changes</h2>
      <p>If this policy changes, we&apos;ll update this page and the date at the top.</p>
    </main>
  );
}
