"use client";

import { useState, useEffect, ChangeEvent, useRef } from "react";
import { fetchUser } from "./service"; // Ensure this imports the correct service file

interface UserDetails {
  userId: string;
  image: string;
  firstname: string;
  lastname: string;
  description: string;
  gender: string;
  serialnumber: string;
  brand: string;
  pcowner: string;
}

const Page = () => {
  const [searchQuery, setSearchQuery] = useState<string>(""); // State to hold the input query
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null); // State to hold user details
  const [loading, setLoading] = useState<boolean>(false); // State for loading indicator
  const [error, setError] = useState<string | null>(null); // State for error messages

  const inputRef = useRef<HTMLInputElement | null>(null); // Ref for input element

  useEffect(() => {
    // Autofocus on input when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      setLoading(true);
      setUserDetails(null); // Clear previous user details
      handleUserScan();
    }
  }, [searchQuery]);

  const handleUserScan = async () => {
    try {
      const user = await fetchUser(searchQuery);
      if (user) {
        setUserDetails(user); // Set user details if found
        setError(null); // Reset error state on success
        setTimeout(() => {
          // Automatically clear the input field after showing user details
          setSearchQuery("");
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 1000);
      } else {
        setUserDetails(null); // Clear user details if not found
        setError("User not found."); // Set error message
        setSearchQuery("");
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    } catch (err) {
      setUserDetails(null); // Clear user details on error
      setError("User not found."); // Display an error message
      setSearchQuery("");
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <main className="flex h-screen justify-center items-center bg-gray-100">
      <div className="w-1/2 p-4 rounded-lg shadow-md">
        <div className="flex justify-center mb-4">
          <input
            ref={inputRef}
            type="text"
            placeholder="Scan you barcode"
            value={searchQuery}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading && (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm mb-4">{error}</div>
        )}

        {!userDetails && (
          <div className="flex flex-col items-center justify-center mb-4 p-6 rounded-lg bg-blue-100 shadow-md animate-fadeIn">
            <div className="text-blue-900 font-bold text-2xl mb-2 animate-bounce">
              📡 Scan Barcode
            </div>
            <div className="text-blue-700 text-lg">
              Please scan a barcode to display user details.
            </div>
          </div>
        )}

        {userDetails && (
          <div className="rounded-lg p-6 bg-green-100 flex items-center justify-center mb-4 shadow-md w-full">
            <div className="flex-shrink-0">
              <img
                src={`http://localhost:3333/pcuser/${userDetails.image}`}
                alt={userDetails.firstname}
                width={1000}
                height={900}
                className="w-96 h-96 border border-gray-300 rounded-full"
              />
            </div>
            <div className="ml-4 flex flex-col space-y-2">
              <div className="text-gray-900 font-bold text-lg">
                ID: {userDetails.userId}
              </div>
              <div className="text-gray-900 font-bold text-lg">
                Name: {userDetails.firstname} {userDetails.lastname}
              </div>
              <div className="text-gray-900">
                Description: {userDetails.description} owner:{" "}
                {userDetails.pcowner}
              </div>
              <div className="text-gray-900">Sex: {userDetails.gender}</div>
              <div className="text-gray-900">
                Serial Number: {userDetails.serialnumber}
              </div>
              <div className="text-gray-900">Brand Name: {userDetails.brand}</div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Page;
