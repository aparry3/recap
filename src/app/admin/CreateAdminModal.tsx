'use client';
import React, { useState } from 'react';
import { Container, Row, Column, Text } from 'react-web-layout-components';
import styles from './CreateAdminModal.module.scss';
import Button from '@/components/Button';
import { createAdmin } from '@/helpers/api/adminClient';

interface CreateAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateAdminModal({ isOpen, onClose, onSuccess }: CreateAdminModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    
    // Validate email on submit
    if (!validateEmail(formData.email)) {
      setFieldErrors({ email: 'Please enter a valid email address' });
      return;
    }
    
    setLoading(true);

    try {
      const result = await createAdmin({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined
      });

      if (result) {
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: ''
        });
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      if (err.message?.includes('already exists')) {
        setFieldErrors({ email: 'A user with this email already exists' });
      } else {
        setError(err.message || 'Failed to create admin');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleEmailBlur = () => {
    if (formData.email && !validateEmail(formData.email)) {
      setFieldErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
    }
  };

  if (!isOpen) return null;

  return (
    <Container className={styles.modalOverlay} onClick={onClose}>
      <Container className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <Column className={styles.modalBody}>
          <Row justify="space-between" className={styles.modalHeader}>
            <Text size={1.8} weight={600}>Add New Admin</Text>
            <button className={styles.closeButton} onClick={onClose}>×</button>
          </Row>

          <form onSubmit={handleSubmit}>
            <Column className={styles.formColumn}>
              <Column className={styles.fieldColumn}>
                <Text size={0.9} weight={500}>Name *</Text>
                <input
                  type="text"
                  className={styles.input}
                  value={formData.name}
                  onChange={handleChange('name')}
                  placeholder="Jane Smith"
                  required
                  autoFocus
                />
              </Column>

              <Column className={styles.fieldColumn}>
                <Text size={0.9} weight={500}>Email *</Text>
                <input
                  type="email"
                  className={`${styles.input} ${fieldErrors.email ? styles.inputError : ''}`}
                  value={formData.email}
                  onChange={handleChange('email')}
                  onBlur={handleEmailBlur}
                  placeholder="jane@example.com"
                  required
                />
                {fieldErrors.email && (
                  <Text size={0.8} className={styles.fieldError}>{fieldErrors.email}</Text>
                )}
              </Column>

              <Column className={styles.fieldColumn}>
                <Text size={0.9} weight={500}>Phone</Text>
                <input
                  type="tel"
                  className={styles.input}
                  value={formData.phone}
                  onChange={handleChange('phone')}
                  placeholder="(555) 123-4567"
                />
                <Text size={0.8} className={styles.fieldHint}>Optional</Text>
              </Column>

              {error && (
                <Container className={styles.error}>
                  <Text size={0.9}>{error}</Text>
                </Container>
              )}

              <Row className={styles.modalFooter} justify="flex-end">
                <Button className={styles.cancelButton} onClick={onClose} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Add Admin'}
                </Button>
              </Row>
            </Column>
          </form>
        </Column>
      </Container>
    </Container>
  );
}