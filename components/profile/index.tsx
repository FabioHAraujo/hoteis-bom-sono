"use client";

import { useState, useEffect } from "react";
import PocketBase from "pocketbase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Star } from "lucide-react";

const pb = new PocketBase("http://127.0.0.1:8090");

export function UserProfile() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (pb.authStore.model?.id) {
          const currentUser = await pb.collection("users").getOne(pb.authStore.model.id);
          setUser(currentUser);
          setName(currentUser.name);
          setPhone(currentUser.phone || "");
          setAddress(currentUser.address || "");
          setPreviewAvatar(pb.getFileUrl(currentUser, currentUser.avatar));

          // Buscar avaliações do usuário com a relação do quarto expandida
          const userReviews = await pb.collection("reviews_rooms").getFullList({
            filter: `user="${currentUser.id}"`,
            sort: "-created",
            expand: "room", // Expande a relação para obter detalhes do quarto
          });

          console.log("Reviews do usuário: ", userReviews);
          setReviews(userReviews);
        }
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        toast.error("Erro ao carregar informações do usuário");
      }
    };

    loadUser();
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value);
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value);
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(file);
      setPreviewAvatar(URL.createObjectURL(file)); // Atualiza a prévia da imagem instantaneamente
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("address", address);
      if (avatar) {
        formData.append("avatar", avatar);
      }

      const updatedUser = await pb.collection("users").update(user.id, formData);
      setUser(updatedUser);
      setPreviewAvatar(pb.getFileUrl(updatedUser, updatedUser.avatar)); // Atualiza para a URL do PocketBase
      setAvatar(null); // Limpa o arquivo temporário após o upload
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Erro ao atualizar perfil");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div className="text-center mt-10">Carregando perfil...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4">
      {/* Perfil do Usuário */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Perfil do Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col items-center space-y-2">
              <Avatar className="w-24 h-24">
                <AvatarImage src={previewAvatar || undefined} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <Label htmlFor="avatar" className="cursor-pointer text-sm text-blue-500 hover:text-blue-600">
                Alterar foto
              </Label>
              <Input id="avatar" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" type="text" value={name} onChange={handleNameChange} placeholder="Seu nome" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" type="text" value={phone} onChange={handlePhoneChange} placeholder="Seu telefone" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="address">Endereço</Label>
                <Input id="address" type="text" value={address} onChange={handleAddressChange} placeholder="Seu endereço" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={user.email} disabled className="bg-gray-100" />
            </div>

            <div className="space-y-2">
              <Label>Data de Registro</Label>
              <p className="text-sm text-gray-500">{new Date(user.created).toLocaleDateString()}</p>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Atualizando..." : "Atualizar Perfil"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Avaliações do Usuário */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Suas Avaliações</CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center">Você ainda não fez nenhuma avaliação.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">
                      Avaliação para o quarto: {review.expand?.room?.name || "Nome Indisponível"}
                    </h3>
                    <div className="flex items-center space-x-1 text-yellow-500">
                      {Array.from({ length: review.stars }).map((_, index) => (
                        <Star key={index} size={16} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mt-2">{review.comment}</p>
                  <p className="text-xs text-gray-400 mt-1">Criado em: {new Date(review.created).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
