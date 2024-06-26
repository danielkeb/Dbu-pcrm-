'use client';

import { AppContext } from '@/components/UserContext';
import { useRouter } from 'next/navigation';
import React, { useState, FormEvent, useContext } from 'react';
import { useAppContext } from '../appContext';
import jwt, { JwtPayload } from "jsonwebtoken";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [forgotPassword, setForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [shortcodeSent, setShortcodeSent] = useState(false);
  const [userId, setUserId] = useState('');
  // const { setToken } = useContext(AppContext);
  const router = useRouter();
  
  const { token, setToken, decodedToken, setDecodedToken } = useContext(AppContext);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const response = await fetch('http://localhost:3333/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      const new_token = data.access_token;
      localStorage.setItem('authToken', new_token);


      // console.log("Here is your token", new_token, response);
     
      setToken(new_token);
      const dec=jwt.decode(new_token); 
      
     setDecodedToken(dec)
      console.log('Login successful here is ...', token);
      router.push("/dashboard");
    } else {
      const errorData = await response.json();
      setError(errorData.message || 'An error occurred');
    }
  };

  const handleForgotPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setForgotError('');

    const response = await fetch('http://localhost:3333/auth/forget/shortcode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: forgotEmail }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Forgot password request successful', data);
      setUserId(data.userId);
      router.push(`/reset?userId=${data.userId}`);
      setShortcodeSent(true);
    } else {
      const errorData = await response.json();
      setForgotError(errorData.message || 'An error occurred');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        {!forgotPassword ? (
          <>
            <h2 className="text-2xl font-bold text-center text-blue-600">Login</h2>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email-address" className="sr-only">Email address</label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="relative block w-full px-3 py-2 border border-gray-300 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="relative block w-full px-3 py-2 border border-gray-300 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && <div className="text-red-500 text-sm">{error}</div>}

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <button
                    type="button"
                    className="font-medium text-blue-600 hover:text-blue-500"
                    onClick={() => setForgotPassword(true)}
                  >
                    Forgot your password?
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md group hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Sign in
                </button>
              </div>
            </form>
          </>
        ) : !shortcodeSent ? (
          <>
            <h2 className="text-2xl font-bold text-center text-blue-600">Forgot Password</h2>
            <form className="mt-8 space-y-6" onSubmit={handleForgotPassword}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="forgot-email" className="sr-only">Email address</label>
                  <input
                    id="forgot-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Email address"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                  />
                </div>
              </div>

              {forgotError && <div className="text-red-500 text-sm">{forgotError}</div>}

              <div>
                <button
                  type="submit"
                  className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md group hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Send Shortcode
                </button>
              </div>

              <div className="text-sm text-center">
                <button
                  type="button"
                  className="font-medium text-blue-600 hover:text-blue-500"
                  onClick={() => setForgotPassword(false)}
                >
                  Back to login
                </button>
              </div>
            </form>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Login;
