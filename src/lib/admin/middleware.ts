import { NextResponse } from 'next/server';
import { selectPerson } from '../db/personService';
import { getAuthenticatedPersonId } from '../auth/session';

export class AdminAuthorizationError extends Error {
    constructor(message: string, public readonly status: 401 | 403) {
        super(message);
        this.name = 'AdminAuthorizationError';
    }
}

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
        throw new AdminAuthorizationError('No authenticated user session', 401);
    }
    
    let person;
    try {
        person = await selectPerson(personId);
    } catch {
        throw new AdminAuthorizationError('The authenticated user no longer exists', 401);
    }
    
    if (!person || !person.isAdmin) {
        throw new AdminAuthorizationError('Admin access is required', 403);
    }
    
    return person;
}

export async function requireSuperAdmin() {
    const person = await requireAdmin();
    if (!person.isSuperAdmin) {
        throw new AdminAuthorizationError('Super-admin access is required', 403);
    }
    return person;
}

export function adminErrorResponse(error: unknown, fallbackMessage: string) {
    if (error instanceof AdminAuthorizationError) {
        return NextResponse.json({error: error.message}, {status: error.status});
    }
    return NextResponse.json({error: fallbackMessage}, {status: 500});
}

export function logUnexpectedAdminError(context: string, error: unknown) {
    if (!(error instanceof AdminAuthorizationError)) {
        console.error(context, error);
    }
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
