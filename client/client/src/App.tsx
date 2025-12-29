import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import UserPage from './components/UserPage';
// import LanguageSwitcher from './components/LanguageSwitcher';

const App: React.FC = () => {
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    const handleLogin = (name: string) => {
        localStorage.setItem('username', name);
        setUsername(name);
    };

    return (
        <Router>
            <div className="app" >
                {/* <LanguageSwitcher /> */}
                {username ? (
                    <Dashboard />
                ) : (
                    <UserPage onLogin={handleLogin} />
                )}
            </div>
        </Router>
    );
};

export default App;