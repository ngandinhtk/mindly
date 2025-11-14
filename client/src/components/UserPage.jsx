
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const UserPage = ({ onLogin }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username);
      history.push('/');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  bg-gradient-to-br from-blue-50 via-purple-50 to-pink-60 ">
      <div className="w-full max-w-md">
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-3xl mx-4 px-6  py-8">
          <div className="mb-4">
            <h2 className="text-left text-3xl font-bold text-gray-900">Welcome to Mindly!</h2>
            <p className="mt-2 text-left italic text-gray-600">Let me know your name</p>
          </div>
          <div className="mb-4">
            {/* <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Username</label> */}
            <div className="flex items-center appearance-none">
              <input
                id="username"
                type="text"
                name="username"
                placeholder="janesmith"
                className="bg-zinc-100 mr-2 text-zinc-600 font-mono ring-1 ring-zinc-400 focus:ring-2 focus:ring-rose-400 outline-none duration-300 placeholder:text-zinc-600 placeholder:opacity-50 rounded-full px-4 py-2 shadow-md focus:shadow-lg focus:shadow-rose-400 dark:shadow-md dark:shadow-purple-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <button
                type="submit"
                className="bg-[#975ebd] flex flex-col items-center font-mono p-2 rounded-xl bg-purple-100 ring-2 ring-purple-400 hover:bg-[#fc76b9] duration-300 text-gray-100 font-bold rounded-full hover:shadow-lg hover:shadow-rose-400 dark:shadow-md dark:shadow-purple-500"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserPage;
