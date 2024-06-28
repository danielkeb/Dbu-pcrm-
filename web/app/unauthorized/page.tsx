import { NextPage } from 'next';
import Link from 'next/link';

const UnauthorizedPage: NextPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
        <p className="text-lg text-gray-700">
          You do not have permission to access this page.
        </p>
        <Link href="/dashboard">Dashboard</Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
