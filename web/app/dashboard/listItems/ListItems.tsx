
"use client"
import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation'; // Import useClient
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '@/components/UserContext'; // Correct the import path
import Link from 'next/link';
import { AcademicCapIcon, AnnotationIcon, ArchiveIcon } from '@heroicons/react/solid';
const MainListItems: React.FC = () => {
  // Use useClient hook to ensure component runs on client side
  
  const router = useRouter();
  const path = usePathname(); 
  const { decodedToken } = useContext(AppContext);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    setUserRole(decodedToken?.role || '');
  }, [decodedToken]);

  const hasAccess = (allowedRoles: string[]) =>
    allowedRoles.some((role) => role === userRole);

  return (
    <React.Fragment>

<Link href="/dashboard">
        <div className={`${path.startsWith('/dashboard') ? 'bg-green-500 hover:bg-blue-700 text-white' : ''} flex justify-center items-center pb-2 pt-2 pl-4 hover:bg-gray-100 w-full`}>
        
          
  <span className={`${path.startsWith('/dashboard') ? 'text-white' : ''}`}>
    Dashboard
  </span>

        </div>
      </Link>
  <Link href="/dashboard/pcuser">
        <div className={`${path.startsWith('/dashboard/pcuser') ? 'bg-green-500 hover:bg-blue-700 text-white' : ''} flex justify-center items-center pb-2 pt-2 pl-4 hover:bg-gray-100 w-full`}>
        
          
  <span className={`${path.startsWith('/dashboard/pcuser') ? 'text-white' : ''}`}>
    School Directors
  </span>

        </div>
      </Link>
      <Link href="/dashboard/security">
        <div className={`${path.startsWith('/dashboard/security') ? 'bg-green-500 hover:bg-blue-700 text-white' : ''} flex justify-center items-center pb-2 pt-2 pl-4 hover:bg-gray-100 w-full`}>
        
          
  <span className={`${path.startsWith('/dashboard/security') ? 'text-white' : ''}`}>
    Security
  </span>

        </div>
      </Link>
    </React.Fragment>
  );
};

export default MainListItems;
