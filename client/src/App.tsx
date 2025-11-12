import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import UserPage from './components/UserPage';
// import LanguageSwitcher from './components/LanguageSwitcher';

const App: React.FC = () => {
    return (
        <Router>
            <div className="app" >
                {/* <LanguageSwitcher /> */}
                <Switch>
                    <Route exact path="/" component={UserPage} />
                    <Route path="/dashboard" component={Dashboard} />
                </Switch>
            </div>
        </Router>
    );
};

export default App;