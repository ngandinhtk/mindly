import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Home, User, Calendar, TrendingUp, Heart } from 'lucide-react';
import Dashboard from './Dashboard';
import Profile from './Profile';
import Journal from './Journal';
import '../styles/index.css';
import { useTranslation } from 'react-i18next';
import UserPage from './UserPage';
import Insight from './Insight';

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
        
             {/* Header */}
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
                    
                
                  </div>
                  
                 
                </div>
              </header>
           
        {username ? (
          <>
            <Switch>
              <Route exact path="/" component={Dashboard} />
              <Route path="/profile" component={Profile} />
              <Route path="/journal" component={Journal} />
              <Route path="/insights" component={Insight} />
            </Switch>

            {/* Navigation Bar */}
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
                  to="/profile"
                  className="flex flex-col items-center p-1 text-gray-600 hover:text-purple-600 transition-colors"
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
