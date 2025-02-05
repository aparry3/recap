"use client"
import { Person } from '@/lib/types/Person';
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import useLocalStorage from '../hooks/localStorage';
import { createPerson, createVerification, fetchPerson, fetchPersonByEmail } from '../api/personClient';
import PersonPage from '@/components/PersonPage';
import { Container, Text } from 'react-web-layout-components';
import styles from './Providers.module.scss'
import ValidateUser from '@/components/PersonPage/ValidateUser';
import { Gallery } from '@/lib/types/Gallery';


type UserContextType = {
  personId?: string;
  person?: Person;
  loading: boolean;
};


const UserContext = createContext<UserContextType | null>(null);


export const UserProvider: React.FC<{
  children: React.ReactNode, 
  gallery: Gallery
}> = ({ children, gallery }) => {
    const [personId, setPersonId, personLoading] = useLocalStorage<string>('personId', '');
    const [person, setPerson] = useState<Person | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(personLoading);
    const [showValidate, setShowValidate] = useState<boolean>(false)
    const [tempPerson, setTempPerson] = useState<{personId: string, email?: string, name: string} | undefined>(undefined)
    const [verificationId, setVerificationId] = useState<string>('')

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

    const _createPerson = useCallback(async (name: string, email?: string) => {
      setLoading(true)  
      const newPerson = await createPerson({name, email}, gallery.id)
      setPerson(newPerson)
      setPersonId(newPerson.id)
      setLoading(false)
    }, [gallery.id])

    const submitPerson = useCallback(async (name: string, email?: string) => {
        setLoading(true)
        if (email) {
          const _person = await fetchPersonByEmail(email)
          if (_person) {
            const verification = await createVerification(_person.id, gallery.name, email, name)
            setVerificationId(verification.id)
            setTempPerson({personId: _person.id, email, name})
            setLoading(false)
            setShowValidate(true)
            return
          }
        }
        await _createPerson(name, email)
    }, [gallery.name])

    const cancelValidate = () => {
      setShowValidate(false)
      setTempPerson(undefined)
    }

    const skipValidate = useCallback(async () => {
      if (tempPerson) {
        await _createPerson(tempPerson.name, tempPerson.email)
      }
      setShowValidate(false)  
    }, [tempPerson, _createPerson])

    const confirmValidate = (person: Person) => {
      setPerson(person)
      setPersonId(person.id)
      setTempPerson(undefined)
      setVerificationId('')
      setShowValidate(false)
    }
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
      {showValidate && tempPerson &&(
        <ValidateUser verificationId={verificationId} person={tempPerson} confirm={confirmValidate} onBack={cancelValidate} skip={skipValidate}/>
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