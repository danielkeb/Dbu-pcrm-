'use client';  // Add this directive at the top

import * as React from 'react';
import { useEffect, useLayoutEffect, useContext, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // use next/navigation instead of next/router
import axios from 'axios';
import Image from 'next/image';
import { AppContext } from '@/components/UserContext';
import MainListItems from '../listItems/ListItems';

interface MainProps {
  children: React.ReactNode;
}

const Main: React.FC<MainProps> = ({ children }) => {
  const [open, setOpen] = useState(true);
  const { decodedToken, logout } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // useLayoutEffect(() => {
  //   if (!decodedToken) {
  //     router.push('/login');
  //   } else if (decodedToken?.status === 'inactive') {
  //     logout();
  //   }
  // }, [decodedToken, logout, router]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const status = await axios.get(`http://localhost:3333/auth/status/${decodedToken?.sub}`);
  //       if (status.data.status === 'inactive') {
  //         logout();
  //       }
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };
  //   if (decodedToken) {
  //     fetchData();
  //   }
  // }, [decodedToken, logout]);

  const user = {
    name: decodedToken?.first_name,
    avatar: '',
    jobtitle: decodedToken?.role,
  };

  return (
    <div className="flex h-screen">
      <nav className={`fixed h-full transition-all duration-300 bg-gray-800 text-gray-200 ${open ? 'w-[240px]' : 'w-[60px]'} overflow-y-auto overflow-x-hidden z-50 border-r border-gray-700`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
          <button onClick={toggleDrawer} className="text-gray-200 focus:outline-none focus:text-gray-400 transition-colors duration-200">
            {open ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
          {open && <h1 className="text-lg font-semibold">Dashboard</h1>}
          <div className="relative flex items-center w-full">
            <button onClick={handleOpen} className="focus:outline-none">
              <Image src="/avator.png" alt="User Avatar" className="w-8 h-8 rounded-full" width={32} height={32} />
            </button>
            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
                <div className="p-4 flex items-center">
                  <Image src="/avator.png" alt="User Avatar" className="w-12 h-12 rounded-full" width={48} height={48} />
                  <div className="ml-3">
                    <h2 className="text-lg font-semibold">{user.name}</h2>
                    <p className="text-sm text-gray-500">{user.jobtitle}</p>
                  </div>
                </div>
                <div className="border-t border-gray-200">
                  <ul className="divide-y divide-gray-200">
                    <li>
                      <Link href="/dashboard/profile">
                        <Link className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 transition duration-200" href={''}>Profile</Link>
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="p-4">
                  <button onClick={logout} className="w-full flex items-center justify-center py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600 transition duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2" />
                    </svg>
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <nav className="mt-4">
          <MainListItems />
        </nav>
      </nav>
      
      <main className={`flex-1 transition-all duration-300 ${open ? 'ml-[240px]' : 'ml-[60px]'} bg-gray-100 py-10 px-5`}>
        <div>{children}</div>
      </main>
    </div>
  );
};

export default Main;
