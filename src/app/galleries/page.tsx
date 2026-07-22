"use client"
import React, { FC, useEffect, useState } from 'react';
import { Gallery } from '@/lib/types/Gallery';
import { Person } from '@/lib/types/Person';
import { fetchAuthenticatedPerson, fetchPersonGalleries } from '@/helpers/api/personClient';
import useLocalStorage from '@/helpers/hooks/localStorage';
import Galleries from './Galleries';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';


const GalleriesPage: FC = () => {
    const router = useRouter()
    const [galleries, setGalleries] = useState<Gallery[]>([])
    const [person, setPerson] = useState<Person>()
    const [_, setPersonId] = useLocalStorage<string>('personId', '');
    const [loading, setLoading] = useState<boolean>(true);
    
    const init = async () => {
        try {
            const _person = await fetchAuthenticatedPerson()
            if (!_person) {
                setPersonId('')
                router.push('/create')
                return
            }
            setPersonId(_person.id)
            const _galleries = await fetchPersonGalleries(_person.id)
            setPerson(_person)
            setGalleries(_galleries)
            setLoading(false)
        } catch (error: any) {
            console.log(error)
            setPersonId('')
        }
    }
    useEffect(() => {
        init()
        // Session state is authoritative on initial page load.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


  return loading ? <Loading /> : <Galleries galleries={galleries} person={person}/>;
};

export default GalleriesPage;
