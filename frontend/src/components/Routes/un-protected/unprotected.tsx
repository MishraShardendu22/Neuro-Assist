/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode, useEffect, useState } from 'react';
import { useUserStore } from '@/components/store/userStore';
import axiosInstance from '@/lib/axiosInstance';
import { Navigate } from 'react-router-dom';
import Loader from '@/components/Loader';

interface UnprotectedRoutesProps {
  children: ReactNode;
}

const UnprotectedRoutes: React.FC<UnprotectedRoutesProps> = ({ children }) => {
  const [isUnauthenticated, setIsUnauthenticated] = useState<boolean | null>(null);
  const [rateLimited, setRateLimited] = useState<boolean>(false);
  const setUser = useUserStore((state: any) => state.setUser);

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsUnauthenticated(true);
        return;
      }

      try {
        const results = await Promise.allSettled([
          axiosInstance.get('/hospital/verifyHospital', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axiosInstance.get('/patient/verifyPatient', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const hospitalResult = results[0];
        const patientResult = results[1];

        // Immediate redirection if rate limiting is detected
        if (
          (hospitalResult.status === 'rejected' &&
            (hospitalResult.reason as any)?.response?.status === 429) ||
          (patientResult.status === 'rejected' &&
            (patientResult.reason as any)?.response?.status === 429)
        ) {
          setRateLimited(true);
          return;
        }

        let isAuthenticated = false;

        if (hospitalResult.status === 'fulfilled' && hospitalResult.value.status === 200) {
          setUser(hospitalResult.value.data.data);
          isAuthenticated = true;
        }

        if (patientResult.status === 'fulfilled' && patientResult.value.status === 200) {
          setUser(patientResult.value.data.data);
          isAuthenticated = true;
        }

        setIsUnauthenticated(!isAuthenticated);
      } catch (error) {
        console.error('Error during authentication check:', error);
        setIsUnauthenticated(true);
      }
    };

    checkAuthentication();
  }, [setUser]);

  if (rateLimited) {
    return <Navigate to="/too-fast" />;
  }

  if (isUnauthenticated === null) {
    return <Loader />;
  }

  if (!isUnauthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

export default UnprotectedRoutes;
