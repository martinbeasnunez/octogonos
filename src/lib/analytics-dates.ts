export type AnalyticsPeriod = 'today' | 'yesterday' | 'week' | 'all';

export interface DateRange {
  start: Date;
  end: Date;
  label: string;
  comparisonLabel: string;
}

/**
 * Returns { start, end } for the given period (Peru timezone: UTC-5).
 */
export function getDateRange(period: AnalyticsPeriod): DateRange {
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  switch (period) {
    case 'today':
      return {
        start: startOfToday,
        end: now,
        label: 'Hoy',
        comparisonLabel: 'vs ayer',
      };
    case 'yesterday': {
      const startOfYesterday = new Date(startOfToday);
      startOfYesterday.setDate(startOfYesterday.getDate() - 1);
      return {
        start: startOfYesterday,
        end: startOfToday,
        label: 'Ayer',
        comparisonLabel: 'vs día anterior',
      };
    }
    case 'week': {
      const weekAgo = new Date(startOfToday);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return {
        start: weekAgo,
        end: now,
        label: 'Última semana',
        comparisonLabel: 'vs semana anterior',
      };
    }
    case 'all':
    default:
      return {
        start: new Date(0),
        end: now,
        label: 'Total',
        comparisonLabel: '',
      };
  }
}

/**
 * Returns the comparison period (same length, immediately prior).
 */
export function getComparisonRange(period: AnalyticsPeriod): DateRange | null {
  if (period === 'all') return null;

  const { start, end } = getDateRange(period);
  const duration = end.getTime() - start.getTime();
  return {
    start: new Date(start.getTime() - duration),
    end: start,
    label: '',
    comparisonLabel: '',
  };
}

/**
 * Returns an array of { date, label } for the last 7 days.
 */
export function getLast7Days(): Array<{ date: string; label: string }> {
  const days: Array<{ date: string; label: string }> = [];
  const now = new Date();
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    days.push({
      date: dateStr,
      label: i === 0 ? 'Hoy' : i === 1 ? 'Ayer' : dayNames[d.getDay()],
    });
  }
  return days;
}
