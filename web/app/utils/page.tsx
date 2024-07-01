import { useAuth } from '@/components/authcontext';
import { useRouter } from 'next/router';
import { useEffect } from 'react'; // Adjust the import path as per your project structure

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
    }, [isAuthenticated, user]);

    if (!isAuthenticated || !allowedRoles.includes(user?.role as AllowedRoles)) {
      return <div>Loading...</div>; // Or show a loading spinner or unauthorized component
    }

    return <Component {...props as P} />;
  };

  return WithAuth;
};
