import { Gallery } from "@/lib/types/Gallery";
import { GalleryPersonData, NewPersonData, Person, PersonUpdate, Verification } from "@/lib/types/Person";


export const createPerson = async (newPerson: NewPersonData, galleryId?: string, emailOptIn?: boolean, smsOptIn?: boolean, admin?: string): Promise<Person> => {
    const res = await fetch(`/api/people${admin ? `?admin=${admin}` : ''}`, {
        method: 'POST',
        body: JSON.stringify({...newPerson})
    })
    const data = await res.json()
    if (!res.ok || !data.person) {
        throw new Error(data.error || 'We could not create your account. Please try again.')
    }
    const person = data.person
    if (galleryId) {
        await createGalleryPerson(galleryId, person.id, emailOptIn, smsOptIn)
    }
    return person
}

export const createGalleryPerson = async (galleryId: string, personId: string, emailOptIn?: boolean, smsOptIn?: boolean): Promise<Person> => {
    const data = await fetch(`/api/galleries/${galleryId}/people`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({personId, galleryId, emailOptIn: Boolean(emailOptIn), smsOptIn: Boolean(smsOptIn)})
    }).then(res => res.json())
    return data.person
}


export const updatePerson = async (personId: string, personUpdate: PersonUpdate): Promise<Person> => {
    const data = await fetch(`/api/people/${personId}`, {
        method: 'PUT',
        body: JSON.stringify({...personUpdate})
    }).then(res => res.json())
    return data.person
}

export const fetchPersonByEmail = async (email: string): Promise<Person | undefined> => {
    try {
        const data = await fetch(`/api/people?email=${encodeURIComponent(email)}`).then(res => res.json())
        return data.person
    } catch (error) {
        console.log(error)
        return undefined
    }
}

export const fetchPerson = async (personId: string): Promise<Person> => {
    try {
        const data = await fetch(`/api/people/${personId}`).then(res => res.json())
        return data.person
    } catch (error) {
        console.log(error)
        throw new Error('Person not found')
    }
}

export const fetchGalleryPeople = async (galleryId: string): Promise<GalleryPersonData[]> => {
    const data = await fetch(`/api/galleries/${galleryId}/people`).then(res => res.json())
    return data.people
}
export const fetchPersonGalleries = async (personId: string): Promise<Gallery[]> => {
    try {
        const data = await fetch(`/api/people/${personId}/galleries`).then(res => res.json())
        return data.galleries
    } catch (error) {
        console.log(error)
        throw new Error('Person not found')
    }
}

export const fetchVerification = async (verificationId: string): Promise<Verification> => {
    try {
        const data = await fetch(`/api/verifications/${verificationId}`).then(res => res.json())
        return data.verification
    } catch (error) {
        console.log(error)
        throw new Error('Verification not found')
    }
}

export const createVerification = async (personId: string, galleryName: string, email: string, name: string): Promise<Verification> => {
    const res = await fetch(`/api/verifications`, {
        method: 'POST',
        body: JSON.stringify({personId, galleryName, email, name})
    })
    const data = await res.json()
    if (!res.ok || !data.verification) {
        throw new Error(data.error || 'We could not send the verification email. Please try again.')
    }
    return data.verification
}
