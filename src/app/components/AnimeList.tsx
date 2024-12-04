"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AddAnimeModal } from './AddAnimeModal';
import { EditAnimeModal } from './EditAnimeModal';
import AnimeCard from './AnimeCard';
import { IAnime } from '../models/Anime';
import { toast, Toaster } from 'react-hot-toast';

interface AnimeListProps {
  initialAnimes: IAnime[];
  initialStatus: string;
}

type AnimeFormData = {
  name: string;
  imageUrl: string;
  status: "Assistindo" | "Completo" | "Dropado" | "Planejo Assistir";
  totalEpisodes: number;
  watchedEpisodes: number;
  score: number;
}

export function AnimeList({ initialAnimes, initialStatus }: AnimeListProps) {
  const [animes, setAnimes] = useState<IAnime[]>(initialAnimes);
  const [currentList, setCurrentList] = useState(initialStatus);
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAnime, setEditingAnime] = useState<IAnime | null>(null);

  const handleAddAnime = async (data: AnimeFormData) => {
    try {
      const response = await fetch('/api/animes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const newAnime = await response.json();
        setAnimes([...animes, newAnime.data]);
        setIsAddModalOpen(false);
        toast.success('Anime adicionado com sucesso!');
      } else {
        toast.error('Erro ao adicionar anime');
      }
    } catch (error) {
      console.error('Erro ao adicionar anime', error);
      toast.error('Erro ao adicionar anime');
    }
  };

  const handleUpdateAnime = async (id: string, updatedData: Partial<IAnime>) => {
    try {
      const response = await fetch(`/api/animes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
      });
  
      if (response.ok) {
        const data = await response.json();
        setAnimes(prevAnimes => 
          prevAnimes.map(anime => 
            anime._id === id ? data.data : anime
          )
        );
        setEditingAnime(null);
        toast.success('Anime atualizado com sucesso!');
      } else {
        toast.error('Erro ao atualizar anime');
      }
    } catch (error) {
      console.error('Erro ao atualizar anime:', error);
      toast.error('Erro ao atualizar anime');
    }
  };

  const handleDeleteAnime = async (id: string) => {
    try {
      const response = await fetch(`/api/animes/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setAnimes(animes.filter(anime => anime._id !== id));
        toast.success('Anime removido com sucesso!');
      } else {
        toast.error('Erro ao remover anime');
      }
    } catch (error) {
      console.error('Erro ao remover anime', error);
      toast.error('Erro ao remover anime');
    }
  };

  const handleStatusChange = (status: string) => {
    setCurrentList(status);
    router.push(`/?status=${status}`);
  };

  const listStats = {
    total: animes.filter(anime => anime.status === currentList).length,
    totalEpisodes: animes
      .filter(anime => anime.status === currentList)
      .reduce((sum, anime) => sum + anime.watchedEpisodes, 0)
  };

  return (
    <div className="w-full">
      <div className="bg-header text-white p-4 shadow-lg w-full">
        <div className="flex justify-between items-center px-4 max-w-[2000px] mx-auto">
          <div className="flex space-x-2">
            {['Assistindo', 'Completo', 'Dropado', 'Planejo Assistir'].map(status => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={`px-4 py-2 rounded-lg text-sm transition-all text-secondtext font-bold ${
                  currentList === status 
                    ? 'text-maintext bg-slate-600' 
                    : 'bg-transparent hover:text-maintext delay-25'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center bg-button font-bold text-white px-4 py-2 rounded-lg hover:bg-button transition-colors"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" 
                clipRule="evenodd" 
              />
            </svg>
            Adicionar a lista
          </button>
        </div>
      </div>

      <div className="max-w-[2000px] mx-auto p-4">
        {/* Estatísticas da lista atual */}
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <p className="text-gray-700">
            Total de Animes na Lista: {listStats.total} | 
            Episódios Assistidos: {listStats.totalEpisodes}
          </p>
        </div>

        {/* Grid de Animes */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {animes
            .filter(anime => anime.status === currentList)
            .map(anime => (
              <AnimeCard 
                key={anime._id} 
                anime={anime} 
                onDelete={() => handleDeleteAnime(anime._id)}
                onEdit={() => setEditingAnime(anime)}
              />
            ))}
        </div>

        {/* Modais */}
        <AddAnimeModal 
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddAnime={handleAddAnime}
        />

        <EditAnimeModal 
          isOpen={!!editingAnime}
          onClose={() => setEditingAnime(null)}
          anime={editingAnime}
          onUpdateAnime={handleUpdateAnime}
        />

{/*      
        <Toaster 
          position="top-right"
          toastOptions={{
            success: {
              style: {
                background: '#10B981',
                color: 'white',
              },
            },
            error: {
              style: {
                background: '#EF4444',
                color: 'white',
              },
            },
          }}
        />  */}
      </div>
    </div>
  );
}