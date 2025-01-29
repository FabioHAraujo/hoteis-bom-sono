"use client";

import { HotelDetails } from "@/components/HotelDetails";
import { Navbar } from "@/components/sitewide/NavBar";

import quarto1 from "@/public/assets/data/quarto1.jpg";
import quarto2 from "@/public/assets/data/quarto2.jpg";
import quarto3 from "@/public/assets/data/quarto3.jpg";

// Simule dados do hotel (em um cenário real, você buscaria esses dados de uma API ou banco de dados)
const hotelData = {
  title: "Hotel Beira Mar Luxuoso",
  location: "Urubici - SC - Brasil",
  rating: 4.8,
  reviews: [
    {
      id: 1,
      author: "João Silva",
      rating: 5,
      comment: "Excelente estadia! Vista incrível e serviço impecável.",
      date: "15 de maio de 2023",
    },
    {
      id: 2,
      author: "Maria Santos",
      rating: 4.5,
      comment: "Ótima localização e quartos confortáveis. Café da manhã poderia ter mais opções.",
      date: "3 de junho de 2023",
    },
  ],
  price: 850,
  taxPrice: 85,
  cleaningFee: 100,
  images: [quarto1, quarto2, quarto3, quarto1, quarto2, quarto3, quarto1, quarto2, quarto3, quarto1, quarto2, quarto3].map(img => img.src), // 🔥 Corrigido para string
};

export default function HotelPage() {
  return (
    <main>
      <Navbar />
      <HotelDetails {...hotelData} />
    </main>
  );
}
