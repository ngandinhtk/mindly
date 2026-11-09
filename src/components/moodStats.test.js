import { getEmotionSentiment, getMonthlyMoodSummary, getMoodTrend, getWeekBounds, readMoodEntries } from './moodStats';
test('counts distinct local days and excludes other months and years', () => {
  const summary = getMonthlyMoodSummary([
    { date: '2026-10-01T08:00:00', emotion: 'happy' },
    { date: '2026-10-01T18:00:00', emotion: 'happy' },
    { date: '2026-10-02T08:00:00', emotion: 'sad' },
    { date: '2026-09-30T08:00:00', emotion: 'sad' },
    { date: '2025-10-01T08:00:00', emotion: 'sad' },
    { date: '2026-11-01T08:00:00', emotion: 'sad' },
  ], new Date(2026, 9, 15));
  expect(summary).toEqual({ recordedDays: 2, mostCommonEmotion: 'happy' });
});
test('handles an empty month', () => {
  expect(getMonthlyMoodSummary([], new Date(2026, 9, 15))).toEqual({ recordedDays: 0, mostCommonEmotion: null });
});
test('gets complete local week boundaries', () => {
  const { startOfWeek, endOfWeek } = getWeekBounds(new Date(2026, 9, 17, 22, 30));
  expect(startOfWeek).toEqual(new Date(2026, 9, 11, 0, 0, 0, 0));
  expect(endOfWeek).toEqual(new Date(2026, 9, 17, 23, 59, 59, 999));
});
test('classifies existing emotion IDs and compares recent periods', () => {
  expect(['happy', 'amazing', 'love', 'satisfied', 'excited'].map(getEmotionSentiment))
    .toEqual(['positive', 'positive', 'positive', 'positive', 'positive']);
  expect(['sad', 'worried', 'angry'].map(getEmotionSentiment))
    .toEqual(['negative', 'negative', 'negative']);
  const now = new Date(2026, 9, 15, 12);
  expect(getMoodTrend([
    { date: new Date(2026, 9, 2), emotion: 'sad' },
    { date: new Date(2026, 9, 15), emotion: 'love' },
  ], now)).toBe('positive_trend');
  expect(getMoodTrend([{ date: new Date(2026, 9, 15), emotion: 'happy' }], now))
    .toBe('no_data_trend');
});
test('reports invalid saved check-ins', () => {
  localStorage.setItem('moodEntries_alice', '{invalid');
  expect(readMoodEntries('alice')).toEqual({ entries: [], error: true });

  localStorage.setItem('moodEntries_alice', JSON.stringify([{ date: 'not-a-date', emotion: 'happy' }]));
  expect(readMoodEntries('alice')).toEqual({ entries: [], error: true });
});
