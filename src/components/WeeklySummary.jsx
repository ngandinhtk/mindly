import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { emotions } from '../data/emotions';

const WeeklySummary = () => {
  const { t } = useTranslation();
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [weekRange, setWeekRange] = useState('');

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (username) {
      const savedEntries = localStorage.getItem(`moodEntries_${username}`);
      if (savedEntries) {
        const parsedEntries = JSON.parse(savedEntries);
        calculateWeeklyStats(parsedEntries);
      }
    }
  }, []);

  const calculateWeeklyStats = (entries) => {
    if (!entries || entries.length === 0) {
      return;
    }

    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));

    setWeekRange(`${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`);

    const weeklyEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= startOfWeek && entryDate <= endOfWeek;
    });

    if (weeklyEntries.length === 0) {
      return;
    }

    const emotionCounts = weeklyEntries.reduce((acc, entry) => {
      acc[entry.emotion] = (acc[entry.emotion] || 0) + 1;
      return acc;
    }, {});

    const totalEntries = weeklyEntries.length;
    const stats = Object.entries(emotionCounts)
      .map(([emotionId, count]) => {
        const emotionDetails = emotions.find(e => e.id === emotionId);
        return {
          id: emotionId,
          count,
          percentage: Math.round((count / totalEntries) * 100),
          ...(emotionDetails || { label: 'Unknown', emoji: '❓', color: 'bg-gray-200' }),
        };
      })
      .sort((a, b) => b.count - a.count);

    setWeeklyStats(stats);
  };

  const getWeeklyTrend = () => {
    if (weeklyStats.length === 0) {
      return t('no_data_for_week');
    }
    const topEmotion = weeklyStats[0];

    if (['happy', 'excited', 'grateful', 'amazing', 'satisfies'].includes(topEmotion.id)) {
      return t('positive_week_trend');
    }
    if (['sad', 'angry', 'anxious', 'worried'].includes(topEmotion.id)) {
      return t('negative_week_trend');
    }
    return t('mixed_week_trend');
  };

  return (
    <div className=" p-6 mb-6 border-t">
      <h4 className="text-xl font-bold text-gray-800 mb-4">{t('weekly_summary')}</h4>
      <p className="text-sm text-gray-500 mb-4">{weekRange}</p>
      
      {weeklyStats.length > 0 ? (
        <div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {weeklyStats.map(stat => (
              <div key={stat.id} className={`p-4 rounded-lg text-center ${stat.color}`}>
                <div className="text-3xl">{stat.emoji}</div>
                <div className="font-bold text-lg">{stat.percentage}%</div>
                <div className="text-sm text-gray-600">{stat.count}  {t('day')} {stat.label}</div>

              </div>
            ))}
          </div>
          <div className=" pt-4">
            <h5 className="font-semibold text-gray-700 mb-2">{t('weekly_trend')}</h5>
            <p className="text-gray-600">{getWeeklyTrend()}</p>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-600">{t('no_data_for_week')}</p>
          <p className="text-sm text-gray-400">{t('add_entries_for_summary')}</p>
        </div>
      )}
      </div>
  );
};

export default WeeklySummary;
