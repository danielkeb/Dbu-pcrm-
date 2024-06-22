"use client";

import { AppContext } from "@/components/UserContext";
import Image from "next/image";
import Link from "next/link";
import { useContext, useState } from "react";
import MainListItems from "./listItems/ListItems";
interface Props {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { decodedToken, logout } = useContext(AppContext);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const user = {
    name: decodedToken?.name,
    avatar: "",
    jobTitle: decodedToken?.role,
  };

  return (
    <div className="flex h-screen">
      <nav
        className={`fixed h-full transition-all duration-300 bg-gray-800 text-gray-200 ${
          isDrawerOpen ? "w-[240px]" : "w-[60px]"
        } overflow-y-auto overflow-x-hidden flex flex-col gap-4 z-50 border-r border-gray-700`}
      >
        <div className="flex items-center gap-2 h-16 px-4 border-b border-gray-700">
          <button
            onClick={toggleDrawer}
            className="text-gray-200 focus:outline-none focus:text-gray-400 transition-colors duration-200"
          >
            {isDrawerOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>
          {isDrawerOpen && <h1 className="text-lg font-semibold">Dashboard</h1>}
        </div>

        <nav className="flex-grow">
          <MainListItems isOpen={isDrawerOpen} />
        </nav>

        <div className="relative border-t border-gray-700 p-4 flex w-full">
          <div
            onClick={togglePopup}
            className="flex flex-row gap-3 items-center"
          >
            <Image
              src="/avator.png"
              alt="User Avatar"
              className="w-8 h-8 rounded-full"
              width={32}
              height={32}
            />
            {isDrawerOpen && (
              <div className="ml-3">
                <h2 className="text-lg font-semibold">
                  {user.name || 'test name'}
                </h2>
                <p className="text-sm text-gray-500">
                  {user.jobTitle || "testing job title"}
                </p>
              </div>
            )}
          </div>
          {isPopupOpen && (
            <div className="absolute justify-between bottom-[100%] right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
              <div className="p-4 flex items-center">
                <Image
                  src="/avator.png"
                  alt="User Avatar"
                  className="w-12 h-12 rounded-full"
                  width={48}
                  height={48}
                />
                <div className="ml-3">
                  <h2 className="text-lg font-semibold">
                    {user.name || "John Doe"}
                  </h2>
                  <p className="text-sm text-gray-500">{user.jobTitle}</p>
                </div>
              </div>
              <div className="border-t border-gray-200">
                <ul className="divide-y divide-gray-200">
                  <li>
                    <Link href="/dashboard/profile">
                      <Link
                        className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 transition duration-200"
                        href={""}
                      >
                        Profile
                      </Link>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="p-4">
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600 transition duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2"
                    />
                  </svg>
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main
        className={`flex-1 transition-all duration-300 ${
          isDrawerOpen ? "ml-[240px]" : "ml-[60px]"
        } bg-gray-100 py-10 px-5`}
      >
        <div>{children}</div>
      </main>
    </div>
  );
}
