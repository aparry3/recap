// src/app/api/people/[personId]/route.ts
import { selectPersonGalleries } from '@/lib/db/personService';
import { NextResponse } from 'next/server';

export const GET = async (_req: Request, ctx: { params: { personId: string } }) => {
    const { personId } = ctx.params

    try {
        const galleries = await selectPersonGalleries(personId)
        return NextResponse.json({galleries}, {status: 200})
    } catch (error) {
        return NextResponse.json({error: 'Person not found'}, {status: 404})
    }
};

