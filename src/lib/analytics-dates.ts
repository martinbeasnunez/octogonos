export type AnalyticsPeriod = 'today' | 'yesterday' | 'week' | 'all';

export interface DateRange {
  start: Date;
  end: Date;
  label: string;
  comparisonLabel: string;
}

const LIMA_TZ = 'America/Lima';

/**
 * Returns the current date/time in Lima as a Date object.
 */
function nowInLima(): Date {
  const limaStr = new Date().toLocaleString('en-US', { timeZone: LIMA_TZ });
  return new Date(limaStr);
}

/**
 * Returns start of day in Lima as a UTC Date (for Supabase queries).
 */
function startOfDayLima(date?: Date): Date {
  const lima = date ?? nowInLima();
  lima.setHours(0, 0, 0, 0);
  // Lima is UTC-5, so add 5 hours to get UTC equivalent
  return new Date(lima.getTime() + 5 * 60 * 60 * 1000);
}

/**
 * Returns { start, end } for the given period (Peru timezone: UTC-5).
 */
export function getDateRange(period: AnalyticsPeriod): DateRange {
  const nowLima = nowInLima();
  const todayStartUTC = startOfDayLima(new Date(nowLima));
  // "now" in UTC
  const nowUTC = new Date();

  switch (period) {
    case 'today':
      return {
        start: todayStartUTC,
        end: nowUTC,
        label: 'Hoy',
        comparisonLabel: 'vs ayer',
      };
    case 'yesterday': {
      const yesterdayStartUTC = new Date(todayStartUTC);
      yesterdayStartUTC.setDate(yesterdayStartUTC.getDate() - 1);
      return {
        start: yesterdayStartUTC,
        end: todayStartUTC,
        label: 'Ayer',
        comparisonLabel: 'vs día anterior',
      };
    }
    case 'week': {
      const weekAgoUTC = new Date(todayStartUTC);
      weekAgoUTC.setDate(weekAgoUTC.getDate() - 7);
      return {
        start: weekAgoUTC,
        end: nowUTC,
        label: 'Última semana',
        comparisonLabel: 'vs semana anterior',
      };
    }
    case 'all':
    default:
      return {
        start: new Date(0),
        end: nowUTC,
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
 * Returns an array of { date, label } for the last 7 days in Lima timezone.
 */
export function getLast7Days(): Array<{ date: string; label: string }> {
  const days: Array<{ date: string; label: string }> = [];
  const lima = nowInLima();
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(lima);
    d.setDate(d.getDate() - i);
    // Format as YYYY-MM-DD in Lima time
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    days.push({
      date: dateStr,
      label: i === 0 ? 'Hoy' : i === 1 ? 'Ayer' : dayNames[d.getDay()],
    });
  }
  return days;
}
