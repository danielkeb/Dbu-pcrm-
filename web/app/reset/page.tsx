'use client';

import { AppContext } from '@/components/UserContext';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, FormEvent, useContext, useEffect } from 'react';

const Page = () => {
  const [forgotEmail, setForgotEmail] = useState('');
  const [password, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePasswordError, setChangePasswordError] = useState('');
  const [createNewPassword, setCreateNewPassword] = useState(false);
  const { setToken } = useContext(AppContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [shortcode, setShortcode] = useState('');
  const [resetError, setResetError] = useState('');
  const [userId, setUserId] = useState(0);

  useEffect(() => {
    const userIdFromQuery = searchParams.get('userId');
    if (userIdFromQuery) {
      const userIdParsed = parseInt(userIdFromQuery, 10);
      if (!isNaN(userIdParsed)) {
        setUserId(userIdParsed);
      } else {
        console.error('Invalid userId in query params');
      }
    }
  }, [searchParams]);

  const handleChangePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setChangePasswordError('');

    if (password !== confirmPassword) {
      setChangePasswordError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3333/verify/updatePassword?id=${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        router.push('/login');
      } else {
        try {
          const errorData = await response.json();
          setChangePasswordError(errorData.message || 'An error occurred');
        } catch (jsonError) {
          setChangePasswordError(`An error occurred with status: ${response.status}`);
        }
      }
    } catch (error) {
      setChangePasswordError('An error occurred. Please try again.');
      console.error('Error during password change:', error);
    }
  };

  const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResetError('');
  
    try {
      const response = await fetch(`http://localhost:3333/verify/shortcode?id=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotEmail, shortcode }),
      });
  
      const responseData = await response.json(); // Read response body once
  console.log(responseData);
      if (responseData.statusCode === 200) {
        console.log('Shortcode verification successful', responseData);
        setCreateNewPassword(true);
      } else if (response.status === 406) {
        setResetError(responseData.message || 'Invalid shortcode');
      } else {
        setResetError(responseData.message || 'An error occurred');
      }
    } catch (error) {
      setResetError('An error occurred. Please try again.');
      console.error('Error during shortcode verification:', error);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        {!createNewPassword && (
          <>
            <h2 className="text-2xl font-bold text-center text-blue-600">Verify Shortcode</h2>
            <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="shortcode" className="sr-only">Shortcode</label>
                  <input
                    id="shortcode"
                    name="shortcode"
                    type="text"
                    required
                    className="relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Shortcode"
                    value={shortcode}
                    onChange={(e) => setShortcode(e.target.value)}
                  />
                </div>
              </div>

              {resetError && <div className="text-red-500 text-sm">{resetError}</div>}

              <div>
                <button
                  type="submit"
                  className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md group hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Verify
                </button>
              </div>
            </form>
          </>
        )}

        {createNewPassword && (
          <>
            <h2 className="text-2xl font-bold text-center text-blue-600">Create New Password</h2>
            <form className="mt-8 space-y-6" onSubmit={handleChangePassword}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="new-password" className="sr-only">New Password</label>
                  <input
                    id="new-password"
                    name="new-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              {changePasswordError && <div className="text-red-500 text-sm">{changePasswordError}</div>}

              <div>
                <button
                  type="submit"
                  className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md group hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Change Password
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
