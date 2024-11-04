"use client"
import React, { FC, useEffect, useState } from 'react';
import Welcome from './Welcome';
import Create from './Create';
import { createGallery } from '@/helpers/api/galleryClient';
import { Gallery, NewGalleryData } from '@/lib/types/Gallery';
import { Person } from '@/lib/types/Person';
import { createPerson, fetchPerson, updatePerson } from '@/helpers/api/personClient';

const CreatePage: FC = () => {
  const [stage, setStage] = useState(0)
  const [gallery, setGallery] = useState<NewGalleryData | Gallery>()
  const [person, setPerson] = useState<Person>()

  const populatePerson = async (personId: string) => {
    const _person = await fetchPerson(personId)
    setPerson(_person)
  }
  useEffect(() => {
    const personId = localStorage.getItem('personId')
    if (personId) {
      populatePerson(personId)
    }
  }, [])

  const handleSubmit = async(_galleryName: string, _name: string, _email: string) => {
    const url = `${_galleryName.toLowerCase().replaceAll(' ', '-')}`
    let _gallery = {name: _galleryName, path: url}
    
    setStage(1)
    setGallery(_gallery)

    let _person: Person
    if (!person) {
      _person = await createPerson({name: _name, email: _email})
      localStorage.setItem('personId', _person.id)
    } else if (person.name !== _name || person.email !== _email) {
      _person = await updatePerson(person.id, {name: _name, email: _email})
    } else {
      _person = person
    }
    setPerson(_person)

    _gallery = await createGallery(_gallery, _person.id)
    setGallery(_gallery)
  }

  return stage && gallery ? <Welcome gallery={gallery}/> : <Create person={person} onSubmit={handleSubmit}/>;
};

export default CreatePage;