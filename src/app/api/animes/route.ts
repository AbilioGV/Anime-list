import { NextResponse } from 'next/server';
import connectToDatabase from '../../lib/mongoose';
import Anime from '../../models/Anime';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    await connectToDatabase();
    const animes = await Anime.find({});
    return NextResponse.json({ success: true, data: animes });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar animes' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const anime = await Anime.create(body);
    revalidatePath('/');
    return NextResponse.json({ success: true, data: anime }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro ao criar anime' },
      { status: 400 }
    );
  }
}

