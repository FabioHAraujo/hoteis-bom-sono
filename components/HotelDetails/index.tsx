"use client";

import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic"; // 🔥 Importação dinâmica do react-leaflet
import L from "leaflet";
import { Star, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

// 🔥 Importação dinâmica dos componentes do Leaflet (evita erro de window)
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

import "leaflet/dist/leaflet.css"; // Importar estilos do Leaflet

interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

interface HotelDetailsProps {
  title: string;
  location: string;
  rating: number;
  reviews: Review[];
  price: number;
  taxPrice: number;
  cleaningFee: number;
  images: string[];
}

export function HotelDetails({
  title,
  location,
  rating,
  reviews,
  price,
  taxPrice,
  cleaningFee,
  images,
}: HotelDetailsProps) {
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // 🔥 Inicializa vazio no servidor
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(images[0]); // 🔥 Define a imagem apenas no client-side
    }
  }, [images]);

  const customIcon = new L.Icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
  });

  // 🔥 Busca coordenadas apenas no client-side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const fetchCoordinates = async () => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
          );
          const data = await response.json();

          if (data.length > 0) {
            setCoordinates([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
          } else {
            console.error("Nenhuma coordenada encontrada para o endereço:", location);
          }
        } catch (error) {
          console.error("Erro ao buscar coordenadas:", error);
        }
      };

      fetchCoordinates();
    }
  }, [location]);

  // Função para rolar a galeria horizontalmente
  const scrollGallery = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <div className="flex items-center mb-6">
        <MapPin className="mr-2" />
        <span>{location}</span>
        <Badge variant="secondary" className="ml-4">
          {rating.toFixed(1)} <Star className="ml-1 h-4 w-4 fill-current" />
        </Badge>
      </div>

      <div id="imagens" className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 h-[60svh]">
        <div className="h-full flex flex-col">
          {/* Imagem principal */}
          <div className="flex-1 relative rounded-lg overflow-hidden cursor-pointer">
            {selectedImage && <Image src={selectedImage} alt={title} layout="fill" objectFit="cover" />}
          </div>

          {/* Miniaturas */}
          <div className="relative mt-2">
            <button className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-10"
              onClick={() => scrollGallery("left")}>
              <ChevronLeft size={20} />
            </button>

            <div ref={scrollRef} className="flex gap-2 overflow-x-auto scrollbar-hide px-12 py-2 flex-nowrap">
              {images.map((img, index) => (
                <div key={index} className={`w-24 h-24 min-w-[96px] relative rounded-lg overflow-hidden cursor-pointer hover:opacity-80`}
                  onClick={() => setSelectedImage(img)}>
                  <Image src={img} alt={`${title} - Image ${index + 1}`} layout="fill" objectFit="cover" />
                </div>
              ))}
            </div>

            <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-10"
              onClick={() => scrollGallery("right")}>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Avaliações</h2>
          {reviews.map((review) => (
            <Card key={review.id} className="mb-4">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{review.author}</CardTitle>
                  <Badge variant="secondary">
                    {review.rating.toFixed(1)} <Star className="ml-1 h-4 w-4 fill-current" />
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p>{review.comment}</p>
                <p className="text-sm text-gray-500 mt-2">{review.date}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Preços</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Valor base:</span>
                <span>R$ {price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Impostos:</span>
                <span>R$ {taxPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxa de limpeza:</span>
                <span>R$ {cleaningFee.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>R$ {(price + taxPrice + cleaningFee).toFixed(2)}</span>
              </div>
            </div>
            <Button className="w-full mt-4">Reservar agora</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
