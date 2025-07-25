import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { selectPerson } from '../db/personService';

export async function checkAdminAuth(request: NextRequest): Promise<{ isAdmin: boolean; personId?: string; error?: string }> {
    try {
        // Get person ID from cookie
        const cookieStore = await cookies();
        const personIdCookie = cookieStore.get('personId');
        
        if (!personIdCookie?.value) {
            return { isAdmin: false, error: 'No authentication found' };
        }
        
        const personId = personIdCookie.value;
        
        // Get person data and check admin status
        const person = await selectPerson(personId);
        
        if (!person) {
            return { isAdmin: false, error: 'User not found' };
        }
        
        if (!person.isAdmin) {
            return { isAdmin: false, personId, error: 'Not authorized' };
        }
        
        return { isAdmin: true, personId };
    } catch (error) {
        console.error('Admin auth check failed:', error);
        return { isAdmin: false, error: 'Authentication check failed' };
    }
}

export async function requireAdmin() {
    const cookieStore = cookies();
    const personId = (await cookieStore).get('personId')?.value;
    
    if (!personId) {
        throw new Error('Unauthorized: No user session');
    }
    
    const person = await selectPerson(personId);
    
    if (!person || !person.isAdmin) {
        throw new Error('Unauthorized: Admin access required');
    }
    
    return person;
}

export async function isUserAdmin(personId: string | null | undefined): Promise<boolean> {
    if (!personId) return false;
    
    const person = await selectPerson(personId);
    return person?.isAdmin || false;
}

export function createAdminMiddleware() {
    return async function adminMiddleware(request: NextRequest) {
        const { isAdmin, error } = await checkAdminAuth(request);
        
        if (!isAdmin) {
            return NextResponse.json(
                { error: error || 'Unauthorized' },
                { status: 401 }
            );
        }
        
        return NextResponse.next();
    };
}