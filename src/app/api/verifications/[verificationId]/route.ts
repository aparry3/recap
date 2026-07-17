// src/app/api/people/[verification]/route.ts
import { selectVerification } from '@/lib/db/personService';
import { NextResponse } from 'next/server';


export const GET = async (_req: Request, ctx: { params: Promise<{ verificationId: string }> }) => {
    const { verificationId } = await ctx.params
    
    try {
        const verification = await selectVerification(verificationId)
        return NextResponse.json({verification}, {status: 200})
    } catch (error) {
        return NextResponse.json({error: 'Verification not found'}, {status: 404})
    }
};
