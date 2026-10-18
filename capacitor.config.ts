import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.shadow4167.fitgearai",
  appName: "FitGear AI",
  // Required by Capacitor even though the app loads the live site below.
  webDir: "public",
  server: {
    url: "https://fitgear-ai.vercel.app",
  },
};

export default config;
