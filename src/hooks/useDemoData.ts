import { useMemo } from 'react';
import { generateMockOverviewData } from '@/utils/mockData';

export const useDemoMode = () => {
  return useMemo(() => {
    return localStorage.getItem('demo_mode') === 'true';
  }, []);
};

export const useMockData = (role: string) => {
  const isDemoMode = useDemoMode();
  
  return useMemo(() => {
    if (!isDemoMode) return null;
    return generateMockOverviewData(role);
  }, [isDemoMode, role]);
};
