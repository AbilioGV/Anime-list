import mongoose from 'mongoose';

export interface IAnime extends mongoose.Document {
  _id: string;
  name: string;
  imageUrl: string;
  status: 'Assistindo' | 'Completo' | 'Dropado' | 'Planejo Assistir';
  totalEpisodes: number;
  watchedEpisodes: number;
  score: number;
}

const AnimeSchema = new mongoose.Schema<IAnime>({
  name: {
    type: String,
    required: [true, 'Por favor, adicione o nome do anime'],
    trim: true,
  },
  imageUrl: {
    type: String,
    required: [true, 'URL da imagem é obrigatória'],
  },
  status: {
    type: String,
    enum: ['Assistindo', 'Completo', 'Dropado', 'Planejo Assistir'],
    default: 'Planejo Assistir',
  },
  totalEpisodes: {
    type: Number,
    required: [true, 'Total de episódios é obrigatório'],
    min: [1, 'O total de episódios deve ser no mínimo 1'],
  },
  watchedEpisodes: {
    type: Number,
    default: 0,
    min: [0, 'O número de episódios assistidos não pode ser negativo'],
    validate: {
      validator: function (value) {
        return value <= this.totalEpisodes;
      },
      message: 'Episódios assistidos não podem exceder o total de episódios',
    },
  },
  score: {
    type: Number,
    min: [0, 'Score deve ser entre 0 e 10'],
    max: [10, 'Score deve ser entre 0 e 10'],
    default: 0,
    validate: {
      validator: Number.isInteger,
      message: 'Score deve ser um número inteiro',
    },
  },
}, { timestamps: true });

export default mongoose.models.Anime || mongoose.model<IAnime>('Anime', AnimeSchema);