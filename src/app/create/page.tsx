"use client"
import React, { FC, useCallback, useEffect, useState, useMemo } from 'react';
import Welcome from './Welcome';
import Create from '../../components/PersonPage/Create';
import StripeForm from './components/StripeForm';
import { createGallery } from '@/helpers/api/galleryClient';
import { Gallery, NewGalleryData } from '@/lib/types/Gallery';
import { Person } from '@/lib/types/Person';
import { createPerson, createVerification, fetchPerson, fetchPersonByEmail, updatePerson } from '@/helpers/api/personClient';
import useLocalStorage from '@/helpers/hooks/localStorage';
import { generateRandomString } from '@/helpers/utils';
import ValidateUser from '@/components/PersonPage/ValidateUser';
import Login from './Login';
import { useRouter } from 'next/navigation';

const CreatePage: FC = () => {
  const router = useRouter()
  const [stage, setStage] = useState(0)
  const [gallery, setGallery] = useState<NewGalleryData | Gallery>()
  const [galleryData, setGalleryData] = useState<{galleryName: string, name: string, email?: string, zola?: string, theKnot?: string, person?: Person}>()
  const [person, setPerson] = useState<Person>()
  const [personId, setPersonId] = useLocalStorage<string>('personId', '');
  const [_, setGalleryImages] = useLocalStorage<string>('galleryImages', '');
  const [verificationId, setVerificationId] = useState<string | undefined>(undefined);
  const [tempPerson, setTempPerson] = useState<{email?: string, name: string, personId: string} | undefined>(undefined)
  const [tempGallery, setTempGallery] = useState<{name: string, zola?: string, theKnot?: string} | undefined>()
  const [login, setLogin] = useState(false)
  const [loginError, setLoginError] = useState('')
  
  // Check if user is admin based on database flag
  const isAdmin = useMemo(() => {
    return person?.isAdmin || false
  }, [person])

  // Add scroll to top effect when stage changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [stage]);

  const populatePerson = async (personId: string) => {
    try {
      const _person = await fetchPerson(personId)
      setPerson(_person)
    } catch (error) {
      console.log(error)
      setPersonId('')
    }
  }

  useEffect(() => {
    if (personId) {
      populatePerson(personId)
    }
  }, [personId])

  const submitGallery = async (_galleryName: string, _name: string, _email?: string, theKnot? :string, zola?: string, person?: Person) => {
    const url = `${_galleryName.toLowerCase().replaceAll(' ', '-')}`
    let _gallery = {name: _galleryName, path: url, password: generateRandomString(4)} as NewGalleryData
    if (theKnot) {
      _gallery.theknot = theKnot
    }
    if (zola) {
      _gallery.zola = zola
    }

    setGallery(_gallery)

    let _person: Person
    if (!person || person.email !== _email) {
      _person = await createPerson({name: _name, email: _email, isAdmin: false})
      // Only update personId in localStorage if we're not an admin creating for someone else
      if (!isAdmin) {
        setPersonId(_person.id)
      }
    } else if (person.name !== _name) {
      _person = await updatePerson(person.id, {name: _name, email: _email})
    } else {
      _person = person
    }

    const _newGallery = await createGallery(_gallery, _person.id)
    if (_newGallery.images.length > 0) {
      setGalleryImages(_newGallery.images.join(','))
    }
    setGallery(_newGallery)
    
    // If we're not an admin, update the current person state
    if (!isAdmin) {
      setPerson(_person)
    }
    
    setStage(2) // Move to welcome stage
  }
  
  const handleSubmit = useCallback(async(_galleryName: string, _name: string, _email?: string, theKnot? :string, zola?: string) => {
    let _person
    if (_email && person?.email !== _email) {
      _person = await fetchPersonByEmail(_email)
    }
    
    // If admin mode is enabled, skip payment and verification
    if (isAdmin) {
      if (_person && _email) {
        // Create gallery for existing user directly
        setGalleryData({galleryName: _galleryName, name: _name, email: _email, zola, theKnot, person: _person})
        await submitGallery(_galleryName, _name, _email, theKnot, zola, _person)
      } else {
        // Create gallery for new user directly
        setGalleryData({galleryName: _galleryName, name: _name, email: _email, zola, theKnot, person})
        await submitGallery(_galleryName, _name, _email, theKnot, zola, person)
      }
      return
    }
    
    // Normal user flow
    if (_person && _email) {
      // Existing user found, start verification process
      const verification = await createVerification(_person.id, _galleryName, _email, _name)
      setVerificationId(verification.id)
      setTempPerson({personId: _person.id, email: _email, name: _name})
      setTempGallery({name: _galleryName, zola, theKnot})
    } else {
      // New user, proceed directly to gallery creation
      setGalleryData({galleryName: _galleryName, name: _name, email: _email, zola, theKnot, person})

      setStage(1) // Move to payment stage
    }
  }, [person, isAdmin])

  const handleLogin = async (email: string) => {
    console.log(email)
    const _person = await fetchPersonByEmail(email)
    if (_person) {
      setTempPerson({personId: _person.id, email, name: _person.name})
      const verification = await createVerification(_person.id, '', email, _person.name)
      setVerificationId(verification.id)
    } else {
      setLoginError('No user with that email address')
    }
  }

  const cancelValidate = () => {
    setTempPerson(undefined)
    setVerificationId(undefined)
    setStage(0)
  }

  const skipValidate = useCallback(async () => {
    if (tempPerson && tempGallery) {
      const person = await createPerson({name: tempPerson.name, email: tempPerson.email, isAdmin: false})
      setPerson(person)
      await submitGallery(tempGallery?.name || '', person.name, person.email, tempGallery?.theKnot, tempGallery?.zola, person)
    }
    setVerificationId(undefined)  
    setTempPerson(undefined)
    setTempGallery(undefined)
  }, [tempPerson])

  const confirmValidate = async (person: Person) => {
    setPerson(person)
    if (tempGallery) {
      setTempPerson(undefined)
      await submitGallery(tempGallery?.name || '', person.name, person.email, tempGallery?.theKnot, tempGallery?.zola, person)
      setTempGallery(undefined)
      setVerificationId(undefined)  
    } else {
      setPersonId(person.id)
      router.push('/galleries')
    }
  }

  const handlePaymentSuccess = useCallback(async () => {
    if (galleryData) {
      setStage(2)
      await submitGallery(galleryData?.galleryName, galleryData.name, galleryData.email, galleryData.theKnot, galleryData.zola, galleryData.person)
    }

  }, [galleryData])

  const handlePaymentCancel = () => {
    setStage(0)
  }

  // Show validation if needed
  if (verificationId && tempPerson) {
    return (
      <ValidateUser 
        verificationId={verificationId} 
        person={tempPerson} 
        confirm={confirmValidate} 
        onBack={cancelValidate} 
        skip={skipValidate}
      />
    )
  }

  // Show login if requested
  if (login) {
    return <Login back={() => setLogin(false)} loginError={loginError} onSubmit={handleLogin} />
  }

  // Show create form
  if (stage === 0) {
    return <Create login={() => setLogin(true)} person={person} onSubmit={handleSubmit} isAdmin={isAdmin} />
  }

  // Show payment form
  if (stage === 1 && galleryData) {
    return (
      <StripeForm 
        onSuccess={handlePaymentSuccess}
        onCancel={handlePaymentCancel}
      />
    )
  }

  // Show welcome page
  if (stage === 2 && gallery) {
    return <Welcome gallery={gallery} isAdmin={isAdmin} />
  }

  return null
}

export default CreatePage