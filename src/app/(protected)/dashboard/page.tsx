'use client';
import { useContext } from 'react';
import { UserContext } from '@/context/useContext';
import { ManagerDashboard } from './components/manager-dashboard';

const Dashboard = () => {
  const { user } = useContext(UserContext);
  return (
    <>
    {user.role === "MANAGER" ? <ManagerDashboard/> : <></>}
    </>
  );
};
export default Dashboard;