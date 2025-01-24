"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/ui/marquee";
import { Bed } from "lucide-react";
import { WordRotate } from "@/components/ui/word-rotate";
import Image, { StaticImageData } from "next/image";

import quarto1 from "@/public/assets/data/quarto1.jpg";
import quarto2 from "@/public/assets/data/quarto2.jpg";
import quarto3 from "@/public/assets/data/quarto3.jpg";

// Tipagem
interface Quarto {
  id: string;
  img: StaticImageData;
  preco: string;
  descricao: string;
  camas: number;
  cidade: string;
  pais: string;
}

// Dados dos quartos
const quartos: Quarto[] = [
  {
    id: "1",
    img: quarto1,
    preco: "R$ 250/noite",
    descricao: "Quarto aconchegante com vista para o mar.",
    camas: 2,
    cidade: "Rio de Janeiro",
    pais: "Brasil",
  },
  {
    id: "2",
    img: quarto2,
    preco: "R$ 300/noite",
    descricao: "Apartamento moderno no centro da cidade.",
    camas: 1,
    cidade: "São Paulo",
    pais: "Brasil",
  },
  {
    id: "3",
    img: quarto3,
    preco: "R$ 400/noite",
    descricao: "Suíte de luxo com jacuzzi privativa.",
    camas: 3,
    cidade: "Florianópolis",
    pais: "Brasil",
  },
  {
    id: "4",
    img: quarto1,
    preco: "R$ 180/noite",
    descricao: "Quarto simples e confortável.",
    camas: 1,
    cidade: "Curitiba",
    pais: "Brasil",
  },
  {
    id: "5",
    img: quarto2,
    preco: "R$ 220/noite",
    descricao: "Quarto familiar com varanda espaçosa.",
    camas: 2,
    cidade: "Porto Alegre",
    pais: "Brasil",
  },
  {
    id: "6",
    img: quarto3,
    preco: "R$ 500/noite",
    descricao: "Cobertura exclusiva com vista panorâmica.",
    camas: 4,
    cidade: "Búzios",
    pais: "Brasil",
  },
];

// Divisão dos quartos
const firstRow = quartos.slice(0, Math.ceil(quartos.length / 2));
const secondRow = quartos.slice(Math.ceil(quartos.length / 2));

// Componente de Card
interface QuartoCardProps extends Quarto {}

const QuartoCard: React.FC<QuartoCardProps> = ({
  img,
  preco,
  descricao,
  camas,
  cidade,
  pais,
}) => {
  return (
    <figure
      className={cn(
        "relative w-80 cursor-pointer overflow-hidden rounded-xl border p-4",
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
        "flex flex-col justify-between h-72"
      )}
    >
      <Image
        className="rounded-lg object-cover w-full h-36"
        src={img}
        alt={`Imagem do quarto localizado em ${cidade}, ${pais}`}
        placeholder="blur"
      />
      <figcaption className="flex flex-col justify-between mt-3 h-full">
        <p className="text-lg font-semibold text-primary">
          {cidade}, {pais}
        </p>
        <p className="text-sm text-muted-foreground">{descricao}</p>
        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
          <Bed className="h-4 w-4" />
          <span>{camas} camas</span>
        </div>
        <p className="mt-2 text-sm font-medium text-foreground">{preco}</p>
      </figcaption>
    </figure>
  );
};

// Palavras para animação
const palavras = [
  "Amados",
  "Visitados",
  "Elegantes",
  "Reservados",
  "Requintados",
  "Confortáveis",
  "Exclusivos",
  "Desejados",
  "Charmosos",
];

// Componente Principal
export function MarqueeMaisLocados() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-background">
      <div className="flex flex-row items-center my-4">
        <div className="w-[50svw] text-right pr-2 ml-24">
          <WordRotate
            className="text-4xl font-bold text-black dark:text-white whitespace-nowrap"
            words={["Nossos Quartos Mais"]}
          />
        </div>
        <div className="w-[50svw]">
          <WordRotate
            className="text-4xl font-bold text-black dark:text-white whitespace-nowrap"
            words={palavras}
          />
        </div>
      </div>
      <div className="h-[80svh]">
        <Marquee pauseOnHover className="[--duration:20s]">
          {firstRow.map((quarto) => (
            <QuartoCard key={quarto.id} {...quarto} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:20s]">
          {secondRow.map((quarto) => (
            <QuartoCard key={quarto.id} {...quarto} />
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
      </div>
    </div>
  );
}
