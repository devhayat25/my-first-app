"use client";

import posthog from "posthog-js";

if (typeof window !== "undefined" && !(posthog as any).__initialized) {
  posthog.init("phc_FJTnZMCwdX3rbpGTtJzVTLnI208Dlpxz57Bp4Unq6kt", {
    api_host: "https://app.posthog.com",
    autocapture: true,
  });
  (posthog as any).__initialized = true;
}

export default posthog;
