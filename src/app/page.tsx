import Anime from './models/Anime';
import connectToDatabase from './lib/mongoose';
import { AnimeList } from './components/AnimeList';

async function getAnimes() {
  await connectToDatabase();
  const animes = await Anime.find({});
  return JSON.parse(JSON.stringify(animes)); // Necessary to serialize MongoDB objects
}

export default async function Home({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const animes = await getAnimes();
  const status = searchParams.status || 'Assistindo';

  return (
    <div>
      <AnimeList initialAnimes={animes} initialStatus={status} />
    </div>
  );
}