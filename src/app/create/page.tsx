"use client"
import React, { FC, useMemo, useState } from 'react';
import Welcome from './Welcome';
import Create from './Create';

const CreatePage: FC = () => {
  const [stage, setStage] = useState(0)
  const [name, setName] = useState(''); 
  const [email, setEmail] = useState('');

  const handleSubmit = (_name: string, _email: string) => {
    setName(_name)
    setEmail(_email)
    setStage(1)
  }
  const url = useMemo(() => `/${name.toLowerCase().replaceAll(' ', '-')}`, [name]);

  return stage ? <Welcome url={url} name={name} email={email}/> : <Create onSubmit={handleSubmit}/>;
};

export default CreatePage;