// import React from 'react';
import React, { useState } from 'react';
import { Calendar, TrendingUp, LogOut , Heart, Brain, Plus, Menu, X, Sparkles  } from 'lucide-react';
import { emotions } from '../data/emotions';
import { useTranslation } from 'react-i18next';
// import { useNavigate } from 'react-router-dom';
import { Adsense } from '@ctrl/react-adsense';
import { readJson, writeJson } from '../utils/safeStorage';

const getLocalDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const [selectedEmotion, setSelectedEmotion] = React.useState(null);
  const [note, setNote] = React.useState('');
  const [entries, setEntries] = React.useState([]);
  const [todayEntries, setTodayEntries] = React.useState([]);
  const [activities, setActivities] = React.useState({});
  const [reflectionPrompt, setReflectionPrompt] = React.useState('');
  const [reflectionAnswer, setReflectionAnswer] = React.useState('');
  const [savedReflectionAnswer, setSavedReflectionAnswer] = React.useState('');
  const [reflectionMessage, setReflectionMessage] = React.useState('');
  const [saveMessage, setSaveMessage] = React.useState('');
  // const [dailyQuote, setDailyQuote] = React.useState(null);
  const [username, setUsername] = React.useState(null);
  // const [showMenu, setShowMenu] = React.useState(false);
  // const [activeTab, setActiveTab] = useState('journal');
  
  // const handleLogout = () => {
  //   localStorage.removeItem('username');
  //   window.location.reload();
  // };

  // Load data from localStorage
  React.useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
      setEntries(readJson(`moodEntries_${storedUsername}`, []));
    }

    // Dynamically import activities based on language
    const loadActivities = async () => {
      const lang = i18n.language?.split('-')[0] || 'vi';
      try {
        const activitiesModule = await import(`../data/activities_${lang}.js`);      
        setActivities(activitiesModule.activities);
        // console.log(activitiesModule.activities);
        
      } catch (error) {
        console.error("Error loading activities:", error);
        setActivities({}); // Fallback to empty activities
      }
    };

    const loadReflection = async () => {
      const lang = i18n.language?.split('-')[0] || 'vi';
      try {
        const reflectionsModule = await import(`../data/reflections_${lang}.js`);
        const reflectionDate = new Date();
        const daySeed = Math.floor(new Date(
          reflectionDate.getFullYear(),
          reflectionDate.getMonth(),
          reflectionDate.getDate()
        ).getTime() / 86400000);
        const prompt = reflectionsModule.reflections[daySeed % reflectionsModule.reflections.length];
        setReflectionPrompt(prompt);

        if (storedUsername) {
          const answerKey = `dailyReflection_${storedUsername}_${getLocalDateKey(reflectionDate)}`;
          const savedAnswer = localStorage.getItem(answerKey) || '';
          setReflectionAnswer(savedAnswer);
          setSavedReflectionAnswer(savedAnswer);
        }
      } catch (error) {
        console.error('Error loading reflection:', error);
      }
    };

    
    // const loadQuotes = async () => {
    //   const lang = i18n.language?.split('-')[0] || 'vi';
    //   try {
    //     const quotesModule = await import(`../data/quotes_${lang}.js`);
    //     const quotes = quotesModule.quotes;
    //     const today = new Date().getDate();
    //     const quoteIndex = today % quotes.length;
    //     setDailyQuote(quotes[quoteIndex]);
    //   } catch (error) {
    //     console.error("Error loading quotes:", error);
    //   }
    // };

    loadActivities();
    loadReflection();
    // loadQuotes();
  }, [i18n.language]); // Re-run when language changes

  const handleReflectionSave = () => {
    const trimmedAnswer = reflectionAnswer.trim();
    if (!username || !trimmedAnswer || trimmedAnswer === savedReflectionAnswer) return;

    try {
      const todayKey = getLocalDateKey(new Date());
      localStorage.setItem(`dailyReflection_${username}_${todayKey}`, trimmedAnswer);
      setReflectionAnswer(trimmedAnswer);
      setSavedReflectionAnswer(trimmedAnswer);
      setReflectionMessage(t('reflection_saved'));
    } catch (error) {
      setReflectionMessage(t('reflection_save_failed'));
    }
  };

  // Check today's entries
  React.useEffect(() => {
    const today = new Date().toDateString();
    const todaysEntries = entries.filter(e => new Date(e.date).toDateString() === today);
    setTodayEntries(todaysEntries);
  }, [entries]);

  const handleEmotionSelect = (emotion) => {
    setSelectedEmotion(emotion);
  };

  const handleSaveEntry = async () => {
    const today = new Date();
    if (todayEntries.length >= 2) {
      setSaveMessage(t('checkin_limit_reached'));
      window.setTimeout(() => setSaveMessage(''), 3000);
      return;
    }

    const newEntry = {
      date: today,
      emotion: selectedEmotion,
      note: note.trim(),
      // Activity is no longer saved with the entry.
      // It will be generated dynamically on display to support multiple languages.
    };

    const updatedEntries = [...entries, newEntry];
    try {
      writeJson(`moodEntries_${username}`, updatedEntries);
      setEntries(updatedEntries);
    } catch (error) {
      setSaveMessage(t('storage_save_failed'));
      window.setTimeout(() => setSaveMessage(''), 3000);
      return;
    }
    
    // Reset form
    setSelectedEmotion(null);
    setNote('');
    setSaveMessage(t('mood_saved'));
    window.setTimeout(() => setSaveMessage(''), 3000);
  };

  const getActivityForEmotion = (emotion, date) => {
    if (!emotion || !activities[emotion] || !activities[emotion].length) {
      return null;
    }
    const emotionActivities = activities[emotion];
    // Use the day of the month from the entry's date as a seed
    // to provide a consistent suggestion for that day.
    const seed = new Date(date).getDate();
    const index = seed % emotionActivities.length;
    return emotionActivities[index];
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
    <div className="w-full min-w-0">
      <div className="w-full max-w-2xl mx-auto px-3 sm:px-4">

       {/* Today's Entry Card */}
            <div className="px-1 sm:px-4 pt-6 sm:pt-8 transform hover:scale-[1.01] transition-transform">
              <div className="flex items-start justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 break-words">{t('greeting')}<span className='italic font-light'>{username}</span></h2>
                  <p className="text-sm sm:text-base text-gray-500 flex items-start sm:items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                   {new Date().toLocaleDateString(i18n.language, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

                  </p>
                </div>
              </div>  
          </div>

           {/* Mood Selection */}
          
        {todayEntries.length < 2 && (
          <div className="px-1 sm:px-2 mb-6">
            <div className="flex items-start justify-between gap-3 mb-4">
              <h2 className="text-lg font-medium text-gray-700">{t('how_are_you_today')}</h2>
              <span className="shrink-0 rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
                {t('checkin_progress', { count: todayEntries.length, total: 2 })}
              </span>
            </div>
             <div className="mb-6">
                {/* <p className="text-sm font-medium text-gray-600 mb-3">Chọn tâm trạng của bạn</p> */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
                  {emotions.map((mood, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleEmotionSelect(mood.id)}
                      className={`${mood.color} p-3 sm:p-4 rounded-xl transition-all transform hover:scale-105 ${
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
                {saveMessage && (
                  <p className="mt-2 text-sm text-emerald-700" role="status" aria-live="polite">
                    {saveMessage}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {todayEntries.length >= 2 && (
          <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">
            {t('checkin_complete')}
          </div>
        )}

        {todayEntries.length > 0 && (
          <div className="bg-white rounded-3xl shadow-sm p-4 sm:p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">{t('your_day')}</h2>
            {todayEntries.map((todayEntry, index) => (
              <div key={index} className="mb-4">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
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
                  <p className="text-purple-900">{getActivityForEmotion(todayEntry.emotion, todayEntry.date)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {reflectionPrompt && (
          <div className="bg-gradient-to-br from-amber-50 via-white to-pink-50 rounded-3xl border border-amber-100 shadow-sm p-4 sm:p-6 mb-6">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-amber-100 p-2 text-amber-600 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 mb-2">{t('daily_reflection')}</p>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 break-words">{reflectionPrompt}</h2>
                <textarea
                  value={reflectionAnswer}
                  onChange={(event) => setReflectionAnswer(event.target.value)}
                  placeholder={t('daily_reflection_placeholder')}
                  className="mt-4 w-full min-h-[96px] resize-y rounded-xl border border-amber-100 bg-white/80 px-3 py-3 text-gray-700 outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-100"
                  aria-label={reflectionPrompt}
                />
                <button
                  type="button"
                  onClick={handleReflectionSave}
                        disabled={!reflectionAnswer.trim() || reflectionAnswer.trim() === savedReflectionAnswer}
                  className="mt-3 w-full sm:w-auto rounded-xl bg-gray-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t('save_reflection')}
                </button>
                      {reflectionMessage && (
                        <p className="mt-2 text-sm text-emerald-700" role="status" aria-live="polite">
                          {reflectionMessage}
                        </p>
                      )}
              </div>
            </div>
          </div>
        )}

        {/* Statistics Section */}
        <div className="bg-white rounded-3xl shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-700 mb-4">{t('monthly_overview')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-purple-50 rounded-xl p-4 min-w-0">
              <Calendar className="w-5 h-5 text-purple-500 mb-2" />
              <div className="text-2xl font-semibold text-purple-900">{entries.length}</div>
              <div className="text-sm text-purple-600">{t('days_recorded')}</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 min-w-0">
              <TrendingUp className="w-5 h-5 text-purple-500 mb-2" />
              <div className="text-sm text-purple-600">{t('most_common_emotion')}</div>
              <div className="text-xl font-bold text-purple-900 break-words">
                {getMostCommonEmotion()}
              </div>
            </div>
          </div>
        </div>

        {/* AdSense Unit */}
        <div className="mt-6">
          <Adsense
            client="ca-pub-YOUR_CLIENT_ID"
            slot="YOUR_SLOT_ID"
            style={{ display: 'block' }}
            format="auto"
            responsive="true"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
