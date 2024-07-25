"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { fetchUser } from "./service"; // Ensure this imports the correct service file

interface UserDetails {
  image: string;
  firstname: string;
  description: string;
  gender: string;
  serialnumber: string;
  brand: string;
}

const Page = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      setLoading(true);
      handleUserScan();
    } else {
      setUserDetails(null); // Clear user details if input is empty
      setError(null);
    }
  }, [searchQuery]);

  const handleUserScan = async () => {
    try {
      const user = await fetchUser(searchQuery);
      setUserDetails(user);
      setError(null); // Reset error state on success
    } catch (err) {
      setError("Unable to fetch user data. Please try again.");
      setUserDetails(null); // Clear user details on error
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <main className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by User Id"
            value={searchQuery}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
            className="border border-gray-300 px-4 py-2 rounded mr-2"
          />
        </div>

        {loading && (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && <div className="text-red-500">{error}</div>}

        {userDetails && (
          <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
            <img src={`http://localhost:3333/pcuser/${userDetails.image}`} alt={userDetails.firstname} className="w-32 h-32" />
            <div className="text-lg font-semibold">{userDetails.description}</div>
            <div className="text-gray-600">{userDetails.gender}</div>
            <div className="text-gray-600">
              Serial Number: {userDetails.serialnumber}
            </div>
            <div className="text-gray-600">
              Brand Name: {userDetails.brand}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Page;
