import React from 'react';
import Dashboard from './components/Dashboard';
// import LanguageSwitcher from './components/LanguageSwitcher';

const App: React.FC = () => {
    return (
        <div className="app" >
            {/* <LanguageSwitcher /> */}
            <Dashboard />
        </div>
    );
};

export default App;