"use client";

import { useMetricsTracker } from "./use-metrics";

export function FeatureTrackerClient() {
  const { trackCustomEvent } = useMetricsTracker();

  const handleFeatureUsage = () => {
    trackCustomEvent("feature_used", { feature: "example_feature" });
  };

  return (
    <>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleFeatureUsage}
      >
        Track Feature Usage
      </button>
    </>
  );
}
