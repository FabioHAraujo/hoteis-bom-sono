"use client"

import * as React from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Search, HelpCircle } from "lucide-react"
import Image from "next/image"
import brasil from "@/public/assets/global/brasil.svg"
import uk from "@/public/assets/global/uk.svg"
import spain from "@/public/assets/global/spain.svg"
import logo from "@/public/assets/global/logo.png"

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
        <Image src={logo} width={30} alt="Logo Hotéis Bom Sono" className="mx-4 mb-2"/>
        <Link href="/" className="text-2xl font-bold">
          HotéisBomSono
        </Link>

        <div className="flex-1 flex justify-center">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Países</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {[
                      {
                        continent: "África",
                        countries: ["Egito", "África do Sul", "Marrocos", "Quênia"],
                      },
                      {
                        continent: "América",
                        countries: ["Estados Unidos", "Brasil", "México", "Canadá"],
                      },
                      {
                        continent: "Ásia",
                        countries: ["Japão", "Tailândia", "China", "Índia"],
                      },
                      {
                        continent: "Europa",
                        countries: ["França", "Itália", "Espanha", "Grécia"],
                      },
                      {
                        continent: "Oceania",
                        countries: ["Austrália", "Nova Zelândia", "Fiji", "Polinésia Francesa"],
                      },
                    ].map((item) => (
                      <li key={item.continent}>
                        <NavigationMenuLink asChild>
                          <a
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            href={`/continente/${item.continent.toLowerCase().replace(" ", "-")}`}
                          >
                            <div className="text-sm font-medium leading-none">{item.continent}</div>
                            <ul className="mt-2 space-y-1">
                              {item.countries.map((country) => (
                                <li key={country} className="text-sm text-muted-foreground">
                                  <a
                                    href={`/pais/${country.toLowerCase().replace(" ", "-")}`}
                                    className="block py-1 hover:underline"
                                  >
                                    {country}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/ajuda" legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Ajuda
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center space-x-4">
          <form className="flex items-center" onSubmit={(e) => e.preventDefault()}>
            <Input type="search" placeholder="Pesquisar destinos..." className="w-[200px] md:w-[300px]" />
            <Button type="submit" variant="ghost" size="icon">
              <Search className="h-4 w-4" />
              <span className="sr-only">Pesquisar</span>
            </Button>
          </form>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-10 w-10 p-0">
                  <Image src={brasil} alt="Bandeira do Brasil" width={30} height={20} />
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[150px] gap-3 p-4">
                    {[
                      { lang: "PT-BR", flag: brasil, alt: "Bandeira do Brasil" },
                      { lang: "EN", flag: uk, alt: "Bandeira da Inglaterra" },
                      { lang: "ES", flag: spain, alt: "Bandeira da Espanha" },
                    ].map((item) => (
                      <li key={item.lang}>
                        <NavigationMenuLink asChild>
                          <a
                            className="flex items-center space-x-2 rounded-md p-2 hover:bg-accent hover:text-accent-foreground"
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              // Lógica para mudar o idioma
                            }}
                          >
                            <Image src={item.flag} alt={item.alt} width={30} height={20} />
                            <span>{item.lang}</span>
                          </a>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </nav>
  )
}

