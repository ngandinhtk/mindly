import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { emotions } from '../data/emotions';
import EmotionStats from './EmotionStats';
import { CalendarIcon, ChevronLeft, ChevronRight, Quote  } from 'lucide-react';
import { readJson } from '../utils/safeStorage';

const Calendar = ({ entries, onDateSelect, selectedDate, currentMonth, setCurrentMonth }) => {
  const { t, i18n } = useTranslation();

  const daysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEmotionForDate = (date) => {
    const entry = entries.find(e => 
      new Date(e.date).toDateString() === date.toDateString()
    );
    return entry?.emotion || null;
  };

  const changeMonth = (delta) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + delta);
      return newDate;
    });
  };

  const renderCalendar = () => {
    const days = [];
    const totalDays = daysInMonth(currentMonth);
    const firstDay = firstDayOfMonth(currentMonth);

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10" />);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const emotionId = getEmotionForDate(date);
      const emotionObject = emotions.find(e => e.id === emotionId);
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      const isToday = date.toDateString() === new Date().toDateString();

      days.push(
        <button
          key={day}
          onClick={() => onDateSelect(date)}
          aria-label={date.toLocaleDateString(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' })}
          aria-pressed={isSelected}
          className={`h-10 relative flex items-center justify-center group ${
            isSelected ? 'rounded-lg ring-2 ring-purple-500 ring-offset-1' : ''
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center relative
              ${isToday ? 'ring-2 ring-pink-500' : ''}
            `}
            style={{ backgroundColor: emotionObject ? emotionObject.color : 'transparent' }}
          >
            {emotionObject ? (
              <span className="text-2xl">{emotionObject.emoji}</span>
            ) : (
              day
            )}
          </div>
        </button>
      );
    }

    return days;
  };

  return (
    <div className="bg-white rounded-3xl shadow-xs p-6">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => changeMonth(-1)}
          aria-label={t('previous_month')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-bold">
          {currentMonth.toLocaleDateString(i18n.language, { month: 'long', year: 'numeric' })}
        </h2>
        <button 
          onClick={() => changeMonth(1)}
          aria-label={t('next_month')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Weekday headers */}
        {[t('sun'), t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat')].map(day => (
          <div key={day} className="h-10 flex items-center justify-center text-sm font-medium text-gray-800">
            {day}
          </div>
        ))}
        {/* Calendar days */}
        {renderCalendar()}
      </div>
    </div>
  );
};

const Journal = () => {
  const { t, i18n } = useTranslation();
  const [entries, setEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dailyQuote, setDailyQuote] = React.useState(null);
  const [reflectionHistory, setReflectionHistory] = React.useState([]);
  

  useEffect(() => {
    // Load entries from localStorage
    const username = localStorage.getItem('username');
    if (username) {
      setEntries(readJson(`moodEntries_${username}`, []));

      const reflectionPrefix = `dailyReflection_${username}_`;
      const savedReflections = Object.keys(localStorage)
        .filter((key) => key.startsWith(reflectionPrefix))
        .map((key) => ({
          date: key.slice(reflectionPrefix.length),
          answer: localStorage.getItem(key) || '',
        }))
        .filter((reflection) => /^\d{4}-\d{2}-\d{2}$/.test(reflection.date))
        .sort((a, b) => b.date.localeCompare(a.date));
      setReflectionHistory(savedReflections);
    }

    // Fetch daily quote
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
    loadQuotes();

  }, [i18n.language]); // Re-run when language changes

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const getSelectedEntries = () => {
    if (!selectedDate) return [];
    return entries.filter(e => 
      new Date(e.date).toDateString() === selectedDate.toDateString()
    );
  };

  const selectedEntries = getSelectedEntries();

  return (
    <div className="max-w-3xl mx-auto px-4">
      {/* Daily Quote */}
             <div className="p-6">
                <h1 className="text-gray-700 text-xl mb-4 flex items-center gap-2">
                  <CalendarIcon className="w-8 h-8 text-purple-600" />
                  <div className='font-bold '>{t('daily_quote')}</div>
                </h1>
                <div className="flex items-start gap-4">
                  <Quote className="w-4 h-4 text-pink-400 flex-shrink-0" />
                  <div>
                    {dailyQuote ? (
                      <>
                        <p className="text-lg text-gray-800 font-medium mb-2">"{dailyQuote.text}"</p>
                        <p className="text-sm text-gray-500">- {dailyQuote.author}</p>
                      </>
                    ) : (
                      <p className="text-gray-500 italic">...</p>
                    )}
                  </div>
                </div>
              </div>

      {/* Calendar */}
      <Calendar 
        entries={entries}
        onDateSelect={handleDateSelect}
        selectedDate={selectedDate}
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
      />

      <section className="mt-6 rounded-3xl bg-white p-4 shadow-sm sm:p-6">
        <h2 className="text-lg font-bold text-gray-800">{t('reflection_history')}</h2>
        <p className="mt-1 text-sm text-gray-500">{t('reflection_history_description')}</p>
        {reflectionHistory.length > 0 ? (
          <div className="mt-4 space-y-3">
            {reflectionHistory.map((reflection) => (
              <article key={reflection.date} className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
                <time className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                  {new Date(`${reflection.date}T12:00:00`).toLocaleDateString(i18n.language, {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </time>
                <p className="mt-2 whitespace-pre-wrap text-gray-700">{reflection.answer}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{t('no_reflections')}</p>
        )}
      </section>

      {/* Emotion Stats */}
      <EmotionStats entries={entries} currentMonth={currentMonth} />

      {/* Selected Day Details */}
      {selectedDate && (
        <div className="bg-white mt-6 p-8 rounded-3xl shadow-xs">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            {selectedDate.toLocaleDateString(i18n.language, { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          {selectedEntries.length > 0 ? (
            <div className="space-y-4">
              {selectedEntries.map((entry, index) => {
                const emotion = emotions.find(e => e.id === entry.emotion);
                return (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{emotion?.emoji}</span>
                      <div>
                        <span className="font-bold text-gray-800">{t(emotion?.label)}</span>
                        <span className="text-sm text-gray-500 ml-2">
                          {new Date(entry.date).toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    {entry.note && (
                      <p className="text-gray-600 italic bg-gray-50 p-3 rounded-lg">{entry.note}</p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">{t('no_entry')}</p>
          )}
        </div>
      )}
      </div>
  );
};


export default Journal;