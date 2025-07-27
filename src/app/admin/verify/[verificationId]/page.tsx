"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import AdminVerification from '@/components/AdminVerification';
import useLocalStorage, { setCookie } from '@/helpers/hooks/localStorage';

const AdminVerificationPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const verificationId = params.verificationId as string;
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [personName, setPersonName] = useState('');
  const [_, setPersonId] = useLocalStorage<string>('personId', '');

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const response = await fetch(`/api/admin/verify/${verificationId}`);
        const data = await response.json();

        if (!response.ok) {
          setStatus('error');
          setErrorMessage(data.error || 'Verification failed');
          return;
        }

        // Set the personId cookie and localStorage
        setPersonId(data.personId);
        setCookie('personId', data.personId);
        setPersonName(data.name);
        setStatus('success');

        // Redirect to admin page after 2 seconds
        setTimeout(() => {
          router.push('/admin');
        }, 2000);
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setErrorMessage('An error occurred during verification');
      }
    };

    verifyAdmin();
  }, [verificationId, router, setPersonId]);

  return (
    <AdminVerification 
      status={status} 
      errorMessage={errorMessage}
      personName={personName}
    />
  );
};

export default AdminVerificationPage;