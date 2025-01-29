"use client";

import * as React from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Image from "next/image";
import placeholder from "@/public/assets/global/placeholder.png";

// Tipos
interface Room {
  id: string;
  name: string;
  description: string;
  bed_count: number;
  value: number;
  value_with_taxes: number;
  cleaning_fee: number;
  hotel: string;
  country: string;
  city: string;
  state: string;
}

interface FilterCategory {
  id: string;
  name: string;
  icon: string;
}

// Componente do Carrossel de Imagens
function ImageCarousel({ images }: { images: string[] }) {
  const [currentImage, setCurrentImage] = React.useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
      <Image
        src={images[currentImage] || placeholder}
        alt="Imagem da propriedade"
        fill
        className="object-cover"
      />
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1">
        {images.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 w-1.5 rounded-full ${index === currentImage ? "bg-white" : "bg-white/50"}`}
          />
        ))}
      </div>
      <button
        onClick={previousImage}
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1 opacity-70 hover:opacity-100"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={nextImage}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-1 opacity-70 hover:opacity-100"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

// Componente Principal
export function FiltroDeMostragem() {
  const filters: FilterCategory[] = [
    { id: "beach", name: "Em frente à praia", icon: "🏖️" },
    { id: "iconic", name: "Icônicos", icon: "🏛️" },
    { id: "views", name: "Vistas incríveis", icon: "🏔️" },
    { id: "pools", name: "Piscinas incríveis", icon: "🏊‍♂️" },
    { id: "fun", name: "Diversão", icon: "🎮" },
    { id: "eco", name: "Energia alternativa", icon: "🌱" },
    { id: "cabins", name: "Chalés", icon: "🏡" },
    { id: "interior", name: "No interior", icon: "🌳" },
    { id: "triangle", name: "Casas triangulares", icon: "🔺" },
    { id: "farms", name: "Fazendas", icon: "🚜" },
    { id: "tiny", name: "Microcasas", icon: "🏠" },
    { id: "islands", name: "Ilhas", icon: "🏝️" },
    { id: "beach-front", name: "Pousadas", icon: "🏨" },
  ];

  const [rooms, setRooms] = React.useState<Room[]>([]);
  const [roomImages, setRoomImages] = React.useState<{ [key: string]: string[] }>({});
  const [activeFilter, setActiveFilter] = React.useState<string | null>(null);
  const [favorites, setFavorites] = React.useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchRoomsAndImages = async () => {
      try {
        // Buscar os quartos via API Express
        const roomsResponse = await fetch("http://127.0.0.1:3030/rooms");
        const roomsData = await roomsResponse.json();

        const imagesByRoom: { [key: string]: string[] } = {};

        // Buscar imagens para cada quarto
        await Promise.all(
          roomsData.map(async (room: any) => {
            try {
              const imagesResponse = await fetch(`http://127.0.0.1:3030/rooms/${room.id}/images`);
              const imagesData = await imagesResponse.json();
            
              const bannerResponse = await fetch(`http://127.0.0.1:3030/rooms/${room.id}/banner`);
              const bannerData = await bannerResponse.json();
            
              imagesByRoom[room.id] = [bannerData.banner, ...(imagesData.images || [])];
            } catch (error) {
              console.error(`Erro ao buscar imagens do quarto ${room.id}:`, error);
              imagesByRoom[room.id] = [placeholder.src]; // 🔥 Convertendo StaticImageData para string
            }
          })
        );

        setRooms(roomsData);
        setRoomImages(imagesByRoom);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomsAndImages();
  }, []);

  const toggleFavorite = (roomId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(roomId)) {
        newFavorites.delete(roomId);
      } else {
        newFavorites.add(roomId);
      }
      return newFavorites;
    });
  };

  if (isLoading) {
    return <div className="text-center mt-10">Carregando quartos...</div>;
  }

  return (
    <div className="space-y-6 p-4">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex justify-between w-full space-x-4 p-1">
          {filters.map((filter) => (
            <TooltipProvider key={filter.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeFilter === filter.id ? "default" : "outline"}
                    className="flex flex-col items-center gap-2 p-4 h-full w-full"
                    onClick={() => setActiveFilter(filter.id)}
                  >
                    <span className="text-3xl">{filter.icon}</span>
                    <span className="text-2x1">{filter.name}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{filter.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {rooms.map((room) => {
          const images = roomImages[room.id] || [placeholder]; // Usa o placeholder se não houver imagens

          return (
            <Card key={room.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <ImageCarousel images={images} />
                  <button
                    onClick={() => toggleFavorite(room.id)}
                    className="absolute right-2 top-2 rounded-full bg-white/80 p-2"
                  >
                    <Heart
                      className={`h-5 w-5 ${favorites.has(room.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                    />
                  </button>
                </div>
                <div className="space-y-2 p-4">
                  <p className="text-sm text-gray-500">{room.name}</p>
                  <p className="text-xs text-gray-500">{room.description}</p>
                  <p className="text-sm">
                    <span className="font-medium">R${room.value.toFixed(2)}</span> noite
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
