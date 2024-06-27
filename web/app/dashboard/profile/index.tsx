import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchUser, updateUser, User } from "./service";
import Image from "next/image";

const UserProfilePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [id, setId] = useState<number | null>(null);
  const [user, setUser] = useState<User>({
    id: 0,
    name: "",
    last_name: "",
    email: "",
    address: "",
    phonenumer: "",
    status: "",
    gender: "",
    role: "",
  });
  const [error, setError] = useState<string | null>(null);

  // Effect to parse and set user id from query params
  useEffect(() => {
    const userIdFromQuery = searchParams.get("id");
    if (userIdFromQuery) {
      const userIdParsed = parseInt(userIdFromQuery, 10); // Parse the userId to an integer
      if (!isNaN(userIdParsed)) { // Check if the parsing was successful
        setId(userIdParsed);
      } else {
        console.error("Invalid userId in query params");
      }
    }
  }, [searchParams]);

  // Effect to fetch user data when id changes
  useEffect(() => {
    if (id !== null) {
      fetchUser(id)
        .then((userData) => setUser(userData))
        .catch((error) => setError(error.message));
    }
  }, [id]);

  // Handle change function to update user state
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (id !== null) {
      try {
        await updateUser(id, user); // Assuming updateUser function exists and updates the user
        router.push("/"); // Redirect to homepage after update
      } catch (error) {
        setError("Failed to update user");
      }
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex-auto px-4 lg:px-10 py-10 pt-0 align-middle">
      <div className="p-4 flex items-center">
        <Image
          src="/avator.png"
          alt="User Avatar"
          className="w-12 h-12 rounded-full"
          width={48}
          height={48}
        />
        <div className="ml-3">
          <h2 className="text-lg font-semibold">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.role}</p>
          <p className="text-sm text-gray-500">status {user.status}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap">
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="userId"
              >
                User ID
              </label>
              <input
                type="text"
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full focus:border-2 focus:border-gray-400"
                placeholder="User ID"
                name="userId"
                value={user.id}
                // onChange={handleChange}
                disabled
                readOnly
              />
            </div>
          </div>

          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="name"
              >
                Name
              </label>
              <input
                type="text"
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full focus:border-2 focus:border-gray-400"
                placeholder="Name"
                name="name"
                value={user.name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="last_name"
              >
                Last Name
              </label>
              <input
                type="text"
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full focus:border-2 focus:border-gray-400"
                placeholder="Last Name"
                name="last_name"
                value={user.last_name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full focus:border-2 focus:border-gray-400"
                placeholder="Email"
                name="email"
                value={user.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="address"
              >
                Address
              </label>
              <input
                type="text"
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full focus:border-2 focus:border-gray-400"
                placeholder="Address"
                name="address"
                value={user.address}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="phonenumer"
              >
                Phone number
              </label>
              <input
                type="text"
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full focus:border-2 focus:border-gray-400"
                placeholder="Phone Number"
                name="phonenumer"
                value={user.phonenumer}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="gender"
              >
                Gender
              </label>
              <select
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full focus:border-2 focus:border-gray-400"
                name="gender"
                value={user.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-green-700 border-0 text-white w-full p-3 rounded-md mt-4"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default UserProfilePage;
