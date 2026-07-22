"use client"
import { Person, Verification } from '@/lib/types/Person';
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import useLocalStorage from '../hooks/localStorage';
import { createGalleryPerson, createPerson, createVerification, fetchPerson, fetchPersonByEmail, updatePerson } from '../api/personClient';
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
    const [tempPerson, setTempPerson] = useState<{personId: string, email?: string, phone?: string, name: string, emailOptIn?: boolean, smsOptIn?: boolean} | undefined>(undefined)
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

    const _createPerson = useCallback(async (name: string, email?: string, phone?: string, emailOptIn?: boolean, smsOptIn?: boolean) => {
      setLoading(true)  
      const newPerson = await createPerson({name, email, phone, isAdmin: false}, gallery.id, emailOptIn, smsOptIn)
      setPerson(newPerson)
      setPersonId(newPerson.id)
      setLoading(false)
    }, [gallery.id])

    const submitPerson = useCallback(async (name: string, email?: string, phone?: string, emailOptIn?: boolean, smsOptIn?: boolean) => {
        setLoading(true)
        try {
          if (email) {
            const _person = await fetchPersonByEmail(email)
            if (_person) {
              const verification = await createVerification(_person.id, gallery.name, email, name)
              setVerificationId(verification.id)
              setTempPerson({personId: _person.id, email, name, phone, emailOptIn, smsOptIn})
              setLoading(false)
              setShowValidate(true)
              return
            }
          }
          await _createPerson(name, email, phone, emailOptIn, smsOptIn)
        } catch (error) {
          console.error('Error submitting person:', error)
          setLoading(false)
        }
    }, [gallery.name])

    const cancelValidate = () => {
      setShowValidate(false)
      setTempPerson(undefined)
    }

    const resendVerification = useCallback(async () => {
      if (!tempPerson?.email) return
      const verification = await createVerification(tempPerson.personId, gallery.name, tempPerson.email, tempPerson.name)
      setVerificationId(verification.id)
    }, [tempPerson, gallery.name])

    const confirmValidate = async (verification: Verification) => {
      if (!tempPerson) return
      const person = await updatePerson(verification.personId, {
        name: tempPerson.name,
        email: tempPerson.email,
        phone: tempPerson.phone,
      })
      setPerson(person)
      setPersonId(person.id)
      await createGalleryPerson(gallery.id, person.id, tempPerson?.emailOptIn, tempPerson?.smsOptIn)
      setTempPerson(undefined)
      setVerificationId('')
      setShowValidate(false)
    }
  return (
    <UserContext.Provider value={{ personId, person, loading }}>
      {(!loading && person) ? children :
      (!loading && !person) ? (
        <PersonPage person={person} galleryName={gallery.name} onSubmit={submitPerson}/>
      ) : (
        <Container className={styles.loading}>
          <Text size={2}>Loading...</Text>
        </Container>
      )}
      {showValidate && tempPerson &&(
        <ValidateUser verificationId={verificationId} person={tempPerson} confirm={confirmValidate} onBack={cancelValidate} resend={resendVerification}/>
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
