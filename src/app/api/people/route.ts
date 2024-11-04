// src/app/api/people/route.ts
import { insertPerson } from '@/lib/db/personService';
import { NewPersonData } from '@/lib/types/Person';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
    const newPerson: NewPersonData = await req.json()
    const person = await insertPerson(newPerson)

    return NextResponse.json({person}, {status: 200})
};
