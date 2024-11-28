"use client"
import React, { FC, useEffect, useState } from 'react';
import { Gallery } from '@/lib/types/Gallery';
import { Person } from '@/lib/types/Person';
import { fetchPerson, fetchPersonGalleries } from '@/helpers/api/personClient';
import useLocalStorage from '@/helpers/hooks/localStorage';
import Galleries from './Galleries';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';


const GalleriesPage: FC = () => {
    const router = useRouter()
    const [galleries, setGalleries] = useState<Gallery[]>([])
    const [person, setPerson] = useState<Person>()
    const [personId, setPersonId, personLoading] = useLocalStorage<string>('personId', '');
    const [loading, setLoading] = useState<boolean>(true);
    
    const init = async (personId: string) => {
        try {
            const [_person, _galleries] = await Promise.all([fetchPerson(personId), fetchPersonGalleries(personId)])
            setPerson(_person)
            setGalleries(_galleries)
            if (!_person) return router.push('/create')
            setLoading(false)
        } catch (error: any) {
            alert('ERROR ' + error.message)

            console.log(error)
            setPersonId('')
        }
    }
    useEffect(() => {
        if (!personLoading) {
            if (personId) {
                init(personId)
            } else {
                router.push('/create')
            }    
        }
    }, [personId, personLoading])


  return loading ? <Loading /> : <Galleries galleries={galleries} person={person}/>;
};

export default GalleriesPage;