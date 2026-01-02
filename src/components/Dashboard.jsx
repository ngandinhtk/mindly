// import React from 'react';
import React, { useState } from 'react';
import { Calendar, TrendingUp, LogOut , Heart, Brain, Plus, Menu, X  } from 'lucide-react';
import { emotions } from '../data/emotions';
import { useTranslation } from 'react-i18next';
// import { useNavigate } from 'react-router-dom';


const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const [selectedEmotion, setSelectedEmotion] = React.useState(null);
  const [note, setNote] = React.useState('');
  const [entries, setEntries] = React.useState([]);
  const [todayEntries, setTodayEntries] = React.useState([]);
  const [activities, setActivities] = React.useState({});
  const [dailyQuote, setDailyQuote] = React.useState(null);
  const [username, setUsername] = React.useState(null);
  const [showMenu, setShowMenu] = React.useState(false);
  const [activeTab, setActiveTab] = useState('journal');
  
  const handleLogout = () => {
    localStorage.removeItem('username');
    window.location.reload();
  };

  // Load data from localStorage
  React.useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
      const savedEntries = localStorage.getItem(`moodEntries_${storedUsername}`);
      if (savedEntries) {
        setEntries(JSON.parse(savedEntries));
      }
    }

    // Dynamically import activities based on language
    const loadActivities = async () => {
      const lang = i18n.language?.split('-')[0] || 'vi';
      try {
        const activitiesModule = await import(`../data/activities_${lang}.js`);      
        setActivities(activitiesModule.activities);
      } catch (error) {
        console.error("Error loading activities:", error);
      }
    };

    
    const loadQuotes = async () => {
      const lang = i18n.language?.split('-')[0] || 'vi';
      try {
        const quotesModule = await import(`../data/quotes_${lang}.js`);
        const quotes = quotesModule.quotes;
        const today = new Date().getDate();
        const quoteIndex = today % quotes.length;
        setDailyQuote(quotes[quoteIndex]);
      } catch (error) {
        console.error("Error loading quotes:", error);
      }
    };

    loadActivities();
    loadQuotes();
  }, [i18n.language]); // Re-run when language changes

  // Check today's entries
  React.useEffect(() => {
    const today = new Date().toDateString();
    const todaysEntries = entries.filter(e => new Date(e.date).toDateString() === today);
    setTodayEntries(todaysEntries);
  }, [entries]);

  const handleEmotionSelect = (emotion) => {
    setSelectedEmotion(emotion);
  };

  const handleSaveEntry = () => {
    const today = new Date();
    if (todayEntries.length >= 2) {
      alert("You have already checked in twice today."); // Or use a more user-friendly notification
      return;
    }

    const newEntry = {
      date: today,
      emotion: selectedEmotion,
      note: note.trim(),
      activity: getRandomActivity(selectedEmotion)
    };

    const updatedEntries = [...entries, newEntry];
    setEntries(updatedEntries);
    localStorage.setItem(`moodEntries_${username}`, JSON.stringify(updatedEntries));
    
    // Reset form
    setSelectedEmotion(null);
    setNote('');
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

    return t(emotions.find(e => e.id === mostCommonEmotion)?.label) || 'N/A';
    
  };

  return (
    <div>
      <div className="max-w-2xl px-4 place-content-center">

       {/* Today's Entry Card */}
            <div className="px-8 pt-8 transform hover:scale-[1.01] transition-transform">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">{t('greeting')}<span className='italic font-light'>{username}</span></h2>
                  <p className="text-gray-500 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                   {new Date().toLocaleDateString(i18n.language, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

                  </p>
                </div>
              </div>  
          </div>
      
           {/* Mood Selection */}
          
        {todayEntries.length < 2 && (
          <div className="px-6 mb-6">
            <h2 className="text-lg font-medium text-gray-700 mb-4">{t('how_are_you_today')}</h2>
             <div className="mb-6">
                {/* <p className="text-sm font-medium text-gray-600 mb-3">Chọn tâm trạng của bạn</p> */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {emotions.map((mood, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleEmotionSelect(mood.id)}
                      className={`${mood.color} p-4 rounded-xl transition-all transform hover:scale-105 ${
                        selectedEmotion === mood.id ? 'ring-2 ring-purple-500 scale-105' : ''
                      }`}
                    >
                      <div className="text-3xl mb-1">{mood.emoji}</div>
                      <div className="text-xs font-medium text-gray-700">{t(mood.label)}</div>
                    </button>
                  ))}
                </div>
              </div>

            {/* <div className="grid grid-cols-5 gap-4 mb-6">
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
            </div> */}
            
            {selectedEmotion && (
              <div className="space-y-3">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={t('note_placeholder')}
                  className=" shadow-sm w-full h-32 px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-purple-300 focus:bg-white transition-all resize-none"
                  rows={3}
                />
      
                 <button  
                  onClick={handleSaveEntry}

                 className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all flex items-center justify-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>{t('save')}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {todayEntries.length > 0 && (
          <div className="bg-white rounded-3xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">{t('your_day')}</h2>
            {todayEntries.map((todayEntry, index) => (
              <div key={index} className="mb-4">
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-2xl">
                    {emotions.find(e => e.id === todayEntry.emotion)?.emoji}
                  </span>
                  <span className="text-gray-600">
                    {t(emotions.find(e => e.id === todayEntry.emotion)?.label)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(todayEntry.date).toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {todayEntry.note && (
                  <p className="text-gray-600 italic">{todayEntry.note}</p>
                )}
                <div className="mt-4 p-4 bg-purple-50 rounded-xl">
                  <h3 className="text-sm font-medium text-purple-800 mb-2">{t('suggestion_for_you')}</h3>
                  <p className="text-purple-900">{todayEntry.activity || getRandomActivity(todayEntry.emotion)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Statistics Section */}
        <div className="bg-white rounded-3xl shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-700 mb-4">{t('monthly_overview')}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-purple-50 rounded-xl p-4">
              <Calendar className="w-5 h-5 text-purple-500 mb-2" />
              <div className="text-2xl font-semibold text-purple-900">{entries.length}</div>
              <div className="text-sm text-purple-600">{t('days_recorded')}</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4">
              <TrendingUp className="w-5 h-5 text-purple-500 mb-2" />
              <div className="text-sm text-purple-600">{t('most_common_emotion')}</div>
              <div className="text-xl font-bold text-purple-900">
                {getMostCommonEmotion()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
