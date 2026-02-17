"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useMetricsTracker } from './use-metrics';

export function PageViewTracker() {
  const pathname = usePathname();
  const { trackPageView } = useMetricsTracker();

  useEffect(() => {
    if (pathname) {
      trackPageView(pathname);
    }
  }, [pathname, trackPageView]);

  return null;
}
