// src/app/api/galleries/route.ts
import { GalleryUpdate, NewGallery } from '@/lib/types/Gallery';
import { NextApiRequest } from 'next';

export const PUT = async (req: Request, ctx: { params: { galleryId: string } }) => {
    const galleryUpdate: GalleryUpdate = await req.json()
    const { galleryId } = ctx.params
};

export const GET = async (req: Request, ctx: { params: { galleryId: string } }) => {
    const galleryUpdate: GalleryUpdate = await req.json()
    const { galleryId } = ctx.params
};

