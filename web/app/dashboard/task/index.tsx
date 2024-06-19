import { useState, useEffect, ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchUsers, deleteUser, User } from "./service";

const UserListPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [perPage, setPerPage] = useState<number>(5);
  const router = useRouter();

  useEffect(() => {
    fetchUsers(searchQuery, perPage).then(setUsers);
  }, [searchQuery, perPage]);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      await deleteUser(id);
      setUsers(await fetchUsers(searchQuery, perPage));
    }
  };

  const handleSearch = () => {
    fetchUsers(searchQuery, perPage).then(setUsers);
  };


  return (
    <div className="p-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by User Id"
          value={searchQuery}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded mr-2"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Search
        </button>
      </div>
      <div className="mb-4">
        <select
          value={perPage}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setPerPage(Number(e.target.value))}
          className="border border-gray-300 px-4 py-2 rounded text-end"
        >
          {[5, 10, 25, 50, 100].map((value) => (
            <option key={value} value={value}>
              {value} items per page
            </option>
          ))}
        </select>
      </div>
      <table className="min-w-full bg-white border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-center">Name</th>
            <th className="p-4 text-center">User ID</th>
            <th className="p-4 text-center">Description</th>
            <th className="p-4 text-center">Brand</th>
            <th className="p-4 text-center">Serial Number</th>
            <th className="p-4 text-center">Image</th>
            <th className="p-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="bg-gray-50">
              <td className="p-4 border">{user.firstname} {user.lastname}</td>
              <td className="p-4 border">{user.userId}</td>
              <td className="p-4 border">{user.description}</td>
              <td className="p-4 border">{user.brand}</td>
              <td className="p-4 border">Serial {user.serialnumber}</td>
              <td className="p-4 border">
                <img src={`http://localhost:3333/pcuser/${user.image}`} alt={user.firstname} className="w-24 h-24" />
              </td>
              <td className="p-4 border">
                <Link href={`/dashboard/task/update?id=${user.id}`}>
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Edit
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserListPage;
