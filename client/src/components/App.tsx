import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect, RouteProps, useLocation } from 'react-router-dom';
import { Home, User, Calendar, TrendingUp, Heart, LogOut } from 'lucide-react';
import Dashboard from './Dashboard';
import Profile from './Profile';
import Journal from './Journal';
import '../styles/index.css';
import { useTranslation } from 'react-i18next';
import UserPage from './UserPage';
import Insight from './Insight';
import LanguageSwitcher from './LanguageSwitcher';

interface PrivateRouteProps extends RouteProps {
  component: React.ComponentType<any>;
  username: string | null;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, username, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      username ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location },
          }}
        />
      )
    }
  />
);


const App: React.FC = () => {
  const { t } = useTranslation();
  const [username, setUsername] = React.useState<string | null>(localStorage.getItem('username'));

  const handleLogin = (name: string) => {
    localStorage.setItem('username', name);
    setUsername(name);
  };
   const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
  
    const handleLogout = () => {
      setShowLogoutConfirm(true);
    
    };
  
    const handleLogoutConfirm = () => {
      setShowLogoutConfirm(false);
      localStorage.removeItem('username');
      window.location.reload();
    };


  const confirmLogout = () => {
    localStorage.removeItem('username');
    window.location.href = '/';
  }

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  }

  return (
    <Router>
      <div className="app h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-60">
        {username && (
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
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-[30px] h-[30px] p-2 text-white font-bold hover:text-red-600 transition-colors"
                      title={t('logout')}
                      >
                      <LogOut className="w-6 h-6" />
                    </button>
                    </div>
              </div>


               
            </div>
          </header>
        )}
           
        <main className="flex-grow overflow-y-auto pb-20 max-w-3xl mx-auto w-full">
          <Switch>
            <Route path="/login">
              <UserPage onLogin={handleLogin} />
            </Route>
            <PrivateRoute exact path="/" component={Dashboard} username={username} />
            <PrivateRoute path="/profile" component={Profile} username={username} />
            <PrivateRoute path="/journal" component={Journal} username={username} />
            <PrivateRoute path="/insights" component={Insight} username={username} />
            <Redirect from="*" to="/" />
          </Switch>
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


      
 {/* Logout Confirmation Popup */}
      {showLogoutConfirm && (
        <div 
          className="fixed w-3xs inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300"
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

      
    </Router>
  );
};

export default App;
