import { Gallery } from "@/lib/types/Gallery";
import { GalleryPersonData, NewPersonData, Person, PersonUpdate } from "@/lib/types/Person";


export const createPerson = async (newPerson: NewPersonData, galleryId?: string): Promise<Person> => {
    const data = await fetch(`/api/people`, {
        method: 'POST',
        body: JSON.stringify({...newPerson}) 
    }).then(res => res.json())
    const person = data.person
    if (galleryId) {
        await createGalleryPerson(galleryId, person.id)
    }
    return person
}

export const createGalleryPerson = async (galleryId: string, personId: string): Promise<Person> => {
    const data = await fetch(`/api/galleries/${galleryId}/people`, {
        method: 'POST',
        body: JSON.stringify({personId, galleryId}) 
    }).then(res => res.json())
    return data.person
}


export const updatePerson = async (personId: string,personUpdate: PersonUpdate): Promise<Person> => {
    const data = await fetch(`/api/people/${personId}`, {
        method: 'POST',
        body: JSON.stringify({...personUpdate}) 
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
