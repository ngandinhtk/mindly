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
