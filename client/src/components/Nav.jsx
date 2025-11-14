import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import '../styles/index.css';
import Dashboard from './Dashboard';
import Profile from './Profile';
import { Home, CircleUserRound  } from 'lucide-react';

const App = () => {
  return (
    <Router>
      <div className="app min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-60">
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route path="/profile" component={Profile} />
            
        </Switch>

        {/* Navigation Bar */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-1">
          <div className="max-w-2xl mx-auto flex justify-around">
            <Link 
              to="/" 
              className="flex flex-col items-center  text-gray-600 hover:text-purple-600 transition-colors"
            >
              <Home className="w-6 h-6" />
              <span className="text-xs mt-1">Trang chủ</span>
            </Link>
            <Link 
              to="/profile" 
              className="flex flex-col items-center  text-gray-600 hover:text-purple-600 transition-colors"
            >
              <CircleUserRound className="w-6 h-6" />
              <span className="text-xs mt-1">Hồ sơ</span>
            </Link>
          </div>
        </nav>
      </div>
    </Router>
  );
};

export default App;