"use client";

import { useEffect } from "react";
import posthog from "../lib/posthog"; // relative path to lib/posthog

export default function PostHogProvider() {
  useEffect(() => {
    posthog.capture("$pageview"); // track initial page view
  }, []);

  return null; // no UI, just initialization
}
