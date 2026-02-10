"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface MetricEvent {
  id: string;
  type: string;
  timestamp: number;
  data: Record<string, any>;
  page?: string;
}

interface MetricsContextType {
  metrics: MetricEvent[];
  trackEvent: (type: string, data?: Record<string, any>) => void;
  exportMetrics: (format: 'json' | 'csv') => string;
  clearMetrics: () => void;
}

const MetricsContext = createContext<MetricsContextType | null>(null);

export function MetricsProvider({ children }: { children: React.ReactNode }) {
  const [metrics, setMetrics] = useState<MetricEvent[]>([]);

  // Load metrics from localStorage on mount
  useEffect(() => {
    const savedMetrics = localStorage.getItem('app_metrics');
    if (savedMetrics) {
      try {
        setMetrics(JSON.parse(savedMetrics));
      } catch (e) {
        console.error('Failed to parse saved metrics', e);
      }
    }
  }, []);

  // Save metrics to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('app_metrics', JSON.stringify(metrics));
  }, [metrics]);

  const trackEvent = useCallback((type: string, data: Record<string, any> = {}) => {
    const event: MetricEvent = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      timestamp: Date.now(),
      data,
      page: typeof window !== 'undefined' ? window.location.pathname : undefined,
    };
    
    setMetrics(prev => [...prev, event]);
  }, []);

  const exportMetrics = useCallback((format: 'json' | 'csv'): string => {
    if (format === 'json') {
      return JSON.stringify(metrics, null, 2);
    } else if (format === 'csv') {
      if (metrics.length === 0) return '';
      
      // Create CSV header from all possible keys
      const allKeys = new Set<string>(['id', 'type', 'timestamp', 'page']);
      metrics.forEach(metric => {
        Object.keys(metric.data).forEach(key => allKeys.add(`data.${key}`));
      });
      
      const headers = Array.from(allKeys).join(',');
      
      const rows = metrics.map(metric => {
        const row: string[] = [];
        allKeys.forEach(key => {
          if (key.startsWith('data.')) {
            const dataKey = key.substring(5);
            row.push(`"${String(metric.data[dataKey] ?? '')}"`);
          } else {
            row.push(`"${String((metric as any)[key] ?? '')}"`);
          }
        });
        return row.join(',');
      });
      
      return [headers, ...rows].join('\n');
    }
    
    return '';
  }, [metrics]);

  const clearMetrics = useCallback(() => {
    setMetrics([]);
    localStorage.removeItem('app_metrics');
  }, []);

  return (
    <MetricsContext.Provider value={{ metrics, trackEvent, exportMetrics, clearMetrics }}>
      {children}
    </MetricsContext.Provider>
  );
}

export function useMetrics() {
  const context = useContext(MetricsContext);
  if (!context) {
    throw new Error('useMetrics must be used within a MetricsProvider');
  }
  return context;
}
