import { NextResponse } from 'next/server';
import { selectPerson } from '../db/personService';
import { getAuthenticatedPersonId } from '../auth/session';

export async function checkAdminAuth(): Promise<{ isAdmin: boolean; personId?: string; error?: string }> {
    try {
        // Admin APIs require the signed HTTP-only session, not the legacy personId cookie.
        const personId = await getAuthenticatedPersonId();
        if (!personId) {
            return { isAdmin: false, error: 'No authentication found' };
        }
        
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
    const personId = await getAuthenticatedPersonId();
    
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
    return async function adminMiddleware() {
        const { isAdmin, error } = await checkAdminAuth();
        
        if (!isAdmin) {
            return NextResponse.json(
                { error: error || 'Unauthorized' },
                { status: 401 }
            );
        }
        
        return NextResponse.next();
    };
}
