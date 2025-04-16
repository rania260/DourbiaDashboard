// app/auth-success/page.tsx
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/auth-context';

export default function AuthSuccess() {
  const router = useRouter();
  const { setIsLoggedIn } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    const userData = {
      id: params.get('id'),
      username: params.get('username'),
      email: params.get('email'),
      role: params.get('role'),
    };

    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);

    router.push('/admin');
  }, []);

  return <div>Connexion réussie, redirection en cours...</div>;
}