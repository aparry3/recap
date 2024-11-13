import { GalleryPersonData, NewPersonData, Person, PersonUpdate } from "@/lib/types/Person";


export const createPerson = async (galleryId: string, newPerson: NewPersonData): Promise<Person> => {
    const data = await fetch(`/api/people`, {
        method: 'POST',
        body: JSON.stringify({...newPerson, galleryId}) 
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