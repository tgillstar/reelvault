'use client';

import React from 'react';

export default function ProfileModal({ user, userDoc, onClose }) {
  const isLoading = !userDoc;
  const createdAt = userDoc?.createdAt?.toDate().toLocaleString() || 'Unknown';
  const lastLogin = userDoc?.lastLogin?.toDate().toLocaleString() || 'Unknown';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-md p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">My Profile</h2>

        {isLoading ? (
          <p className="text-gray-600">Loading profile...</p>
        ) : (
          <div className="text-gray-800 space-y-2">
            <p><strong>Email:</strong> {user?.email || 'Not available'}</p>
            <p><strong>Account Created:</strong> {createdAt}</p>
            <p><strong>Last Login:</strong> {lastLogin}</p>
            <p className="text-sm text-gray-500 mt-2">
              To request login changes, please contact the admin.
            </p>
          </div>
        )}

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
