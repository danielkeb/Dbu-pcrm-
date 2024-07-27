"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { fetchUser } from "./service"; // Ensure this imports the correct service file

interface UserDetails {
  image: string;
  firstname: string;
  lastname: string;
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
      setError("User Not found.");
      setUserDetails(null); // Clear user details on error
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <main className="mb-4 items-center">
      <div className="text-center">
        <div className="mb-4 bg-slate-600">
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
         <div className="w-auto rounded-lg p-6 bg-green-100 flex items-center justify-start h-auto">
         <div className="flex-shrink-0">
           <img
             src={`http://localhost:3333/pcuser/${userDetails.image}`}
             alt={userDetails.firstname}
             className="w-52 h-52 border border-gray-300"
           />
         </div>
         <div className="ml-10 flex flex-col space-y-2">
           <div className="text-gray-900 font-bold text-lg">
             Name: {userDetails.firstname} {userDetails.lastname}
           </div>
           <div className="text-gray-900">Description: {userDetails.description}</div>
           <div className="text-gray-900">Sex: {userDetails.gender}</div>
           <div className="text-gray-900">Serial Number: {userDetails.serialnumber}</div>
           <div className="text-gray-900">Brand Name: {userDetails.brand}</div>
           {/* <div className="text-gray-100">Status: {userDetails.status}</div> */}
         </div>
       </div>
       
        )}
      </div>
    </main>
  );
};

export default Page;
