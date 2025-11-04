import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Home, User, Calendar } from 'lucide-react';
import Dashboard from './Dashboard';
import Profile from './Profile';
import Journal from './Journal';
import '../styles/index.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route path="/profile" component={Profile} />
          <Route path="/journal" component={Journal} />
        </Switch>

        {/* Navigation Bar */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2">
          <div className="max-w-2xl mx-auto flex justify-around">
            <Link 
              to="/" 
              className="flex flex-col items-center p-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <Home className="w-6 h-6" />
              <span className="text-xs mt-1">Trang chủ</span>
            </Link>
            <Link 
              to="/journal" 
              className="flex flex-col items-center p-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <Calendar className="w-6 h-6" />
              <span className="text-xs mt-1">Nhật ký</span>
            </Link>
            <Link 
              to="/profile" 
              className="flex flex-col items-center p-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <User className="w-6 h-6" />
              <span className="text-xs mt-1">Hồ sơ</span>
            </Link>
          </div>
        </nav>
      </div>
    </Router>
  );
};

export default App;
