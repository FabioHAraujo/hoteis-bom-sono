"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PocketBase from "pocketbase";
import { UserProfile } from "@/components/profile";
import { Navbar } from "@/components/sitewide/NavBar";

const pb = new PocketBase("http://127.0.0.1:8090");

export default function Perfil() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authUser = pb.authStore.model;
        if (!authUser) {
          router.push("/auth"); // Redireciona para login se não estiver autenticado
          return;
        }

        // Se o usuário está autenticado, carrega os dados
        setUser(authUser);
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        router.push("/auth");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return <div className="text-center mt-10">Verificando autenticação...</div>;
  }

  return (
    <div>
      <Navbar />
      <UserProfile />
    </div>
  );
}
