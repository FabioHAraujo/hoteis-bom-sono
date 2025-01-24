"use client"

import { MarqueeMaisLocados } from "@/components/home/MarqueeMaisLocados"
import { Navbar } from "@/components/sitewide/NavBar"
import { FiltroDeMostragem } from "@/components/home/FiltroDeMostragem"

export function Home() {
  return (
    // Bloco só pra deixar certinho :v
    <>
    <Navbar />
    <div id="container-central" className="px-[5svw]">
      <MarqueeMaisLocados />
      <FiltroDeMostragem />
    </div>
    </>
  )
}

