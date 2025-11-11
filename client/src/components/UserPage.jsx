
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const UserPage = ({ entries, currentMonth }) => {
  const { t } = useTranslation();
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    alert('Profile submitted!');
  }

  return (
   <form onSubmit={handleSubmit}>
    <div class="space-y-12">
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-base/7 font-semibold text-gray-900">Profile</h2>
      <p class="mt-1 text-sm/6 text-gray-600">This information will be displayed publicly so be careful what you share.</p>

      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div class="sm:col-span-4">
          <label for="username" class="block text-sm/6 font-medium text-gray-900">Username</label>
          <div class="mt-2">
            <div class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
              <div class="shrink-0 text-base text-gray-500 select-none sm:text-sm/6">workcation.com/</div>
              <input id="username" type="text" name="username" placeholder="janesmith" class="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6" />
            </div>
          </div>
        </div>
          <button type="submit">Submit</button>

       
      </div>
    </div>
  </div>
</form>

  );
};

export default UserPage;
