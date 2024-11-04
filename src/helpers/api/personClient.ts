import { Gallery } from "@/lib/types/Gallery";
import { NewPersonData, Person, PersonUpdate } from "@/lib/types/Person";


export const createPerson = async (newPerson: NewPersonData): Promise<Person> => {
    const data = await fetch('/api/people', {
        method: 'POST',
        body: JSON.stringify({...newPerson}) 
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
    const data = await fetch(`/api/people/${personId}`).then(res => res.json())
    return data.person
}