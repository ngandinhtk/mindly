import React, { useState, useEffect } from 'react';
import { useTranslation, initReactI18next } from 'react-i18next';
import { User, BarChart2, LogOut, Trash2 } from 'lucide-react';
import { emotions } from '../data/emotions';


const Profile = () => {
  const { t } = useTranslation();
  const [emotionHistory, setEmotionHistory] = useState([]);
  const [userData, setUserData] = useState({
    username: '',
    avatar: null // Will store avatar URL when implemented
  });
  const [selectedNote, setSelectedNote] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleNoteClick = (note) => {
    setSelectedNote(note);
  };
  

  const closePopup = () => {
    setSelectedNote(null);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('username');
    window.location.href = '/';
  }

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  }

  const handleClearData = () => {
    if (window.confirm(t('clear_data_confirmation'))) {
      localStorage.removeItem('moodEntries');
      window.location.reload();
    }
  };

  // Load emotion history and username from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem('moodEntries');
    if (savedEntries) {
      const entries = JSON.parse(savedEntries);
      // Sort entries by date
      const sortedEntries = entries.sort((a, b) => new Date(a.date) - new Date(b.date));
      setEmotionHistory(sortedEntries);
    }

    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUserData(prevUserData => ({ ...prevUserData, username: storedUsername }));
    }
  }, []);

  const getEmotionColor = (emotionId) => {
    const emotion = emotions.find(e => e.id === emotionId);
    return emotion ? emotion.graphColor : '#E0E0E0';
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
    <div className="max-w-3xl mx-auto p-4 pt-6">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl shadow-lg p-4 mb-6" >
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
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
          <div className="flex-1 flex items-center gap-4">
            <div>

              <h1 className="text-2xl font-semibold text-gray-800">{userData.username}</h1>
              <p className="text-gray-500 text-sm">{t('your_emotion_journal')}</p>
            </div>
       
          </div>
        </div>
      </div>

      {/* Emotion Chart */}
      <div className="bg-white rounded-3xl shadow-lg p-4">
        <div className="flex items-center gap-2 mb-6">
          <BarChart2 className="w-5 h-5 text-purple-500" />
          <h2 className="text-lg font-medium text-gray-700">{t('emotion_history_7_days')}</h2>
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
                    <div className="flex items-center h-full px-3">
                      <span className="text-sm text-gray-800">{t(day.emotion)}</span>
                    </div>
                  )}
                </div>
                {day.note && (
                  <p 
                    className="text-sm text-gray-500 mt-1 line-clamp-1 cursor-pointer"
                    onClick={() => handleNoteClick(day.note)}
                  >
                    {day.note}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-6 border-t">
          <div className="flex flex-wrap gap-4">
            {emotions.map(emotion => (
              <div key={emotion.id} className="flex items-center gap-1">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getEmotionColor(emotion.id) }}
                />
                <span className="text-sm text-gray-600">
                  {t(emotion.id)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Note Popup */}
      {selectedNote && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300"
          onClick={closePopup}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl p-8 w-4/5 max-w-xl transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('note_details')}</h3>
            <p className="text-gray-600 mb-6 whitespace-pre-wrap">{selectedNote}</p>
            <button
              onClick={closePopup}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            >
              {t('close')}
            </button>
          </div>
        </div>
      )}


      {/* Author Information */}
      <div className="mt-6 text-center text-gray-400 text-sm">
        {t('developed_by')}
      </div>
    </div>
  );
};
                                                                                                  
export default Profile;
