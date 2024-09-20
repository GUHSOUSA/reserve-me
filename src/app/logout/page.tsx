'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Logout = () => {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    router.push('/login'); // Redireciona para a página de login após o logout
  }, [router]);

  return (
    <div>
      <h1>Saindo...</h1>
    </div>
  );
};

export default Logout;
