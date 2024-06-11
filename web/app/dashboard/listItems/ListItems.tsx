import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppContext } from '@/components/UserContext'; // Correct the import path
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

// Define roles
const ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin',
  TEACHER: 'teacher',
  SUPER_ADMIN: 'superadmin',
};

// Define the interface for your context
interface AppContextType {
  decodedToken: {
    role: string;
    // Add other properties if needed
  } | null;
}

const MainListItems: React.FC = () => {
  const router = useRouter();
  const path = usePathname(); 
  const { decodedToken } = React.useContext<AppContextType>(AppContext); // Adjust the type here
  const [userRole, setUserRole] = useState('');

  // Get user role from decoded token
  useEffect(() => {
    setUserRole(decodedToken?.role || '');
  }, [decodedToken])

  // Function to check if the current user has access to a certain route
  const hasAccess = (allowedRoles: string[]) =>
    allowedRoles.some((role) => role === userRole);

  return (
    <React.Fragment>
     
   
      {/* Roles route accessible only to super admin */}
      {userRole && userRole === ROLES.SUPER_ADMIN && (
        <React.Fragment>
          {/* <SchoolList/> */}
        </React.Fragment>
      )}
      
     
    </React.Fragment>
  );
};

export default MainListItems;
