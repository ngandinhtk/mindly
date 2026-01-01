import React from 'react';  
import { BrowserRouter as Router, Routes, Route, Link, Navigate, Outlet } from 'react-router-dom';
import { Home, User, Calendar, TrendingUp, Heart, FileText, Menu, X } from 'lucide-react';
import Dashboard from './Dashboard';
import Profile from './Profile';
import Journal from './Journal';
import '../styles/index.css';
import { useTranslation } from 'react-i18next';
import UserPage from './UserPage';
import Insight from './Insight';
import Notes from './Notes';
import LanguageSwitcher from './LanguageSwitcher';

const PrivateRoutes = () => {
  const username = localStorage.getItem('username');
  return username ? <Outlet /> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  const { t } = useTranslation();
  const [username, setUsername] = React.useState<string | null>(localStorage.getItem('username'));
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogin = (name: string) => {
    localStorage.setItem('username', name);
    setUsername(name);
  };

  return (
    <Router>
      <div className="app h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-60">
        {/* {username && ( */}
          <>
          <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Mindly
                  </h1>
                </div>
                    <div className="flex items-center space-x-2 ml-auto">
                    <LanguageSwitcher />
                    {/* <button
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className="p-2 text-gray-600 bg-white hover:text-purple-600 transition-colors md:hidden"
                    >
                      {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button> */}
                    </div>
              </div>


               
            </div>
          </header>
          {isMenuOpen && (
            <div className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden">
              <nav className="flex flex-col space-y-4">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-4 p-3 hover:bg-purple-50 rounded-xl text-gray-600 hover:text-purple-600 transition-all">
                  <Home className="w-6 h-6" />
                  <span className="font-medium">{t('home')}</span>
                </Link>
                <Link to="/journal" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-4 p-3 hover:bg-purple-50 rounded-xl text-gray-600 hover:text-purple-600 transition-all">
                  <Calendar className="w-6 h-6" />
                  <span className="font-medium">{t('journal')}</span>
                </Link>
                <Link to="/insights" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-4 p-3 hover:bg-purple-50 rounded-xl text-gray-600 hover:text-purple-600 transition-all">
                  <TrendingUp className="w-6 h-6" />
                  <span className="font-medium">{t('insights')}</span>
                </Link>
                <Link to="/notes" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-4 p-3 hover:bg-purple-50 rounded-xl text-gray-600 hover:text-purple-600 transition-all">
                  <FileText className="w-6 h-6" />
                  <span className="font-medium">{t('notes')}</span>
                </Link>
                <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-4 p-3 hover:bg-purple-50 rounded-xl text-gray-600 hover:text-purple-600 transition-all">
                  <User className="w-6 h-6" />
                  <span className="font-medium">{t('profile')}</span>
                </Link>
              </nav>
            </div>
          )}
          </>
        {/* )} */}
           
        <main className="flex-grow overflow-y-auto pb-20 max-w-3xl mx-auto w-full">
          <Routes>
            <Route path="/login" element={<UserPage onLogin={handleLogin} />} />
            <Route element={<PrivateRoutes />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/journal"element={<Journal />} />
              <Route path="/insights" element={<Insight />} />
              <Route path="/notes" element={<Notes />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>

        {username && (
          <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-1">
            <div className="max-w-2xl mx-auto flex justify-around">
              <Link
                to="/"
                className="flex flex-col items-center p-1 text-gray-600 hover:text-purple-600 transition-colors"
              >
               
                <Home className="w-6 h-6" />
                <span className="text-xs mt-1">{t('home')}</span>
              </Link>
              <Link
                to="/journal"
                className="flex flex-col items-center p-1 text-gray-600 hover:text-purple-600 transition-colors"
              >
                <Calendar className="w-6 h-6" />
                <span className="text-xs mt-1">{t('journal')}</span>
              </Link>
              <Link
                to="/insights"
                className="flex flex-col items-center p-1 text-gray-600 hover:text-purple-600 transition-colors"
              >
                <TrendingUp className="w-6 h-6" />
                <span className="text-xs mt-1">{t('insights')}</span>
              </Link>
               <Link
                to="/notes"
                className="flex flex-col items-center p-1 text-gray-600 hover:text-purple-600 transition-colors"
              >
                <FileText className="w-6 h-6" />
                <span className="text-xs mt-1">{t('notes')}</span>
              </Link>
              <Link
                to="/profile"
                className="flex flex-col items-center p-1 text-gray-600 hover:text-purple-600 transition-colors"
              >
                <User className="w-6 h-6" />
                <span className="text-xs mt-1">{t('profile')}</span>
              </Link>
              
            </div>
          </nav>
        )}
      </div>
      
      
    </Router>
  );
};

export default App;
