import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
// components
import LoadingScreen from '../components/loading-screen';
//
import { useAuthContext } from './useAuthContext';

// ----------------------------------------------------------------------

type GuestGuardProps = {
  children: ReactNode;
};

export default function GuestGuard({ children }: GuestGuardProps) {
  const hello = "";
  const { isAuthenticated, isInitialized } = useAuthContext();

  // if (hello == "") {
  //   return <Navigate to="/dashboard" />;
  // }
  return <Navigate to="/dashboard/request" />;
  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return <> {children} </>;
}
