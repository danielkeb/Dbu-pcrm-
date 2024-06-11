import * as React from 'react';
import { useEffect, useLayoutEffect, useContext, useState, useRef } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import axios from 'axios';
import { SchoolOutline, FingerPrintOutline
  } from 'react-ionicons';
import MainListItems from '../listItems/ListItems';
import Image from 'next/image';
import { AppContext } from '@/components/UserContext';

const drawerWidth = 240;

interface MainProps {
  children: React.ReactNode;
}

const Main: React.FC<MainProps> = ({ children }) => {
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { decodedToken, logout } = useContext(AppContext);
  const ref = useRef<any>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOpen = (): void => {
    setIsOpen(true);
  };

  const handleClose = (): void => {
    setIsOpen(false);
  };

  useLayoutEffect(() => {
    if (!decodedToken) {
      redirect("/login");
    }
    if (decodedToken.status === "inactive") {
      logout();
    }
  }, [decodedToken, logout]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const status = await axios.get(`http://localhost:3333/auth/status/${decodedToken?.sub}`);
        if (status.data.status === "inactive") {
          logout();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [decodedToken, logout]);

  const user = {
    name: decodedToken?.first_name,
    avatar: '',
    jobtitle: decodedToken?.role
  };

  return (
    <>
      <div className="flex">
        <aside className={`fixed h-full transition-all duration-300 bg-gray-800 text-gray-200 ${open ? 'w-[240px]' : 'w-[60px]'} overflow-y-auto overflow-x-hidden z-50 border-r border-gray-700`}>
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
            <button onClick={toggleDrawer} className="text-gray-200 focus:outline-none focus:text-gray-400 transition-colors duration-200">
              {open ? <div className="w-6 h-6"/> : <div className="w-6 h-6" />}
            </button>
            <h1 className="text-lg font-semibold">Dashboard</h1>
            <div className="flex items-center">
              <button onClick={handleOpen} className="focus:outline-none">
                <Image src="/user-avatar.jpg" alt="User Avatar" className="w-8 h-8 rounded-full" />
              </button>
              <div
                open={isOpen}
                anchorEl={ref.current}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                className="ring-1 ring-gray-800"
              >
                <div className="bg-white w-60 shadow-lg rounded-lg">
                  <div className="p-4 flex items-center">
                    <Image src="/user-avatar.jpg" alt="User Avatar" className="w-12 h-12 rounded-full" />
                    <div className="ml-3">
                      <h2 className="text-lg font-semibold">{user.name}</h2>
                      <p className="text-sm text-gray-500">{user.jobtitle}</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200">
                    <ul className="divide-y divide-gray-200">
                      <li>
                        <Link href="/dashboard/profile">
                          <a className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 transition duration-200">Profile</a>
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="p-4">
                    <button onClick={logout} className="w-full flex items-center justify-center py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600 transition duration-200">
                      <div className="w-5 h-5 mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <nav className="mt-4">
            <MainListItems />
          </nav>
        </aside>
        <main className={`flex-1 transition-all duration-300 ${open ? 'ml-[240px]' : 'ml-[60px]'} bg-gray-100 py-10 px-5`}>
          <div>{children}</div>
        </main>
      </div>
    </>
  );
};

export default Main;
