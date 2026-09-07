
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { readJson, writeJson } from '../utils/safeStorage';

const UserPage = ({ onLogin }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hashPassword = async (value) => {
    const encodedPassword = new TextEncoder().encode(value);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', encodedPassword);
    return Array.from(new Uint8Array(hashBuffer))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username.trim() && password.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        const users = readJson('mindly_users', {});
        const normalizedUsername = username.trim();
        const passwordHash = await hashPassword(password);
        const storedPassword = users[normalizedUsername];

        if (storedPassword) {
          const isLegacyPassword = storedPassword.length !== 64;
          const isValidPassword = isLegacyPassword
            ? storedPassword === password
            : storedPassword === passwordHash;

          if (isValidPassword) {
            users[normalizedUsername] = passwordHash;
            writeJson('mindly_users', users);
            localStorage.setItem('username', normalizedUsername);
            onLogin(normalizedUsername);
            navigate('/dashboard');
          } else {
            setShowError(true);
            setIsSubmitting(false);
          }
        } else {
          users[normalizedUsername] = passwordHash;
          writeJson('mindly_users', users);
          localStorage.setItem('username', normalizedUsername);
          onLogin(normalizedUsername);
          navigate('/dashboard');
        }
      } catch (error) {
        setShowError(true);
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] w-full flex items-center justify-center px-4 py-8">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white shadow-md rounded-3xl px-6 py-8 sm:px-8">
        <div className="mb-4">
          <h2 className="text-left text-3xl font-bold text-gray-900">{t('welcome')}</h2>
          <p className="mt-2 text-left italic text-gray-600">{t('let_me_know_your_name')}</p>
          <p className="mt-2 text-left text-xs text-gray-400">{t('passcode_storage_notice')}</p>
        </div>
        <div className="mb-4 ">
          <div className="flex flex-col py-2 items-center justify-center appearance-none">
            <label htmlFor="username" className="sr-only">{t('username')}</label>
            <input
              id="username"
              type="text"
              name="username"
              placeholder={t('username_placeholder')}
              autoComplete="username"
              required
              className="bg-zinc-100  w-full mr-2 text-zinc-600 font-mono ring-1 ring-zinc-400 focus:ring-2 focus:ring-rose-400 outline-none duration-300 placeholder:text-zinc-600 placeholder:opacity-50 rounded-full px-4 py-2 shadow-md focus:shadow-lg focus:shadow-rose-400 dark:shadow-md dark:shadow-purple-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
              <input
              id="password"
              type="password"
              name="password"
              placeholder={t('password_placeholder')}
              autoComplete="current-password"
              required
              className=" my-4 bg-zinc-100  w-full mr-2 text-zinc-600 font-mono ring-1 ring-zinc-400 focus:ring-2 focus:ring-rose-400 outline-none duration-300 placeholder:text-zinc-600 placeholder:opacity-50 rounded-full px-4 py-2 shadow-md focus:shadow-lg focus:shadow-rose-400 dark:shadow-md dark:shadow-purple-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex px-6 flex-col items-center font-mono p-2 rounded-1xl bg-purple-600 ring-2 ring-purple-400 hover:bg-[#fc76b9] duration-300 text-white font-bold rounded-full hover:shadow-lg hover:shadow-rose-400 dark:shadow-md dark:shadow-purple-500"
            >
              {t('enter')}
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
  