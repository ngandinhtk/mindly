import React from 'react';
import { Calendar, TrendingUp, Quote, CalendarIcon } from 'lucide-react';
import { emotions } from '../data/emotions';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const [selectedEmotion, setSelectedEmotion] = React.useState(null);
  const [note, setNote] = React.useState('');
  const [entries, setEntries] = React.useState([]);
  const [todayEntry, setTodayEntry] = React.useState(null);
  const [activities, setActivities] = React.useState({});
  const [dailyQuote, setDailyQuote] = React.useState(null);

  // Load data from localStorage
  React.useEffect(() => {
    const savedEntries = localStorage.getItem('moodEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }

    // Dynamically import activities based on language
    const loadActivities = async () => {
      const lang = i18n.language;
      const activitiesModule = await import(`../data/activities_${lang}.js`);
      setActivities(activitiesModule.activities);
    };

    const loadQuotes = async () => {
      const lang = i18n.language;
      const quotesModule = await import(`../data/quotes_${lang}.js`);
      const quotes = quotesModule.quotes;
      const today = new Date().getDate();
      const quoteIndex = today % quotes.length;
      setDailyQuote(quotes[quoteIndex]);
    };

    loadActivities();
    loadQuotes();
  }, [i18n.language]); // Re-run when language changes

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
        <h1 className="text-2xl font-semibold text-gray-800">{t('greeting')}</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString(i18n.language, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Daily Quote */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
        <h1 className="text-gray-700 mb-4 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-purple-500" />
          {t('daily_quote')}
        </h1>
        <div className="flex items-start gap-4">
          <Quote className="w-8 h-8 text-purple-400 flex-shrink-0" />
          <div>
            <p className="text-lg text-gray-800 font-medium mb-2">"{dailyQuote?.text}"</p>
            <p className="text-sm text-gray-500">- {dailyQuote?.author}</p>
          </div>
        </div>
      </div>

      {!todayEntry ? (
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-700 mb-4">{t('how_are_you_today')}</h2>
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
                placeholder={t('note_placeholder')}
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none"
                rows={3}
              />
              <button
                onClick={handleSaveEntry}
                className="mt-4 w-full bg-purple-600 text-white py-2 px-4 rounded-xl hover:bg-purple-700 transition-colors"
              >
                {t('save')}
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-700 mb-4">{t('your_day')}</h2>
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
            <h3 className="text-sm font-medium text-purple-800 mb-2">{t('suggestion_for_you')}</h3>
            <p className="text-purple-900">{getRandomActivity(todayEntry.emotion)}</p>
          </div>
        </div>
      )}

      {/* Statistics Section */}
      <div className="bg-white rounded-3xl shadow-lg p-6">
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
