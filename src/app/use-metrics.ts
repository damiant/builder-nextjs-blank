"use client";

import { useCallback } from 'react';
import { useMetrics } from './metrics-context';

export function useMetricsTracker() {
  const { trackEvent } = useMetrics();

  const trackPageView = useCallback((page?: string) => {
    trackEvent('page_view', { 
      page: page || (typeof window !== 'undefined' ? window.location.pathname : 'unknown') 
    });
  }, [trackEvent]);

  const trackClick = useCallback((element: string, data?: Record<string, any>) => {
    trackEvent('click', { element, ...data });
  }, [trackEvent]);

  const trackFormSubmit = useCallback((formName: string, data?: Record<string, any>) => {
    trackEvent('form_submit', { formName, ...data });
  }, [trackEvent]);

  const trackCustomEvent = useCallback((eventName: string, data?: Record<string, any>) => {
    trackEvent(eventName, data);
  }, [trackEvent]);

  return {
    trackPageView,
    trackClick,
    trackFormSubmit,
    trackCustomEvent,
  };
}
