import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Esquema de validação
const AnimeSchema = z.object({
  name: z.string().min(2, { message: "Nome do anime deve ter no mínimo 2 caracteres" }),
  imageUrl: z.string().url({ message: "URL da imagem inválida" }),
  status: z.enum(['Assistindo', 'Completo', 'Dropado', 'Planejo Assistir']),
  totalEpisodes: z.number().min(1, { message: "Número de episódios deve ser positivo" }),
  watchedEpisodes: z.number().min(0, { message: "Episódios assistidos não pode ser negativo" }),
  score: z.number().min(0).max(10, { message: "Nota deve estar entre 0 e 10" })
});

type AnimeFormData = z.infer<typeof AnimeSchema>;

interface AddAnimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAnime: (anime: AnimeFormData) => void;
}

export const AddAnimeModal: React.FC<AddAnimeModalProps> = ({ 
  isOpen, 
  onClose, 
  onAddAnime 
}) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset 
  } = useForm<AnimeFormData>({
    resolver: zodResolver(AnimeSchema),
    defaultValues: {
      status: 'Planejo Assistir',
      watchedEpisodes: 0,
      score: 0
    }
  });

  const onSubmit = (data: AnimeFormData) => {
    console.log('Dados enviados pelo formulário:', data);
    onAddAnime(data);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-2xl mb-4">Adicionar Novo Anime</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-2">Nome do Anime</label>
            <input 
              {...register('name')}
              className="w-full p-2 border rounded"
              placeholder="Digite o nome do anime"
            />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block mb-2">URL da Imagem</label>
            <input 
              {...register('imageUrl')}
              className="w-full p-2 border rounded"
              placeholder="Cole a URL da imagem do anime"
            />
            {errors.imageUrl && <p className="text-red-500">{errors.imageUrl.message}</p>}
          </div>

          <div>
            <label className="block mb-2">Status</label>
            <select 
              {...register('status')}
              className="w-full p-2 border rounded"
            >
              <option value="Planejo Assistir">Planejo Assistir</option>
              <option value="Assistindo">Assistindo</option>
              <option value="Completo">Completo</option>
              <option value="Dropado">Dropado</option>
            </select>
          </div>

          <div>
            <label className="block mb-2">Total de Episódios</label>
            <input 
              type="number"
              {...register('totalEpisodes', { valueAsNumber: true })}
              className="w-full p-2 border rounded"
              placeholder="Número total de episódios"
            />
            {errors.totalEpisodes && <p className="text-red-500">{errors.totalEpisodes.message}</p>}
          </div>

          <div>
            <label className="block mb-2">Episódios Assistidos</label>
            <input 
              type="number"
              {...register('watchedEpisodes', { valueAsNumber: true })}
              className="w-full p-2 border rounded"
              placeholder="Número de episódios assistidos"
            />
            {errors.watchedEpisodes && <p className="text-red-500">{errors.watchedEpisodes.message}</p>}
          </div>

          <div>
            <label className="block mb-2">Nota (0-10)</label>
            <input 
              type="number"
              step="0.1"
              {...register('score', { valueAsNumber: true })}
              className="w-full p-2 border rounded"
              placeholder="Sua nota para o anime"
            />
            {errors.score && <p className="text-red-500">{errors.score.message}</p>}
          </div>

          <div className="flex justify-between">
            <button 
              type="button"
              onClick={onClose}
              className="bg-gray-300 font-bold text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="bg-button font-bold text-white px-4 py-2 rounded"
            >
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};