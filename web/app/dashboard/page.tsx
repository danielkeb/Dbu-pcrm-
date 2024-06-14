"use client"
import React from 'react';
import Main from './main/main';
import RegisterPage from './pcuser';
import Visualization from './visualize';
//import Main from '@/components/Main';

const DashboardPage: React.FC = () => {
  return (
    <Main>
      <h1>Welcome to the Dashboard</h1>
     <Visualization/>
    </Main>
  );
};

export default DashboardPage;
