'use client';
import { useContext } from 'react';
import { UserContext } from '@/context/useContext';
import { ManagerDashboard } from './components/manager-dashboard';
import AppointmentsPage from './components/barber-manager';

const Dashboard = () => {
  const { user } = useContext(UserContext);
  return (
    <>
    {user.role === "MANAGER" ? <ManagerDashboard/> : <AppointmentsPage/>}
    </>
  );
};
export default Dashboard;