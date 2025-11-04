import React from 'react';
import { Calendar, TrendingUp } from 'lucide-react';
import { emotions, activities } from '../data/emotions';

const Dashboard = () => {
  const [selectedEmotion, setSelectedEmotion] = React.useState(null);
  const [note, setNote] = React.useState('');
  const [entries, setEntries] = React.useState([]);
  const [todayEntry, setTodayEntry] = React.useState(null);

  // Load data from localStorage
  React.useEffect(() => {
    const savedEntries = localStorage.getItem('moodEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Check today's entry
  React.useEffect(() => {
    const today = new Date().toDateString();
    const entry = entries.find(e => new Date(e.date).toDateString() === today);
    setTodayEntry(entry);
    if (entry) {
      setSelectedEmotion(entry.emotion);
      setNote(entry.note || '');
    }
  }, [entries]);

  const handleEmotionSelect = (emotion) => {
    setSelectedEmotion(emotion);
  };

  const handleSaveEntry = () => {
    const today = new Date();
    const newEntry = {
      date: today,
      emotion: selectedEmotion,
      note: note.trim()
    };

    const updatedEntries = entries.filter(e => 
      new Date(e.date).toDateString() !== today.toDateString()
    );
    updatedEntries.push(newEntry);

    setEntries(updatedEntries);
    localStorage.setItem('moodEntries', JSON.stringify(updatedEntries));
    setTodayEntry(newEntry);
  };

  const getRandomActivity = (emotion) => {
    if (!emotion || !activities[emotion]) return null;
    const emotionActivities = activities[emotion];
    return emotionActivities[Math.floor(Math.random() * emotionActivities.length)];
  };

  // Get most common emotion
  const getMostCommonEmotion = () => {
    if (!entries.length) return null;
    
    const emotionCounts = entries.reduce((acc, entry) => {
      acc[entry.emotion] = (acc[entry.emotion] || 0) + 1;
      return acc;
    }, {});

    const mostCommonEmotion = Object.entries(emotionCounts)
      .sort(([,a], [,b]) => b - a)[0][0];

    return emotions.find(e => e.id === mostCommonEmotion)?.label || 'N/A';
  };

  return (
    <div className="max-w-2xl mx-auto p-4 pt-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Xin chào!</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {!todayEntry ? (
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-700 mb-4">Hôm nay bạn cảm thấy thế nào?</h2>
          <div className="grid grid-cols-5 gap-4 mb-6">
            {emotions.map(emotion => (
              <button
                key={emotion.id}
                onClick={() => handleEmotionSelect(emotion.id)}
                className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                  selectedEmotion === emotion.id 
                    ? 'bg-purple-100 ring-2 ring-purple-400' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <span className="text-2xl mb-1">{emotion.emoji}</span>
                <span className="text-sm text-gray-600">{emotion.label}</span>
              </button>
            ))}
          </div>
          
          {selectedEmotion && (
            <>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ghi chú thêm về cảm xúc của bạn... (không bắt buộc)"
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none"
                rows={3}
              />
              <button
                onClick={handleSaveEntry}
                className="mt-4 w-full bg-purple-600 text-white py-2 px-4 rounded-xl hover:bg-purple-700 transition-colors"
              >
                Lưu lại
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-700 mb-4">Hôm nay của bạn</h2>
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-2xl">
              {emotions.find(e => e.id === todayEntry.emotion)?.emoji}
            </span>
            <span className="text-gray-600">
              {emotions.find(e => e.id === todayEntry.emotion)?.label}
            </span>
          </div>
          {todayEntry.note && (
            <p className="text-gray-600 italic">{todayEntry.note}</p>
          )}
          <div className="mt-4 p-4 bg-purple-50 rounded-xl">
            <h3 className="text-sm font-medium text-purple-800 mb-2">Gợi ý cho bạn</h3>
            <p className="text-purple-900">{getRandomActivity(todayEntry.emotion)}</p>
          </div>
        </div>
      )}

      {/* Statistics Section */}
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <h2 className="text-lg font-medium text-gray-700 mb-4">Tổng quan tháng</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-purple-50 rounded-xl p-4">
            <Calendar className="w-5 h-5 text-purple-500 mb-2" />
            <div className="text-2xl font-semibold text-purple-900">{entries.length}</div>
            <div className="text-sm text-purple-600">ngày đã ghi chép</div>
          </div>
          <div className="bg-purple-50 rounded-xl p-4">
            <TrendingUp className="w-5 h-5 text-purple-500 mb-2" />
            <div className="text-sm text-purple-600">Cảm xúc phổ biến</div>
            <div className="text-2xl font-semibold text-purple-900">
              {getMostCommonEmotion()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
