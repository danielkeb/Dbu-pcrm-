// UserManagePage.tsx
"use client"
import { useEffect, useState } from 'react';
import { User, fetchUsersByYear, trashUsersByYear, restoreUsersByYear } from './service';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const UserManagePage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [endYear, setEndYear] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false); // State to manage loading state of API calls

  useEffect(() => {
    if (endYear) {
      fetchUsers(); // Fetch users initially when endYear changes
    }
  }, [endYear]);

  const fetchUsers = () => {
    setLoading(true);
    fetchUsersByYear(endYear!.getFullYear().toString())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching users:', error))
      .finally(() => setLoading(false));
  };

  const handleTrash = async () => {
    if (endYear) {
      try {
        setLoading(true);
        await trashUsersByYear(endYear.getFullYear().toString());
        setUsers([]);
        alert('Users trashed successfully');
      } catch (error) {
        console.error('Error trashing users:', error);
        alert('Failed to trash users');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRestore = async () => {
    if (endYear) {
      try {
        setLoading(true);
        await restoreUsersByYear(endYear.getFullYear().toString());
        setUsers([]);
        alert('Users restored successfully');
      } catch (error) {
        console.error('Error restoring users:', error);
        alert('Failed to restore users');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Manage PC Users</h1>
      <div className="mb-4">
        <label className="mr-2">Select End Year:</label>
        <DatePicker
          selected={endYear}
          onChange={(date) => setEndYear(date)}
          dateFormat="yyyy-MM-dd"
          className="border border-gray-300 px-4 py-2 rounded"
        />
      </div>
      <div className="mb-4">
        <button
          onClick={handleTrash}
          disabled={!endYear || loading} // Disable button when no endYear selected or operation in progress
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          {loading ? 'Trashing...' : 'Trash Users'}
        </button>
        <button
          onClick={handleRestore}
          disabled={!endYear || loading} // Disable button when no endYear selected or operation in progress
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          {loading ? 'Restoring...' : 'Restore Users'}
        </button>
      </div>
      <table className="min-w-full bg-white border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-center">Name</th>
            <th className="p-4 text-center">User ID</th>
            <th className="p-4 text-center">Description</th>
            <th className="p-4 text-center">Brand</th>
            <th className="p-4 text-center">Serial Number</th>
            <th className="p-4 text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user) => (
            <tr key={user.userId} className="bg-gray-50">
              <td className="p-4 border">{user.firstname} {user.lastname}</td>
              <td className="p-4 border">{user.userId}</td>
              <td className="p-4 border">{user.description}</td>
              <td className="p-4 border">{user.brand}</td>
              <td className="p-4 border">{user.serialnumber}</td>
              <td className="p-4 border">{user.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagePage;
