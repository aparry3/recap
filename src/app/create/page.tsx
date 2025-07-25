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

  const submitGallery = async (_galleryName: string, _name: string, _email?: string, theKnot? :string, zola?: string, targetPerson?: Person) => {
    const url = `${_galleryName.toLowerCase().replaceAll(' ', '-')}`
    let _gallery = {name: _galleryName, path: url, password: generateRandomString(4)} as NewGalleryData
    if (theKnot) {
      _gallery.theknot = theKnot
    }
    if (zola) {
      _gallery.zola = zola
    }
    
    // If admin is creating for someone else, set createdBy to admin's ID
    // person is the current logged-in user (admin), targetPerson is who the gallery is for
    // TODO change this so that we just wait until creation and at the last minute set the createdBy to the personId since
    // we wont update person if admin, but if not admin, maybe we should update personId to the targetPersonId
    if (isAdmin && person && (!targetPerson || targetPerson.email !== person.email || _email !== person.email)) {
      _gallery.createdBy = person.id
    }

    setGallery(_gallery)

    let _person: Person
    if (!targetPerson || targetPerson.email !== _email) {
      _person = await createPerson({name: _name, email: _email, isAdmin: false}, undefined, undefined, isAdmin ? person?.id : undefined)
      // Never update personId when admin is creating for someone else
      // Only update if it's the current user creating their own gallery
      if (!isAdmin || !person || (_email === person?.email)) {
        setPersonId(_person.id)
      }
    } else if (targetPerson.name !== _name) {
      _person = await updatePerson(targetPerson.id, {name: _name, email: _email})
    } else {
      _person = targetPerson
    }

    const _newGallery = await createGallery(_gallery, _person.id)
    if (isAdmin) {
      router.push(`/admin`)
    }
    if (_newGallery.images.length > 0) {
      setGalleryImages(_newGallery.images.join(','))
    }
    setGallery(_newGallery)
    
    // Only update person state if not admin or if creating for self
    if (!isAdmin || (_email === person?.email)) {
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
      const newPerson = await createPerson({name: tempPerson.name, email: tempPerson.email, isAdmin: false})
      // Only update person state if not admin or if creating for self
      if (!isAdmin || (tempPerson.email === person?.email)) {
        setPerson(newPerson)
      }
      await submitGallery(tempGallery?.name || '', newPerson.name, newPerson.email, tempGallery?.theKnot, tempGallery?.zola, newPerson)
    }
    setVerificationId(undefined)  
    setTempPerson(undefined)
    setTempGallery(undefined)
  }, [tempPerson, isAdmin, person])

  const confirmValidate = async (validatedPerson: Person) => {
    // Only update person state if not admin or if validating self
    if (!isAdmin || (validatedPerson.email === person?.email)) {
      setPerson(validatedPerson)
    }
    if (tempGallery) {
      setTempPerson(undefined)
      await submitGallery(tempGallery?.name || '', validatedPerson.name, validatedPerson.email, tempGallery?.theKnot, tempGallery?.zola, validatedPerson)
      setTempGallery(undefined)
      setVerificationId(undefined)  
    } else {
      // Only update personId if not admin or if validating self
      if (!isAdmin || (validatedPerson.email === person?.email)) {
        setPersonId(validatedPerson.id)
      }
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