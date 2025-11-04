import React, { useState, useEffect } from 'react';
import { User, BarChart2 } from 'lucide-react';

const Profile = () => {
  const [emotionHistory, setEmotionHistory] = useState([]);
  const [userData, setUserData] = useState({
    username: 'Mindly User',
    avatar: null // Will store avatar URL when implemented
  });

  // Load emotion history from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem('moodEntries');
    if (savedEntries) {
      const entries = JSON.parse(savedEntries);
      // Sort entries by date
      const sortedEntries = entries.sort((a, b) => new Date(a.date) - new Date(b.date));
      setEmotionHistory(sortedEntries);
    }
  }, []);

  const getEmotionColor = (emotion) => {
    const colors = {
      'very_happy': '#A8E6CF',
      'happy': '#C7EAE4',
      'neutral': '#FFD98E',
      'sad': '#FFB88C',
      'very_sad': '#FF8B94'
    };
    return colors[emotion] || '#E0E0E0';
  };

  const getEmotionLabel = (emotion) => {
    const labels = {
      'very_happy': 'Rất vui',
      'happy': 'Vui',
      'neutral': 'Bình thường',
      'sad': 'Buồn',
      'very_sad': 'Rất buồn'
    };
    return labels[emotion] || emotion;
  };

  // Group emotions by date for the chart
  const getChartData = () => {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toDateString();
    }).reverse();

    return last7Days.map(date => {
      const entry = emotionHistory.find(e => new Date(e.date).toDateString() === date);
      return {
        date: new Date(date).toLocaleDateString('vi-VN', { weekday: 'short', month: 'numeric', day: 'numeric' }),
        emotion: entry?.emotion || 'no_data',
        note: entry?.note || ''
      };
    });
  };

  return (
    <div className="p-4 pt-8">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
            {userData.avatar ? (
              <img 
                src={userData.avatar} 
                alt={userData.username}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-gray-400" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">{userData.username}</h1>
            <p className="text-gray-500">Nhật ký cảm xúc của bạn</p>
          </div>
        </div>
      </div>

      {/* Emotion Chart */}
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <BarChart2 className="w-5 h-5 text-purple-500" />
          <h2 className="text-lg font-medium text-gray-700">Lịch sử cảm xúc 7 ngày qua</h2>
        </div>
        
        <div className="space-y-4">
          {getChartData().map((day, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-20 text-sm text-gray-600">
                {day.date}
              </div>
              <div className="flex-1">
                <div 
                  className="h-8 rounded-lg transition-all relative group"
                  style={{ 
                    backgroundColor: day.emotion === 'no_data' 
                      ? '#F3F4F6' 
                      : getEmotionColor(day.emotion)
                  }}
                >
                  {day.emotion !== 'no_data' && (
                    <div className="opacity-0 group-hover:opacity-100 absolute left-2 top-1/2 -translate-y-1/2 bg-white px-3 py-1 rounded-full text-sm transition-opacity">
                      {getEmotionLabel(day.emotion)}
                    </div>
                  )}
                </div>
                {day.note && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-1">{day.note}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-6 border-t">
          <div className="flex flex-wrap gap-4">
            {['very_happy', 'happy', 'neutral', 'sad', 'very_sad'].map(emotion => (
              <div key={emotion} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getEmotionColor(emotion) }}
                />
                <span className="text-sm text-gray-600">
                  {getEmotionLabel(emotion)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
