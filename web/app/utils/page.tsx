"use client";

import React from 'react'; // Adjust the import path according to your file structure
//import { AllowedRoles } from '@/types'; // Import the type from your types file
import withAuth from '../dashboard/hoc/withAuth';

// Create the page component
const UtilsPage: React.FC = () => {
  return <div>Welcome to the Utils Page!</div>;
};
export type AllowedRoles = 'admin' | 'security';

// Define the roles that are allowed to access this page
const allowedRoles: AllowedRoles[] = ['admin', 'security']; // Ensure the type is correct

// Export the page component wrapped with the withAuth HOC
export default withAuth(UtilsPage, allowedRoles);
