'use client';

import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">403 - Access Denied</h1>
      <p className="mb-6 text-lg">
        You don’t have permission to view this page.
      </p>
      <button
        onClick={() => router.back()}
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded"
      >
        Go Back
      </button>
    </div>
  );
}
