import { readJson } from '../utils/safeStorage';

export function getMonthlyMoodSummary(entries, now = new Date()) {
  const monthEntries = entries.filter(entry => {
    const date = new Date(entry.date);
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  });
  const recordedDays = new Set(monthEntries.map(entry => new Date(entry.date).toDateString())).size;
  const counts = monthEntries.reduce((result, entry) => {
    result[entry.emotion] = (result[entry.emotion] || 0) + 1;
    return result;
  }, {});
  const mostCommonEmotion = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0] || null;
  return { recordedDays, mostCommonEmotion };
}

export function readMoodEntries(username) {
  if (!username) return { entries: [], error: false };

  const key = `moodEntries_${username}`;
  let hasStoredValue;
  try {
    hasStoredValue = localStorage.getItem(key) !== null;
  } catch (error) {
    return { entries: [], error: true };
  }

  const entries = readJson(key, null);
  if (entries === null && !hasStoredValue) return { entries: [], error: false };
  if (!Array.isArray(entries) || entries.some(entry => (
    !entry ||
    typeof entry.emotion !== 'string' ||
    !Number.isFinite(new Date(entry.date).getTime())
  ))) {
    return { entries: [], error: true };
  }

  return { entries, error: false };
}

export function getWeekBounds(now = new Date()) {
  const startOfWeek = new Date(now);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(now.getDate() - now.getDay());

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  return { startOfWeek, endOfWeek };
}

const positiveEmotions = new Set(['happy', 'amazing', 'love', 'satisfied', 'excited']);
const negativeEmotions = new Set(['sad', 'worried', 'angry']);

export function getEmotionSentiment(emotionId) {
  if (positiveEmotions.has(emotionId)) return 'positive';
  if (negativeEmotions.has(emotionId)) return 'negative';
  if (emotionId === 'neutral' || emotionId === 'tired') return 'neutral';
  return null;
}

export function getMoodTrend(entries, now = new Date()) {
  const recentEnd = new Date(now);
  recentEnd.setHours(23, 59, 59, 999);
  const recentStart = new Date(recentEnd);
  recentStart.setDate(recentStart.getDate() - 6);
  recentStart.setHours(0, 0, 0, 0);

  const previousEnd = new Date(recentStart.getTime() - 1);
  const previousStart = new Date(recentStart);
  previousStart.setDate(previousStart.getDate() - 7);

  const averageSentiment = periodEntries => {
    const scores = periodEntries
      .map(entry => {
        const sentiment = getEmotionSentiment(entry.emotion);
        if (sentiment === 'positive') return 1;
        if (sentiment === 'negative') return -1;
        if (sentiment === 'neutral') return 0;
        return null;
      })
      .filter(score => score !== null);

    return scores.length ? scores.reduce((sum, score) => sum + score, 0) / scores.length : null;
  };

  const recentScore = averageSentiment(entries.filter(entry => {
    const date = new Date(entry.date);
    return date >= recentStart && date <= recentEnd;
  }));
  const previousScore = averageSentiment(entries.filter(entry => {
    const date = new Date(entry.date);
    return date >= previousStart && date <= previousEnd;
  }));

  if (recentScore === null || previousScore === null) return 'no_data_trend';
  const change = recentScore - previousScore;
  if (change > 0.25) return 'positive_trend';
  if (change < -0.25) return 'negative_trend';
  return 'stable_trend';
}
