"use client";
import Visualization from "./visualize";
import { AppContext } from '@/components/UserContext';
import React, { useState, FormEvent, useContext } from 'react';
const DashboardPage: React.FC = () => {
  const { token, setToken, decodedToken, setDecodedToken } = useContext(AppContext);
  return (
    <>
      <h1>Welcome to the Dashboard</h1>
      <Visualization />
    </>
  );
};

export default DashboardPage;
