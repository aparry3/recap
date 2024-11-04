// src/app/api/people/[personId]/route.ts
import { fetchPerson } from '@/helpers/api/personClient';
import { selectPerson } from '@/lib/db/personService';
import { PersonUpdate } from '@/lib/types/Person';
import { NextResponse } from 'next/server';

export const PUT = async (req: Request, ctx: { params: { personId: string } }) => {
    const personUpdate: PersonUpdate = await req.json()
    const { personId } = ctx.params
};

export const GET = async (_req: Request, ctx: { params: { personId: string } }) => {
    const { personId } = ctx.params

    const person = await selectPerson(personId)
    if (!person) {
        return NextResponse.json({error: 'Person not found'}, {status: 404})
    }
    return NextResponse.json({person}, {status: 200})
};

