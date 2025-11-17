
import React from 'react';
import { useTranslation } from 'react-i18next';
import { emotions } from '../data/emotions';

const EmotionStats = ({ entries, currentMonth }) => {
  const { t } = useTranslation();

  const getEmotionCounts = () => {
    const monthEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate.getFullYear() === currentMonth.getFullYear() &&
             entryDate.getMonth() === currentMonth.getMonth();
    });

    const counts = {};
    for (const emotion of emotions) {
      counts[emotion.id] = 0;
    }

    for (const entry of monthEntries) {
      if (counts[entry.emotion] !== undefined) {
        counts[entry.emotion]++;
      }
    }

    return counts;
  };

  const emotionCounts = getEmotionCounts();
  const totalEntries = Object.values(emotionCounts).reduce((sum, count) => sum + count, 0);

  if (totalEntries === 0) {
    return null; // Don't render anything if there are no entries for the month
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 mt-6">
      <h3 className="text-lg font-bold text-gray-700 mb-4">{t('monthly_summary')}</h3>
      <div className="space-y-2">
        {emotions.map(emotion => {
          const count = emotionCounts[emotion.id];
          if (count === 0) return null;
          const percentage = totalEntries > 0 ? (count / totalEntries) * 100 : 0;
          return (
            <div key={emotion.id} className="flex items-center">
              <div className="w-2/6 text-sm text-gray-600">{t(emotion.id)}</div>
              <div className="w-4/6 bg-gray-200 rounded-full h-4">
                <div
                  className="h-4 rounded-full"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: emotion.graphColor,
                  }}
                ></div>
              </div>
              <div className="w-1/6 text-right text-gray-600">{count}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmotionStats;
