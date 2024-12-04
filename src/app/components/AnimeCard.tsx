"use client"

import React, { useState } from 'react';
import { IAnime } from '../models/Anime';
import Image from 'next/image';
import { Icons } from "./icons";


interface AnimeCardProps {
  anime: IAnime;
  onEdit: (anime: IAnime) => void;
  onDelete: (id: string) => void;
}

export default function AnimeCard({ anime, onEdit, onDelete }: AnimeCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir este anime?')) {
      onDelete(anime._id);
    }
  };

  return (
    <div 
      className="relative flex flex-col md:flex-row bg-white rounded-sm shadow-md overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full md:w-1/2 h-48 md:h-auto">
        <img className="object-cover w-full h-full rounded-sm left-0 top-0"
          src={anime.imageUrl || '/placeholder.png'}
          alt={anime.name}
        />
        {isHovered && (
          <div className="absolute top-0 left-0 w-full h-full flex justify-end items-start p-2 space-x-2 delay-75">
            <button
              onClick={() => onEdit(anime)}
              className="px-1 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 delay-75 transition-colors"
            >
              <Icons.PenEdit />
            </button>
            <button
              onClick={handleDelete}
              className="px-1 py-1 bg-red-500 text-white rounded hover:bg-red-600 delay-75 transition-colors "
            >
              <Icons.Delete />
            </button>
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <h3 className="font-bold text-maintext text-lg mb-2">{anime.name}</h3>
          <p className="text-gray-600 flex items-end">
            Episódios: {anime.watchedEpisodes}/{anime.totalEpisodes}
          </p>
          <p className="text-gray-600">
            Nota: {anime.score}/10 ⭐
          </p>
        </div>
      </div>
    </div>
  );
}