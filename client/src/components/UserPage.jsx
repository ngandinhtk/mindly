
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const UserPage = ({ onLogin }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      const users = JSON.parse(localStorage.getItem('mindly_users') || '{}');

      if (users[username]) {
        if (users[username] === password) {
          localStorage.setItem('username', username);
          onLogin(username, password);
          navigate('/dashboard');
        } else {
          setShowError(true);
        }
      } else {
        users[username] = password;
        localStorage.setItem('mindly_users', JSON.stringify(users));
        localStorage.setItem('username', username);
        onLogin(username, password);
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-full bg-[none]">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-3xl mx-4 px-6 py-8">
        <div className="mb-4">
          <h2 className="text-left text-3xl font-bold text-gray-900">Welcome to Mindly!</h2>
          <p className="mt-2 text-left italic text-gray-600">{t('let_me_know_your_name')}</p>
        </div>
        <div className="mb-4 ">
          {/* <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Username</label> */}
          <div className="flex flex-col py-2 items-center justify-center appearance-none">
            <input
              id="username"
              type="text"
              name="username"
              placeholder="janesmith"
              className="bg-zinc-100  w-full mr-2 text-zinc-600 font-mono ring-1 ring-zinc-400 focus:ring-2 focus:ring-rose-400 outline-none duration-300 placeholder:text-zinc-600 placeholder:opacity-50 rounded-full px-4 py-2 shadow-md focus:shadow-lg focus:shadow-rose-400 dark:shadow-md dark:shadow-purple-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
              <input
              id="password"
              type="password"
              name="password"
              placeholder="password"
              className=" my-4 bg-zinc-100  w-full mr-2 text-zinc-600 font-mono ring-1 ring-zinc-400 focus:ring-2 focus:ring-rose-400 outline-none duration-300 placeholder:text-zinc-600 placeholder:opacity-50 rounded-full px-4 py-2 shadow-md focus:shadow-lg focus:shadow-rose-400 dark:shadow-md dark:shadow-purple-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="flex px-6 flex-col items-center font-mono p-2 rounded-1xl bg-purple-600 ring-2 ring-purple-400 hover:bg-[#fc76b9] duration-300 text-white font-bold rounded-full hover:shadow-lg hover:shadow-rose-400 dark:shadow-md dark:shadow-purple-500"
            >
              Enter
            </button>
          </div>
        </div>
      </form>


      {/* Error Popup */}
      {showError && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300"
          onClick={() => setShowError(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl p-8 w-4/5 max-w-xl transform transition-all duration-300 scale-100 animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-red-500 mb-4">{t('login_error')}</h3>
            <p className="text-gray-600 mb-6">{t('pass_confirmation') || 'Mật khẩu không đúng'}</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowError(false)}
                className="px-6 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
              >
                {t('ok')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;
  