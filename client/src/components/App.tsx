import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Home, User, Calendar } from 'lucide-react';
import Dashboard from './Dashboard';
import Profile from './Profile';
import Journal from './Journal';
import '../styles/index.css';
import { useTranslation } from 'react-i18next';
import UserPage from './UserPage';

const App: React.FC = () => {
  const { t } = useTranslation();
  const [username, setUsername] = React.useState<string | null>(localStorage.getItem('username'));

  const handleLogin = (name: string) => {
    localStorage.setItem('username', name);
    setUsername(name);
  };

  return (
    <Router>
      <div className="app h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-60">
        {username ? (
          <>
            <Switch>
              <Route exact path="/" component={Dashboard} />
              <Route path="/profile" component={Profile} />
              <Route path="/journal" component={Journal} />
            </Switch>

            {/* Navigation Bar */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-1">
              <div className="max-w-2xl mx-auto flex justify-around">
                <Link
                  to="/"
                  className="flex flex-col items-center p-2 text-gray-600 hover:text-purple-600 transition-colors"
                >
                  <Home className="w-6 h-6" />
                  <span className="text-xs mt-1">{t('home')}</span>
                </Link>
                <Link
                  to="/journal"
                  className="flex flex-col items-center p-2 text-gray-600 hover:text-purple-600 transition-colors"
                >
                  <Calendar className="w-6 h-6" />
                  <span className="text-xs mt-1">{t('journal')}</span>
                </Link>
                <Link
                  to="/profile"
                  className="flex flex-col items-center p-2 text-gray-600 hover:text-purple-600 transition-colors"
                >
                  <User className="w-6 h-6" />
                  <span className="text-xs mt-1">{t('profile')}</span>
                </Link>
              </div>
            </nav>
          </>
        ) : (
          <UserPage onLogin={handleLogin} />
        )}
      </div>
    </Router>
  );
};

export default App;
