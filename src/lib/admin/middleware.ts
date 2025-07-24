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