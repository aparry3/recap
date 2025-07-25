import { Gallery } from "@/lib/types/Gallery";
import { GalleryPersonData, NewPersonData, Person, PersonUpdate, Verification } from "@/lib/types/Person";


export const createPerson = async (newPerson: NewPersonData, galleryId?: string, receiveMessages?: boolean, admin?: string): Promise<Person> => {
    const data = await fetch(`/api/people${admin ? `?admin=${admin}` : ''}`, {
        method: 'POST',
        body: JSON.stringify({...newPerson}) 
    }).then(res => res.json())
    const person = data.person
    if (galleryId) {
        await createGalleryPerson(galleryId, person.id, receiveMessages)
    }
    return person
}

export const createGalleryPerson = async (galleryId: string, personId: string, receiveMessages?: boolean): Promise<Person> => {
    const data = await fetch(`/api/galleries/${galleryId}/people`, {
        method: 'POST',
        body: JSON.stringify({personId, galleryId, receiveMessages}) 
    }).then(res => res.json())
    return data.person
}


export const updatePerson = async (personId: string, personUpdate: PersonUpdate & {receiveMessages?: boolean}): Promise<Person> => {
    const {receiveMessages, ...rest} = personUpdate
    const data = await fetch(`/api/people/${personId}`, {
        method: 'PUT',
        body: JSON.stringify({...rest}) 
    }).then(res => res.json())
    return data.person
}

export const fetchPersonByEmail = async (email: string): Promise<Person | undefined> => {
    try {
        const data = await fetch(`/api/people?email=${email}`).then(res => res.json())
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
    const data = await fetch(`/api/verifications`, {
        method: 'POST',
        body: JSON.stringify({personId, galleryName, email, name}) 
    }).then(res => res.json())
    return data.verification
}

