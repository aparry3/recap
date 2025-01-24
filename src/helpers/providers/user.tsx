"use client"
import { Person } from '@/lib/types/Person';
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import useLocalStorage from '../hooks/localStorage';
import { createPerson, fetchPerson } from '../api/personClient';
import PersonPage from '@/components/PersonPage';
import { Container, Text } from 'react-web-layout-components';
import styles from './Providers.module.scss'

type UserContextType = {
  personId?: string;
  person?: Person;
  loading: boolean;
};

const UserContext = createContext<UserContextType | null>(null);


export const UserProvider: React.FC<{
  children: React.ReactNode, 
  galleryId: string
}> = ({ children, galleryId }) => {
    const [personId, setPersonId, personLoading] = useLocalStorage<string>('personId', '');
    const [person, setPerson] = useState<Person | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(personLoading);

    const initPerson = async (_personId: string) => {
        const _person = await fetchPerson(personId)
        setPerson(_person)
        setLoading(false)
    }

    useEffect(() => {
      if (personId) {
        initPerson(personId);
      } else if (!personLoading) {
          setLoading(false)
      }
    }, [personId, personLoading]);

    const submitPerson = useCallback(async (name: string, email?: string) => {
        setLoading(true)
        const newPerson = await createPerson({name, email}, galleryId)
        setPerson(newPerson)
        setPersonId(newPerson.id)
        setLoading(false)
    }, [galleryId])

  return (
    <UserContext.Provider value={{ personId, person, loading }}>
      {(!loading && person) ? children :
      (!loading && !person) ? (
        <PersonPage person={person} onSubmit={submitPerson}/>
      ) : (
        <Container className={styles.loading}>
          <Text size={2}>Loading...</Text>
        </Container>
      )}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
};