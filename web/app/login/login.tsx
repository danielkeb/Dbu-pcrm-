'use client';

import { AppContext } from '@/components/UserContext';
import { useRouter } from 'next/navigation';
import React, { useState, FormEvent, useContext } from 'react';
import jwt, { JwtPayload } from "jsonwebtoken";
import Config from '@/config';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [forgotPassword, setForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [shortcodeSent, setShortcodeSent] = useState(false);
  const [userId, setUserId] = useState('');
  const { token, setToken, decodedToken, setDecodedToken } = useContext(AppContext);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const response = await fetch(`${Config.ROOT_URL}/auth/signin`, {
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

      const dec = jwt.decode(new_token) as JwtPayload | null; // Cast to JwtPayload or null

      setDecodedToken(dec);

      if (typeof dec !== "string" && dec?.status !== "active") {
        router.push("/unauthorized");
      } else {
        setToken(new_token);
        router.push("/dashboard");
      }
    } else {
      const errorData = await response.json();
      setError(errorData.message || 'An error occurred');
    }
  };

  const handleForgotPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setForgotError('');

    const response = await fetch(`${Config.ROOT_URL}/auth/forget/shortcode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: forgotEmail }),
    });

    if (response.ok) {
      const data = await response.json();
      setUserId(data.userId);
      router.push(`/reset?userId=${data.userId}`);
      setShortcodeSent(true);
    } else {
      const errorData = await response.json();
      setForgotError(errorData.message || 'An error occurred');
    }
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const backgroundStyle: React.CSSProperties = {
    backgroundImage: 'url("/office-computer-laptop-light-modified.png")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  };

  const innerContainerStyle = {
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    padding: '2rem',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    zIndex: 1,
    width: '50%',
    maxWidth: '550px',
    height: 'auto',
  };

  return (
    <div style={containerStyle}>
      <div style={backgroundStyle}></div>
      <div style={innerContainerStyle}>
        {!forgotPassword ? (
          <>
            <h4 className="text-2xl font-bold text-center text-blue-600">well come to</h4>
            <h2 className="text-2xl font-bold text-center text-blue-500">DBU PC Management System</h2>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div className="mb-4">
                  <label htmlFor="email-address" className="sr-only">Email address</label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                    className="relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && <div className="text-red-500 text-sm">{error}</div>}

              <div className="flex justify-end">
                <div className="text-sm text-right">
                  <button
                    type="button"
                    className="font-medium text-blue-700 hover:text-blue-600"
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
            <h2 className="text-2xl font-bold text-center text-blue-500">Forgot Password</h2>
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
                  Send Short code
                </button>
              </div>

              <div className="text-sm text-right">
                <button
                  type="button"
                  className="font-medium text-blue-700 hover:text-blue-500"
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
