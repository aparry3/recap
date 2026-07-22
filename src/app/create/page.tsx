"use client"
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
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
  const [_, setGalleryImages] = useLocalStorage<string>('galleryImages', '');
  const [verificationId, setVerificationId] = useState<string | undefined>(undefined);
  const [tempPerson, setTempPerson] = useState<{email?: string, name: string, personId: string} | undefined>(undefined)
  const [tempGallery, setTempGallery] = useState<{name: string, zola?: string, theKnot?: string} | undefined>()
  const [existingUser, setExistingUser] = useState(false)
  const [login, setLogin] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [submitError, setSubmitError] = useState('')

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
    if (isAdmin && person && (!targetPerson || targetPerson.email !== person.email || _email !== person.email)) {
      _gallery.createdBy = person.id
    }

    setGallery(_gallery)

    let _person: Person
    if (!targetPerson || targetPerson.email !== _email) {
      _person = await createPerson({name: _name, email: _email, isAdmin: false}, undefined, undefined, undefined, isAdmin ? person?.id : undefined)
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

    setStage(1) // Move to welcome stage
  }

  const handleSubmit = useCallback(async(_galleryName: string, _name: string, _email?: string, theKnot? :string, zola?: string) => {
    setSubmitError('')
    try {
      // Admin mode skips verification and creates the gallery directly
      if (isAdmin) {
        const _person = (_email && person?.email !== _email) ? await fetchPersonByEmail(_email) : undefined
        await submitGallery(_galleryName, _name, _email, theKnot, zola, (_person && _email) ? _person : person)
        return
      }

      if (!_email) {
        setSubmitError('An email address is required to create a gallery')
        return
      }

      // Already signed in with this email — no need to re-verify
      if (person?.email && person.email.trim().toLowerCase() === _email.trim().toLowerCase()) {
        setStage(1)
        await submitGallery(_galleryName, _name, _email, theKnot, zola, person)
        return
      }

      // Everyone else verifies their email before the gallery is created.
      // The only difference between a new and returning user is whether the person already exists.
      let target = await fetchPersonByEmail(_email)
      const isExisting = Boolean(target)
      if (!target) {
        target = await createPerson({name: _name, email: _email, isAdmin: false})
      }
      const verification = await createVerification(target.id, _galleryName, _email, _name)
      setExistingUser(isExisting)
      setTempPerson({personId: target.id, email: _email, name: _name})
      setTempGallery({name: _galleryName, zola, theKnot})
      setVerificationId(verification.id)
    } catch (error: any) {
      setSubmitError(error?.message || 'Something went wrong. Please try again.')
    }
  }, [person, isAdmin])

  const handleLogin = async (email: string) => {
    setLoginError('')
    try {
      const _person = await fetchPersonByEmail(email)
      if (!_person) {
        setLoginError('No user with that email address')
        return
      }
      const verification = await createVerification(_person.id, '', email, _person.name)
      setExistingUser(true)
      setTempPerson({personId: _person.id, email, name: _person.name})
      setVerificationId(verification.id)
    } catch (error: any) {
      setLoginError(error?.message || 'We could not send the verification email. Please try again.')
    }
  }

  const cancelValidate = () => {
    setTempPerson(undefined)
    setVerificationId(undefined)
    setStage(0)
  }

  const resendVerification = useCallback(async () => {
    if (!tempPerson?.email) return
    const verification = await createVerification(tempPerson.personId, tempGallery?.name || '', tempPerson.email, tempPerson.name)
    setVerificationId(verification.id)
  }, [tempPerson, tempGallery])

  const confirmValidate = async (validatedPerson: Person) => {
    setPerson(validatedPerson)
    setPersonId(validatedPerson.id)
    if (tempGallery) {
      const {name, theKnot, zola} = tempGallery
      setTempPerson(undefined)
      setVerificationId(undefined)
      setTempGallery(undefined)
      setStage(1)
      await submitGallery(name, validatedPerson.name, validatedPerson.email, theKnot, zola, validatedPerson)
    } else {
      router.push('/galleries')
    }
  }

  // Show validation if needed
  if (verificationId && tempPerson) {
    return (
      <ValidateUser
        verificationId={verificationId}
        person={tempPerson}
        confirm={confirmValidate}
        onBack={cancelValidate}
        resend={resendVerification}
        newUser={!existingUser}
      />
    )
  }

  // Show login if requested
  if (login) {
    return <Login back={() => setLogin(false)} loginError={loginError} onSubmit={handleLogin} />
  }

  // Show create form
  if (stage === 0) {
    return <Create login={() => setLogin(true)} person={person} onSubmit={handleSubmit} isAdmin={isAdmin} submitError={submitError} />
  }

  // Show welcome page
  if (stage === 1 && gallery) {
    return <Welcome gallery={gallery} isAdmin={isAdmin} />
  }

  return null
}

export default CreatePage
