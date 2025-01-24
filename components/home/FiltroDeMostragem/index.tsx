"use client"

import * as React from "react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, ChevronLeft, ChevronRight } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Image from "next/image"
import quarto1 from "@/public/assets/data/quarto1.jpg"
import quarto2 from "@/public/assets/data/quarto2.jpg"
import quarto3 from "@/public/assets/data/quarto3.jpg"

// Tipos
interface Property {
  id: string
  images: string[]
  location: string
  title: string
  rating: number
  pricePerNight: number
  totalPrice: number
  isFavorite?: boolean
  isPreferred?: boolean
}

interface FilterCategory {
  id: string
  name: string
  icon: string
}

// Componente do Carrossel de Imagens
function ImageCarousel({ images }: { images: string[] }) {
  const [currentImage, setCurrentImage] = React.useState(0)

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  const previousImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
      <Image
        src={images[currentImage] || quarto1}
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
  )
}

// Componente Principal
export function FiltroDeMostragem() {
  // Dados de exemplo para os filtros
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
  ]

  // Dados de exemplo para as propriedades
  const properties: Property[] = [
    {
      id: "1",
      images: [
        quarto1,
        quarto2,
        quarto3,
      ],
      location: "Urubici, Brasil",
      title: "Vista para montanha e rio",
      rating: 4.93,
      pricePerNight: 542,
      totalPrice: 742,
      isPreferred: true,
    },
    {
      id: "2",
      images: [
        quarto1,
        quarto2,
        quarto3,
      ],
      location: "Cambará do Sul, Brasil",
      title: "Vistas para montanha e lago",
      rating: 4.93,
      pricePerNight: 1027,
      totalPrice: 1027,
      isPreferred: true,
    },
    // Adicione mais propriedades conforme necessário
  ]

  const [activeFilter, setActiveFilter] = React.useState<string | null>(null)
  const [favorites, setFavorites] = React.useState<Set<string>>(new Set())

  const toggleFavorite = (propertyId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(propertyId)) {
        newFavorites.delete(propertyId)
      } else {
        newFavorites.add(propertyId)
      }
      return newFavorites
    })
  }

  return (
    <div className="space-y-6 p-4">
      {/* Barra de Filtros */}
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max space-x-4 p-1">
          {filters.map((filter) => (
            <TooltipProvider key={filter.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeFilter === filter.id ? "default" : "outline"}
                    className="flex flex-col items-center gap-2 p-4"
                    onClick={() => setActiveFilter(filter.id)}
                  >
                    <span className="text-2xl">{filter.icon}</span>
                    <span className="text-xs">{filter.name}</span>
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

      {/* Grade de Propriedades */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {properties.map((property) => (
          <Card key={property.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative">
                <ImageCarousel images={property.images} />
                {property.isPreferred && (
                  <div className="absolute left-2 top-2 rounded-full bg-white px-3 py-1 text-xs font-medium">
                    Preferido dos hóspedes
                  </div>
                )}
                <button
                  onClick={() => toggleFavorite(property.id)}
                  className="absolute right-2 top-2 rounded-full bg-white/80 p-2"
                >
                  <Heart
                    className={`h-5 w-5 ${favorites.has(property.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                  />
                </button>
              </div>
              <div className="space-y-2 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{property.location}</h3>
                  <div className="flex items-center gap-1">
                    <span>★</span>
                    <span>{property.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">{property.title}</p>
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">R${property.pricePerNight}</span> noite
                  </p>
                  <p className="text-sm text-gray-500">Total de R${property.totalPrice}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

