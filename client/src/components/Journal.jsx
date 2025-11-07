import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { emotions } from '../data/emotions';
import EmotionStats from './EmotionStats';

const Calendar = ({ entries, onDateSelect, selectedDate, currentMonth, setCurrentMonth }) => {
  const { t } = useTranslation();

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
      days.push(<div key={`empty-${i}`} className="h-12" />);
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
          className={`h-12 relative flex items-center justify-center group ${
            isSelected ? 'ring-2 ring-purple-500' : ''
          }`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center relative
              ${isToday ? 'ring-2 ring-purple-300' : ''}
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
    <div className="bg-white rounded-3xl shadow-lg p-6">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => changeMonth(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          ←
        </button>
        <h2 className="text-lg font-medium">
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <button 
          onClick={() => changeMonth(1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          →
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Weekday headers */}
        {[t('sun'), t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat')].map(day => (
          <div key={day} className="h-10 flex items-center justify-center text-sm font-medium text-gray-500">
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

  useEffect(() => {
    // Load entries from localStorage
    const savedEntries = localStorage.getItem('moodEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, [i18n.language]); // Re-run when language changes

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const getSelectedEntry = () => {
    if (!selectedDate) return null;
    return entries.find(e => 
      new Date(e.date).toDateString() === selectedDate.toDateString()
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-4 pt-8">

      {/* Calendar */}
      <Calendar 
        entries={entries}
        onDateSelect={handleDateSelect}
        selectedDate={selectedDate}
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
      />

      {/* Emotion Stats */}
      <EmotionStats entries={entries} currentMonth={currentMonth} />

      {/* Selected Day Details */}
      {selectedDate && (
        <div className="mt-6 bg-white rounded-3xl shadow-lg p-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          {getSelectedEntry() ? (
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">
                  {emotions.find(e => e.id === getSelectedEntry().emotion)?.emoji}
                </span>
                <span className="text-gray-600">
                  {emotions.find(e => e.id === getSelectedEntry().emotion)?.label}
                </span>
              </div>
              {getSelectedEntry().note && (
                <p className="text-gray-600 italic">{getSelectedEntry().note}</p>
              )}
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