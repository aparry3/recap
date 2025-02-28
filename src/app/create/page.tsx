"use client"
import React, { FC, useCallback, useEffect, useState } from 'react';
import Welcome from './Welcome';
import Create from '../../components/PersonPage/Create';
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
  const [person, setPerson] = useState<Person>()
  const [personId, setPersonId] = useLocalStorage<string>('personId', '');
  const [galleryImages, setGalleryImages] = useLocalStorage<string>('galleryImages', '');
  const [verificationId, setVerificationId] = useState<string | undefined>('verificationId');
  const [tempPerson, setTempPerson] = useState<{email?: string, name: string, personId: string} | undefined>(undefined)
  const [tempGallery, setTempGallery] = useState<{name: string, zola?: string, theKnot?: string} | undefined>()
  const [login, setLogin] = useState(false)
  const [loginError, setLoginError] = useState('')

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

    setStage(1)
    setGallery(_gallery)

    let _person: Person
    if (!person || person.email !== _email) {
      _person = await createPerson({name: _name, email: _email})
      setPersonId(_person.id)
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
    setPerson(_person)
  }
  
  const handleSubmit = useCallback(async(_galleryName: string, _name: string, _email?: string, theKnot? :string, zola?: string) => {
    let _person
    if (_email && person?.email !== _email) {
      _person = await fetchPersonByEmail(_email)
    }
    if (_person && _email) {
      const verification = await createVerification(_person.id, _galleryName, _email, _name)
      setVerificationId(verification.id)
      setTempPerson({personId: _person.id, email: _email, name: _name})
      setTempGallery({name: _galleryName, zola, theKnot})
    } else {
      submitGallery(_galleryName, _name, _email, theKnot, zola, person)
    }
  }, [person])

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
  }

  const skipValidate = useCallback(async () => {
    if (tempPerson && tempGallery) {
      const person = await createPerson({name: tempPerson.name, email: tempPerson.email})
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
      setVerificationId('')  
    } else {
      setPersonId(person.id)
      router.push('/galleries')
    }

  }

  return (verificationId && tempPerson) ? (
  <ValidateUser verificationId={verificationId} person={tempPerson} confirm={confirmValidate} onBack={cancelValidate} skip={skipValidate}/>
  ) : (stage && gallery) ? <Welcome gallery={gallery}/> : login ? <Login back={() => setLogin(false)} loginError={loginError} onSubmit={handleLogin} /> : <Create login={() => setLogin(true)} person={person} onSubmit={handleSubmit}/>;
};

export default CreatePage;