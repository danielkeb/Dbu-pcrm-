import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchUser, updateUser, User } from "./service";
import Image from "next/image";

const UserProfilePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [id, setId] = useState("");
  const [successMessage, setSuccessMessage]= useState(false);
  const [errorMessage, setErrorMessage]= useState(false);
  const [user, setUser] = useState<User>({
    id: "",
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
      setId(userIdFromQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    if (id) {
      fetchUser(id).then((userData) => setUser(userData));
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
    if (id !== "") {
      try {
        console.log('User data before sending:', user); // Check the user object
        await updateUser(id, user);
        setSuccessMessage(true);
        setTimeout(() => setSuccessMessage(false), 1000);
      } catch (error) {
        setErrorMessage(true);
        setTimeout(() => setErrorMessage(false), 1000);
      }
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex-auto px-4 lg:px-10 py-10 pt-0 align-middle">
      <div className="p-4 flex items-center justify-center">
        <div className="flex items-center">
          <Image
            src="/avator.png"
            alt="User Avatar"
            className="w-24 h-24 rounded-full"
            width={100}
            height={100}
          />
          <div className="ml-3">
            <h2 className="text-lg font-bold">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.role}</p>
            <p className="text-sm text-gray-500">Status: {user.status}</p>
          </div>
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
                name="id"
                value={user.id}
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
        {successMessage && (
          <small className="text-red-500">Profile updated successfully</small>
        )}
        {errorMessage && (
          <small className="text-red-500">Profile update failed</small>
        )}
        
        <button
          type="submit"
          className="bg-blue-500 border-0 text-white w-1/2 mx-auto p-3 rounded-md mt-4 block"
        >
          Update
        </button>
      </form>
      
    </div>
  );
};

export default UserProfilePage;
