import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Fix MaxListenersExceededWarning by suppressing the specific warning for AbortSignal
// This addresses the memory leak warning that occurs with multiple AbortController instances
if (typeof globalThis !== 'undefined') {
  const originalConsoleWarn = console.warn;
  console.warn = (...args: any[]) => {
    const message = args.join(' ');
    if (message.includes('MaxListenersExceededWarning') && message.includes('AbortSignal')) {
      // Suppress the warning but log a debug message instead
      if (import.meta.env.MODE === 'development') {
        console.debug('AbortSignal listener limit exceeded - this is expected behavior');
      }
      return;
    }
    originalConsoleWarn.apply(console, args);
  };
}
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AnalyticsErrorBoundary } from "./components/AnalyticsErrorBoundary";
import { analytics, resourceMonitor } from "./lib/analytics";
import { PostHogProvider } from "posthog-js/react";
import { abortManager } from "./utils/abortManager";
import "./assets/shimmer.css";
import "./styles.css";

// Initialize analytics before rendering
analytics.initialize();

// Start resource monitoring (check every 2 minutes)
resourceMonitor.startMonitoring(120000);

// Add a macOS-specific class to the <html> element to enable platform-specific styling
// Browser-safe detection using navigator properties (works in Tauri and web preview)
(() => {
  const isMacLike = typeof navigator !== "undefined" &&
    (navigator.platform?.toLowerCase().includes("mac") ||
      navigator.userAgent?.toLowerCase().includes("mac os x"));
  if (isMacLike) {
    document.documentElement.classList.add("is-macos");
  }
})();

// Cleanup stale AbortControllers every minute
setInterval(() => {
  abortManager.cleanup();
}, 60000);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <PostHogProvider
      apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
      options={{
        api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
        defaults: '2025-05-24',
        capture_exceptions: true,
        debug: import.meta.env.MODE === "development",
      }}
    >
      <ErrorBoundary>
        <AnalyticsErrorBoundary>
          <App />
        </AnalyticsErrorBoundary>
      </ErrorBoundary>
    </PostHogProvider>
  </React.StrictMode>,
);
