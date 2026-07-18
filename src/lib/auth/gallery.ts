import { selectGallery } from '@/lib/db/galleryService'
import { selectPerson } from '@/lib/db/personService'
import { Gallery } from '@/lib/types/Gallery'
import { Person } from '@/lib/types/Person'
import { getAuthenticatedPersonId } from './session'

export class AuthorizationError extends Error {
  status: number

  constructor(message: string, status = 401) {
    super(message)
    this.name = 'AuthorizationError'
    this.status = status
  }
}

export async function requireGalleryManager(galleryId: string): Promise<{ person: Person; gallery: Gallery }> {
  const personId = await getAuthenticatedPersonId()
  if (!personId) throw new AuthorizationError('A verified session is required')

  const [person, gallery] = await Promise.all([
    selectPerson(personId),
    selectGallery(galleryId),
  ])

  const isOwner = gallery.personId === person.id
  if (!isOwner && !person.isAdmin) {
    throw new AuthorizationError('Gallery owner or admin access is required', 403)
  }

  return { person, gallery }
}
