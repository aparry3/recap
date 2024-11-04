// src/app/api/galleries/route.ts
import { NewPersonData } from '@/lib/types/Person';

export const POST = async (req: Request, ctx: { params: { galleryId: string } }) => {
    const newPerson: NewPersonData = await req.json()
    const { galleryId } = ctx.params
};
