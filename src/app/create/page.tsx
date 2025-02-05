"use client"
import React, { FC, useCallback, useEffect, useState } from 'react';
import Welcome from './Welcome';
import Create from '../../components/PersonPage/Create';
import { createGallery } from '@/helpers/api/galleryClient';
import { Gallery, NewGallery, NewGalleryData } from '@/lib/types/Gallery';
import { Person } from '@/lib/types/Person';
import { createPerson, createVerification, fetchPerson, fetchPersonByEmail, updatePerson } from '@/helpers/api/personClient';
import useLocalStorage from '@/helpers/hooks/localStorage';
import { generateRandomString } from '@/helpers/utils';
import ValidateUser from '@/components/PersonPage/ValidateUser';


const CreatePage: FC = () => {
  const [stage, setStage] = useState(0)
  const [gallery, setGallery] = useState<NewGalleryData | Gallery>()
  const [person, setPerson] = useState<Person>()
  const [personId, setPersonId] = useLocalStorage<string>('personId', '');
  const [verificationId, setVerificationId] = useState<string | undefined>('verificationId');
  const [tempPerson, setTempPerson] = useState<{email?: string, name: string, personId: string} | undefined>(undefined)
  const [tempGallery, setTempGallery] = useState<{name: string, zola?: string, theKnot?: string} | undefined>()

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
      _gallery.zola = theKnot
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
    setPerson(_person)

    const _newGallery = await createGallery(_gallery, _person.id)
    setGallery(_newGallery)
  }
  
  const handleSubmit = useCallback(async(_galleryName: string, _name: string, _email?: string, theKnot? :string, zola?: string) => {
    console.log("handle submit")
    let _person
    if (_email) {
      _person = await fetchPersonByEmail(_email)
    }
    if (_email && ((!person && _person) || (person && person.email !== _email))) {
      const id = person?.id || _person?.id || ''
      if (!id) return
      const verification = await createVerification(id, _galleryName, _email, _name)
      setVerificationId(verification.id)
      setTempPerson({personId: id, email: _email, name: _name})
      setTempGallery({name: _galleryName, zola, theKnot})
    } else {
      submitGallery(_galleryName, _name, _email, theKnot, zola, person)
    }
  }, [person])

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
    await submitGallery(tempGallery?.name || '', person.name, person.email, tempGallery?.theKnot, tempGallery?.zola, person)

    setTempPerson(undefined)
    setTempGallery(undefined)
    setVerificationId('')
  }
  

  return verificationId && tempPerson ? (
  <ValidateUser verificationId={verificationId} person={tempPerson} confirm={confirmValidate} onBack={cancelValidate} skip={skipValidate}/>
  ) : stage && gallery ? <Welcome gallery={gallery}/> : <Create person={person} onSubmit={handleSubmit}/>;
};

export default CreatePage;