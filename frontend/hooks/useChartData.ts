import { useState, useEffect } from 'react';
import { summaryApi } from '@/lib/api';
import { ChartData } from '@/types';

export const useChartData = () => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadChartData = async () => {
    try {
      setLoading(true);
      setError(null);
      const { chartData: data } = await summaryApi.getChartData();
  setChartData(data as unknown as ChartData);
    } catch (err) {
      console.error('Failed to load chart data:', err);
      setError('Failed to load chart data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChartData();
  }, []);

  return {
    chartData,
    loading,
    error,
    reload: loadChartData
  };
};
