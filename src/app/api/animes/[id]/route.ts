import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import connectToDatabase from '@/app/lib/mongoose';
import Anime from '@/app/models/Anime';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const { id } = params;
    await Anime.findByIdAndDelete(id);
    revalidatePath('/');
    return NextResponse.json({ success: true, message: 'Anime deletado com sucesso' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro ao deletar anime' },
      { status: 400 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const { id } = context.params;
    const updatedData = await request.json();
    const updatedAnime = await Anime.findByIdAndUpdate(id, updatedData, { new: true });
    revalidatePath('/');
    return NextResponse.json({ success: true, data: updatedAnime });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar anime' },
      { status: 400 }
    );
  }
}