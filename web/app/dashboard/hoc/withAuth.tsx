"use client"; // Ensure this file uses client components if necessary

import React, { useEffect } from 'react';
import { useAuth } from '@/components/authcontext';
import { useRouter } from 'next/navigation';

type AllowedRoles = 'admin' | 'security';

export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles: AllowedRoles[]
) => {
  const WithAuth: React.FC<P> = (props) => {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated) {
        router.replace('/login');
      } else if (!allowedRoles.includes(user?.role as AllowedRoles)) {
        router.replace('/unauthorized');
      }
    }, [isAuthenticated, user, allowedRoles, router]); // Added missing dependencies

    if (!isAuthenticated || !allowedRoles.includes(user?.role as AllowedRoles)) {
      return <div>Loading...</div>;
    }

    return <Component {...(props as P)} />;
  };

  return WithAuth;
};

export default withAuth;
