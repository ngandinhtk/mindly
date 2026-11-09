import { getMonthlyMoodSummary } from './moodStats';
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
