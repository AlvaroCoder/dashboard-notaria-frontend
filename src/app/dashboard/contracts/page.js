'use client';
import { getSession } from '@/authentication/lib';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react'

const ViewAdminDashboard=dynamic(()=>import('@/components/Views/ViewAdminDashboard'),{
  ssr : false,
  loading : ()=><span>Cargando tabla ...</span>
});

const ViewJuniorDashboard=dynamic(()=>import('@/components/Views/ViewJuniorDashboard'),{
  ssr : false,
  loading : ()=><span>Cargando tabla ...</span>
});

export default function Page() {
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(()=>{
    async function fetchDataUser() {
      try {
        setLoading(true);
        const session = await getSession();
        if (session) {
          const userRole = session?.user?.payload?.role;
          setUser(session?.user);
          setRole(userRole);
        }
      } catch (error) {
        
      }finally{
        setLoading(false);
      }

    }
    fetchDataUser();
  },[]);

  if (loading) {
    <p>Cargando ...</p>
  }
 
  switch (role) {
    case 'junior':
      return(<ViewJuniorDashboard
        idJunior={user?.payload?.id}
      />);
    case 'admin':
      return (<ViewAdminDashboard/>)
    case 'senior':
      return ( <ViewAdminDashboard/>);
    
  }
}
