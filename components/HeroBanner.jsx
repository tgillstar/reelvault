"use client";

import React from 'react';
import Image from "next/image";
import LogoutButton from './LogoutButton';

const imageBaseUrl = "https://image.tmdb.org/t/p/original";

export default function HeroBanner({ movie }) {
  const backdrop = movie.backdrop_path;

  if (!backdrop) return null; // Don't even render HeroBanner without backdrop

  return (
    <div className="relative w-full aspect-[16/9] h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[65vh] xl:h-[70vh] overflow-hidden">
      <LogoutButton />
      
      <Image
        rel="preload" 
        src={`${imageBaseUrl}${movie.backdrop_path || movie.poster_path}`}
        alt={movie.title}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-40" />

      {/* Title */}
      <div className="absolute bottom-8 left-8 z-10">
      <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
        ReelVault
      </h1>
      </div>
    </div>
  );

}
