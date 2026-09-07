import React from 'react';  
import { HashRouter as Router, Routes, Route, Link, NavLink, Navigate, Outlet } from 'react-router-dom';
import { Home, User, Calendar, TrendingUp, Heart, FileText } from 'lucide-react';
import Dashboard from './Dashboard';
import Profile from './Profile';
import Journal from './Journal';
import { useTranslation } from 'react-i18next';
import UserPage from './UserPage';
import Insight from './Insight';
import Notes from './Notes';
import LanguageSwitcher from './LanguageSwitcher';
import AdsenseAd from './AdSenseAd';
import { readJson, writeJson } from '../utils/safeStorage';

const PrivateRoutes = () => {
  const username = localStorage.getItem('username');
  return username ? <Outlet /> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  const { t } = useTranslation();
  const [username, setUsername] = React.useState<string | null>(localStorage.getItem('username'));

  React.useEffect(() => {
    const checkReminder = () => {
      const currentUsername = localStorage.getItem('username');
      if (!currentUsername || !('Notification' in window)) return;

      const reminder = readJson(`checkInReminder_${currentUsername}`, null);
      if (!reminder) return;
      if (!reminder.enabled || Notification.permission !== 'granted') return;

      const now = new Date();
      const [hours, minutes] = reminder.time.split(':').map(Number);
      const reminderTime = new Date(now);
      reminderTime.setHours(hours, minutes, 0, 0);
      const todayKey = now.toISOString().slice(0, 10);
      const lastNotified = localStorage.getItem(`checkInReminderLast_${currentUsername}`);
      const entries = readJson(`moodEntries_${currentUsername}`, []);
      const hasCheckedInToday = entries.some((entry: { date: string }) => (
        new Date(entry.date).toDateString() === now.toDateString()
      ));

      if (now >= reminderTime && lastNotified !== todayKey && !hasCheckedInToday) {
        const notification = new Notification(t('checkin_reminder_title'), {
          body: t('checkin_reminder_body'),
          icon: '/favicon.ico',
        });
        notification.onclick = () => {
          window.focus();
          window.location.hash = '#/dashboard';
          notification.close();
        };
        localStorage.setItem(`checkInReminderLast_${currentUsername}`, todayKey);
      }
    };

    checkReminder();
    const reminderInterval = window.setInterval(checkReminder, 30000);
    window.addEventListener('mindly-reminder-updated', checkReminder);

    return () => {
      window.clearInterval(reminderInterval);
      window.removeEventListener('mindly-reminder-updated', checkReminder);
    };
  }, [t]);

  const handleLogin = (name: string) => {
    localStorage.setItem('username', name);
    setUsername(name);
  };

  return (
    <Router>
      <div className="app min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-60">
        {/* {username && ( */}
          <>
          <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Mindly
                  </h1>
                </div>
                {username && (
                  <nav className="hidden md:flex items-center gap-1 ml-auto mr-4">
                    <NavLink to="/dashboard" className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'}`}>{t('home')}</NavLink>
                    <NavLink to="/journal" className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'}`}>{t('journal')}</NavLink>
                    <NavLink to="/insights" className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'}`}>{t('insights')}</NavLink>
                    <NavLink to="/notes" className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'}`}>{t('notes')}</NavLink>
                    <NavLink to="/profile" className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100'}`}>{t('profile')}</NavLink>
                  </nav>
                )}
                <div className="flex items-center gap-2 ml-auto">
                  <LanguageSwitcher />
                </div>
              </div>


               
            </div>
          </header>
          </>
        {/* )} */}
           
        <main className="flex-grow min-w-0 overflow-y-auto pb-24 sm:pb-20 w-full max-w-3xl mx-auto">
          <Routes>
            <Route path="/login" element={<UserPage onLogin={handleLogin} />} />
            <Route element={<PrivateRoutes />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/journal"element={<Journal />} />
              <Route path="/insights" element={<Insight />} />
              <Route path="/notes" element={
                <>
                  <Notes />
                  <AdsenseAd />
                </>
              } />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>

        {username && (
          <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-t border-gray-100 px-2 sm:px-4 pt-1 pb-[calc(0.25rem+env(safe-area-inset-bottom))]">
            <div className="max-w-2xl mx-auto flex justify-around gap-1">
              <NavLink
                to="/dashboard"
                className={({ isActive }) => `flex min-w-0 flex-1 flex-col items-center rounded-lg p-1 transition-colors ${isActive ? 'text-purple-700' : 'text-gray-600 hover:text-purple-600'}`}
              >
               
                <Home className="w-6 h-6" />
                <span className="text-[11px] sm:text-xs mt-1 truncate max-w-full">{t('home')}</span>
              </NavLink>
              <NavLink
                to="/journal"
                className={({ isActive }) => `flex min-w-0 flex-1 flex-col items-center rounded-lg p-1 transition-colors ${isActive ? 'text-purple-700' : 'text-gray-600 hover:text-purple-600'}`}
              >
                <Calendar className="w-6 h-6" />
                <span className="text-[11px] sm:text-xs mt-1 truncate max-w-full">{t('journal')}</span>
              </NavLink>
              <NavLink
                to="/insights"
                className={({ isActive }) => `flex min-w-0 flex-1 flex-col items-center rounded-lg p-1 transition-colors ${isActive ? 'text-purple-700' : 'text-gray-600 hover:text-purple-600'}`}
              >
                <TrendingUp className="w-6 h-6" />
                <span className="text-[11px] sm:text-xs mt-1 truncate max-w-full">{t('insights')}</span>
              </NavLink>
               <NavLink
                to="/notes"
                className={({ isActive }) => `flex min-w-0 flex-1 flex-col items-center rounded-lg p-1 transition-colors ${isActive ? 'text-purple-700' : 'text-gray-600 hover:text-purple-600'}`}
              >
                <FileText className="w-6 h-6" />
                <span className="text-[11px] sm:text-xs mt-1 truncate max-w-full">{t('notes')}</span>
              </NavLink>
              <NavLink
                to="/profile"
                className={({ isActive }) => `flex min-w-0 flex-1 flex-col items-center rounded-lg p-1 transition-colors ${isActive ? 'text-purple-700' : 'text-gray-600 hover:text-purple-600'}`}
              >
                <User className="w-6 h-6" />
                <span className="text-[11px] sm:text-xs mt-1 truncate max-w-full">{t('profile')}</span>
              </NavLink>
              
            </div>
          </nav>
        )}
      </div>
      
      
    </Router>
  );
};

export default App;
