"use client"

import { AuthForm } from "@/components/auth/auth-form"
import Image from "next/image"
import { useState, useEffect } from "react"
import logo from "@/public/assets/global/bed-svgrepo-com.svg";

const videos = [
  "https://videos.pexels.com/video-files/2425846/2425846-uhd_2560_1440_24fps.mp4",
  "https://videos.pexels.com/video-files/3410663/3410663-uhd_2562_1440_30fps.mp4",
  "https://videos.pexels.com/video-files/3576352/3576352-uhd_2560_1440_25fps.mp4",
  "https://videos.pexels.com/video-files/8419217/8419217-uhd_2560_1440_25fps.mp4",
  "https://videos.pexels.com/video-files/6242776/6242776-hd_1080_1920_30fps.mp4",
]

export default function AuthPage() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length)
    }, 10000) // Muda o vídeo a cada 10 segundos

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="flex min-h-screen">
      {/* Video Background Section */}
      <div className="relative hidden w-1/2 lg:block">
        {videos.map((video, index) => (
          <video
            key={video}
            autoPlay
            muted
            loop
            className={`absolute h-full w-full object-cover transition-opacity duration-1000 ${
              index === currentVideoIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <source src={video} type="video/mp4" />
          </video>
        ))}
        <div className="absolute inset-0 bg-black/30" /> {/* Overlay for better text visibility */}
        <div className="relative p-8">
          <Image
            src={logo}
            alt="Logo"
            width={120}
            color="red"
            height={40}
            className="h-10 w-auto"
          />
        </div>
      </div>

      {/* Form Section */}
      <div className="flex w-full items-center justify-center lg:w-1/2">
        <div className="w-full max-w-md space-y-8 px-4 md:px-8">
          <AuthForm />
        </div>
      </div>
    </div>
  )
}

