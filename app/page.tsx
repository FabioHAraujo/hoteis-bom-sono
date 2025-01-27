'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const router = useRouter();

  // Navegue para a rota "/home"
  useEffect(() => {
    router.push('/home');
  }, [router]);

  return null; // O componente não renderiza nada diretamente
}
