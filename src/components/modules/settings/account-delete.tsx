import React from 'react';
import { Trash2 } from 'lucide-react';

const AccountDelete = () => {
  return (
    <div className="mx-auto p-6 bg-white rounded-xl shadow-md border mt-5">
      <button className="w-full flex items-center justify-center cursor-pointer gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200">
        <span>Delete Account</span>
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default AccountDelete;
