'use client';

export default function GuestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white text-center px-4">
      <div>
        <h1 className="text-3xl font-bold mb-4">Welcome, Guest!</h1>
        <p className="mb-4">You have limited access. Feel free to explore the app for the next 30 minutes.</p>
      </div>
    </div>
  );
}
