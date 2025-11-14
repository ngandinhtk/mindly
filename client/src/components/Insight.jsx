import React, { useState, useEffect } from 'react';
import { emotions } from '../data/emotions';

const Insight = () => {
    const [emotionStats, setEmotionStats] = useState([]);

    useEffect(() => {
        const savedEntries = localStorage.getItem('moodEntries');
        if (savedEntries) {
            const parsedEntries = JSON.parse(savedEntries);
            calculateStats(parsedEntries);
        }
    }, []);

    const calculateStats = (entries) => {
        if (!entries || entries.length === 0) {
            return;
        }

        const emotionCounts = entries.reduce((acc, entry) => {
            acc[entry.emotion] = (acc[entry.emotion] || 0) + 1;
            return acc;
        }, {});

        const totalEntries = entries.length;
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

        setEmotionStats(stats);
    };

    const getOverallTrend = () => {
        if (emotionStats.length === 0) {
            return "Chưa có dữ liệu.";
        }
        const topEmotion = emotionStats[0];
        
        // Simple trend message based on the most frequent emotion's ID
        if (['happy', 'excited', 'grateful'].includes(topEmotion.id)) {
            return "Bạn đang có xu hướng tích cực! Tiếp tục duy trì nhé 🌟";
        }
        if (['sad', 'angry', 'anxious'].includes(topEmotion.id)) {
            return "Có vẻ bạn đã trải qua một số ngày khó khăn. Hãy nhớ chăm sóc bản thân nhé.";
        }
        return "Cảm xúc của bạn khá ổn định.";
    };

    return (
         <div className="space-y-6">
            <div className="shadow-lg p-8 rounded-2xl bg-white">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Thống kê cảm xúc</h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {emotionStats.length > 0 ? (
                    emotionStats.map(stat => (
                        <div key={stat.id} className={`${stat.color} p-6 rounded-xl transform transition-transform hover:scale-105`}>
                            <div className="text-4xl mb-2">{stat.emoji}</div>
                            <div className="text-2xl font-bold text-gray-800">{stat.percentage}%</div>
                            <div className="text-sm text-gray-600">{stat.count} ngày {stat.label}</div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-8">
                        <p className="text-gray-600">Chưa có đủ dữ liệu để hiển thị thống kê.</p>
                        <p className="text-sm text-gray-400">Hãy bắt đầu ghi lại cảm xúc mỗi ngày nhé!</p>
                    </div>
                )}
              </div>

              <div className="border-t pt-6">
                <h4 className="font-semibold text-gray-800 mb-3">Xu hướng chung</h4>
                <p className="text-gray-600">
                  {getOverallTrend()}
                </p>
              </div>
            </div>
          </div>
    );
};

export default Insight;
