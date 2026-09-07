import React, { useState, useEffect } from 'react';
import { useTranslation, initReactI18next } from 'react-i18next';
import { User, BarChart2, Bell, LogOut, Download, Upload, ChevronDown } from 'lucide-react';
import { emotions } from '../data/emotions';
import { readJson, writeJson } from '../utils/safeStorage';


const Profile = () => {
  const { t, i18n } = useTranslation();
  const [emotionHistory, setEmotionHistory] = useState([]);
  const [userData, setUserData] = useState({
    username: '',
    avatar: null // Will store avatar URL when implemented
  });
  const [selectedNote, setSelectedNote] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [reminder, setReminder] = useState({ enabled: false, time: '20:00' });
  const [reminderMessage, setReminderMessage] = useState('');
  const [backupMessage, setBackupMessage] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [avatarMessage, setAvatarMessage] = useState('');

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('username');
    window.location.href = '/';
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handleNoteClick = (note) => {
    setSelectedNote(note);
  };
  
  const closePopup = () => {
    setSelectedNote(null);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !userData.username) return;

    if (!file.type.startsWith('image/')) {
      setAvatarMessage(t('avatar_invalid_type'));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setAvatarMessage(t('avatar_too_large'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const avatar = reader.result;
        localStorage.setItem(`avatar_${userData.username}`, avatar);
        setUserData((current) => ({ ...current, avatar }));
        setAvatarMessage(t('avatar_updated'));
      } catch (error) {
        setAvatarMessage(t('avatar_save_failed'));
      }
    };
    reader.onerror = () => setAvatarMessage(t('avatar_save_failed'));
    reader.readAsDataURL(file);
  };

  const handleAvatarRemove = () => {
    localStorage.removeItem(`avatar_${userData.username}`);
    setUserData((current) => ({ ...current, avatar: null }));
    setAvatarMessage(t('avatar_removed'));
  };

  const getReflectionBackup = (username) => {
    const prefix = `dailyReflection_${username}_`;
    return Object.keys(localStorage)
      .filter((key) => key.startsWith(prefix))
      .reduce((reflections, key) => {
        const date = key.slice(prefix.length);
        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
          reflections[date] = localStorage.getItem(key) || '';
        }
        return reflections;
      }, {});
  };

  const handleExportBackup = () => {
    const username = userData.username;
    if (!username) return;

    const backup = {
      format: 'mindly-backup',
      version: 1,
      exportedAt: new Date().toISOString(),
      username,
      moodEntries: readJson(`moodEntries_${username}`, []),
      notes: readJson(`notes_${username}`, []),
      reminder: readJson(`checkInReminder_${username}`, { enabled: false, time: '20:00' }),
      reflections: getReflectionBackup(username),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `mindly-backup-${username}.json`;
    link.click();
    URL.revokeObjectURL(downloadUrl);
    setBackupMessage(t('backup_exported'));
  };

  const handleImportBackup = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !userData.username) return;

    try {
      const importedBackup = JSON.parse(await file.text());
      if (
        importedBackup.format !== 'mindly-backup' ||
        importedBackup.version !== 1 ||
        importedBackup.username !== userData.username ||
        !Array.isArray(importedBackup.moodEntries) ||
        !Array.isArray(importedBackup.notes) ||
        typeof importedBackup.reflections !== 'object' ||
        !importedBackup.reminder ||
        typeof importedBackup.reminder.enabled !== 'boolean' ||
        typeof importedBackup.reminder.time !== 'string'
      ) {
        throw new Error('Invalid backup');
      }

      if (!window.confirm(t('backup_import_confirm'))) return;

      writeJson(`moodEntries_${userData.username}`, importedBackup.moodEntries);
      writeJson(`notes_${userData.username}`, importedBackup.notes);
      writeJson(`checkInReminder_${userData.username}`, importedBackup.reminder);
      Object.entries(importedBackup.reflections).forEach(([date, answer]) => {
        if (/^\d{4}-\d{2}-\d{2}$/.test(date) && typeof answer === 'string') {
          localStorage.setItem(`dailyReflection_${userData.username}_${date}`, answer);
        }
      });
      setEmotionHistory(importedBackup.moodEntries.sort((a, b) => new Date(a.date) - new Date(b.date)));
      setReminder(importedBackup.reminder);
      setBackupMessage(t('backup_imported'));
    } catch (error) {
      setBackupMessage(t('backup_import_failed'));
    }
  };

  // Load emotion history and username from localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUserData(prevUserData => ({
        ...prevUserData,
        username: storedUsername,
        avatar: localStorage.getItem(`avatar_${storedUsername}`),
      }));
      const entries = readJson(`moodEntries_${storedUsername}`, []);
      const sortedEntries = entries.sort((a, b) => new Date(a.date) - new Date(b.date));
      setEmotionHistory(sortedEntries);

      setReminder(readJson(`checkInReminder_${storedUsername}`, { enabled: false, time: '20:00' }));
    }
  }, []);

  const updateReminder = async (nextReminder) => {
    setReminderMessage('');

    if (nextReminder.enabled && !('Notification' in window)) {
      setReminderMessage(t('notifications_not_supported'));
      return;
    }

    if (nextReminder.enabled && Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setReminderMessage(t('notifications_permission_denied'));
        return;
      }
    }

    setReminder(nextReminder);
    writeJson(`checkInReminder_${userData.username}`, nextReminder);
    window.dispatchEvent(new Event('mindly-reminder-updated'));
  };

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
      const entries = emotionHistory.filter(e => new Date(e.date).toDateString() === date);
      return {
        date: new Date(date).toLocaleDateString(i18n.language, { weekday: 'short', month: 'numeric', day: 'numeric' }),
        entries,
      };
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-4 pt-6">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl shadow-sm p-4 mb-6" >
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
            {userData.avatar ? (
              <img 
                src={userData.avatar} 
                alt={userData.username}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-gray-400"  />
            )}
          </div>
          <div className="flex shrink-0 flex-col gap-1">
            <label className="cursor-pointer text-sm font-medium text-purple-600 hover:text-purple-700">
              {/* {t('change_avatar')} */}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="sr-only"
              />
            </label>
            {userData.avatar && (
              <button
                type="button"
                onClick={handleAvatarRemove}
                className="text-left text-xs text-gray-500 hover:text-red-500"
              >
                {t('remove_avatar')}
              </button>
            )}
            {/* {avatarMessage && <p className="max-w-32 text-xs text-gray-500" role="status" aria-live="polite">{avatarMessage}</p>} */}
          </div>
          <div className="flex-1 flex items-center gap-4">
            <div>

              <h1 className="text-2xl font-semibold text-gray-800">{userData.username}</h1>
              <p className="text-gray-500 text-sm">{t('your_emotion_journal')}</p>
            </div>
            <button
              onClick={handleLogout}
              className="ml-auto p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

     

      {/* Emotion Chart */}
      <div className="bg-white rounded-3xl shadow-sm p-4">
        <div className="flex items-start gap-2 mb-6">
          <BarChart2 className="w-5 h-5 text-purple-500" />
          <div>
            <h2 className="text-lg font-medium text-gray-700">{t('emotion_history_7_days')}</h2>
            <p className="text-sm text-gray-500 mt-1">{t('emotion_history_description')}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {getChartData().map((day, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-20 text-sm text-gray-600">
                {day.date}
              </div>
              <div className="flex-1">
                {day.entries.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {day.entries.map((entry) => (
                      <button
                        key={entry.date}
                        type="button"
                        className="flex min-h-8 items-center gap-2 rounded-lg px-3 text-sm text-gray-800 transition-opacity hover:opacity-80"
                        style={{ backgroundColor: getEmotionColor(entry.emotion) }}
                        onClick={() => entry.note && handleNoteClick(entry.note)}
                      >
                        <span>{emotions.find((emotion) => emotion.id === entry.emotion)?.emoji}</span>
                        <span>{t(entry.emotion)}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="h-8 rounded-lg bg-gray-100" aria-label={t('no_checkin')} />
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs text-gray-400">{t('emotion_history_hint')}</p>

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

      {/* Logout Confirmation Popup */}
      {showLogoutConfirm && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300"
          onClick={cancelLogout}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl p-8 w-4/5 max-w-xl transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{t('logout')}</h3>
            <p className="text-gray-600 mb-6">{t('logout_confirmation')}</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelLogout}
                className="px-6 py-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                onClick={confirmLogout}
                className="px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                {t('logout')}
              </button>
            </div>
          </div>
        </div>
      )}

       <div className="bg-white mt-4 rounded-3xl shadow-sm p-4 sm:p-6 mb-6">
        <button
          type="button"
          aria-expanded={showSettings}
          onClick={() => setShowSettings((isVisible) => !isVisible)}
          className="flex w-full items-center justify-between text-left"
        >
          <span className="text-lg font-semibold text-gray-800">{t('settings')}</span>
          <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${showSettings ? 'rotate-180' : ''}`} />
        </button>

        {showSettings && <div>
        <section className="mt-5">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-purple-100 p-2 text-purple-600">
              <Bell className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-medium text-gray-700">{t('checkin_reminder')}</h3>
                  <p className="text-sm text-gray-500 mt-1">{t('checkin_reminder_description')}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={reminder.enabled}
                  aria-label={t('checkin_reminder')}
                  onClick={() => updateReminder({ ...reminder, enabled: !reminder.enabled })}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${reminder.enabled ? 'bg-purple-600' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${reminder.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <label htmlFor="checkin-time" className="text-sm text-gray-600">{t('reminder_time')}</label>
                <input
                  id="checkin-time"
                  type="time"
                  value={reminder.time}
                  onChange={(event) => updateReminder({ ...reminder, time: event.target.value })}
                  className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-700 focus:border-purple-400 focus:outline-none"
                />
              </div>
              {reminderMessage && <p className="mt-3 text-sm text-red-500">{reminderMessage}</p>}
            </div>
          </div>
        </section>

        <section className="mt-6 border-t border-gray-100 pt-5">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-gray-100 p-2 text-gray-600">
              <Download className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-medium text-gray-700">{t('data_backup')}</h3>
              <p className="mt-1 text-sm text-gray-500">{t('data_backup_description')}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-700"
                >
                  <Download className="h-4 w-4" />
                  {t('export_backup')}
                </button>
                <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200">
                  <Upload className="h-4 w-4" />
                  {t('import_backup')}
                  <input type="file" accept="application/json,.json" onChange={handleImportBackup} className="sr-only" />
                </label>
              </div>
              {backupMessage && <p className="mt-3 text-sm text-emerald-700" role="status" aria-live="polite">{backupMessage}</p>}
            </div>
          </div>
        </section>
        </div>}
      </div>
      {/* Author Information */}
      <div className="mt-2 text-right text-gray-300 text-xs">
        {t('developed_by')}
      </div>
    </div>
  );
};
                                                                                                  
export default Profile;
