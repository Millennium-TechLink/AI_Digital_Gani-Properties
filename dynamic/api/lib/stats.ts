import { supabase } from './supabase.js';

export interface SiteStats {
  totalVisits: number;
  totalLeads: number;
  dailyHits: Record<string, number>;
}

export const DEFAULT_STATS: SiteStats = {
  totalVisits: 0,
  totalLeads: 0,
  dailyHits: {},
};

// Single-row table, keyed by a fixed id - there is only ever one stats
// record. Same pattern as lib/settings.ts's readSettings()/writeSettings()
// (Vercel functions have no persistent filesystem between invocations, so
// this can't be a JSON file on disk the way server.js's local dev copy is).
const STATS_ROW_ID = 'default';

export async function readStats(): Promise<SiteStats> {
  const { data, error } = await supabase
    .from('stats')
    .select('*')
    .eq('id', STATS_ROW_ID)
    .maybeSingle();

  if (error) {
    console.error('Error reading stats:', error);
    return DEFAULT_STATS;
  }
  if (!data) {
    return DEFAULT_STATS;
  }

  return {
    totalVisits: data.total_visits ?? DEFAULT_STATS.totalVisits,
    totalLeads: data.total_leads ?? DEFAULT_STATS.totalLeads,
    dailyHits: data.daily_hits ?? DEFAULT_STATS.dailyHits,
  };
}

async function writeStats(stats: SiteStats): Promise<void> {
  const row = {
    id: STATS_ROW_ID,
    total_visits: stats.totalVisits,
    total_leads: stats.totalLeads,
    daily_hits: stats.dailyHits,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from('stats').upsert(row);
  if (error) {
    console.error('Error writing stats:', error);
    throw error;
  }
}

export async function recordVisit(): Promise<void> {
  const stats = await readStats();
  const today = new Date().toISOString().split('T')[0];

  stats.totalVisits += 1;
  stats.dailyHits[today] = (stats.dailyHits[today] || 0) + 1;

  await writeStats(stats);
}

export async function incrementLeadCount(): Promise<void> {
  const stats = await readStats();
  stats.totalLeads += 1;
  await writeStats(stats);
}
