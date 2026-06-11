'use client';

import React, { useState } from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { useDeleteUserAccountMutation } from '@/redux/features/user/userApi';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/features/auth/authSlice';
import { useRouter } from 'next/navigation';

const AccountDelete = () => {
  const [showModal, setShowModal] = useState(false);
  const [deleteUserAccount, { isLoading }] = useDeleteUserAccountMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deleteUserAccount().unwrap();
      toast.success('Your account has been deleted successfully.');
      dispatch(logout());
      router.push('/');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete account.');
    } finally {
      setShowModal(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <div className="mx-auto p-6 bg-white rounded-xl shadow-md border mt-5">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Delete Account
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Once you delete your account, all your data will be permanently
            removed. This action cannot be undone.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="w-full flex items-center justify-center cursor-pointer gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
        >
          <Trash2 size={18} />
          <span>Delete Account</span>
        </button>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            {/* Close */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            {/* Icon */}
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-100 mx-auto mb-4">
              <AlertTriangle className="text-red-600" size={28} />
            </div>

            {/* Content */}
            <h2 className="text-xl font-bold text-center text-gray-800 mb-2">
              Delete Your Account?
            </h2>
            <p className="text-sm text-center text-gray-500 mb-6">
              This will permanently delete your account and all associated data.
              You will be logged out immediately.{' '}
              <span className="font-medium text-red-500">
                This cannot be undone.
              </span>
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={isLoading}
                className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccountDelete;
