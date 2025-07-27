'use client';
import React, { useState } from 'react';
import { Container, Row, Column, Text } from 'react-web-layout-components';
import styles from './CreateGalleryModal.module.scss';
import Button from '@/components/Button';
import { createAdminGallery } from '@/helpers/api/adminClient';

interface CreateGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateGalleryModal({ isOpen, onClose, onSuccess }: CreateGalleryModalProps) {
  const [formData, setFormData] = useState({
    ownerName: '',
    ownerEmail: '',
    galleryName: '',
    weddingDate: '',
    theKnot: '',
    zola: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await createAdminGallery({
        ...formData,
        weddingDate: formData.weddingDate || undefined,
        theKnot: formData.theKnot || undefined,
        zola: formData.zola || undefined
      });

      if (result.gallery) {
        // Reset form
        setFormData({
          ownerName: '',
          ownerEmail: '',
          galleryName: '',
          weddingDate: '',
          theKnot: '',
          zola: ''
        });
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create gallery');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  if (!isOpen) return null;

  return (
    <Container className={styles.modalOverlay} onClick={onClose}>
      <Container className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <Column className={styles.modalBody}>
          <Row justify="space-between" className={styles.modalHeader}>
            <Text size={1.8} weight={600}>Create New Gallery</Text>
            <button className={styles.closeButton} onClick={onClose}>×</button>
          </Row>

          <form onSubmit={handleSubmit}>
            <Column className={styles.formColumn}>
              <Column className={styles.fieldColumn}>
                <Text size={0.9} weight={500}>Owner Name *</Text>
                <input
                  type="text"
                  className={styles.input}
                  value={formData.ownerName}
                  onChange={handleChange('ownerName')}
                  placeholder="John Doe"
                  required
                />
              </Column>

              <Column className={styles.fieldColumn}>
                <Text size={0.9} weight={500}>Owner Email *</Text>
                <input
                  type="email"
                  className={styles.input}
                  value={formData.ownerEmail}
                  onChange={handleChange('ownerEmail')}
                  placeholder="john@example.com"
                  required
                />
              </Column>

              <Column className={styles.fieldColumn}>
                <Text size={0.9} weight={500}>Gallery Name *</Text>
                <input
                  type="text"
                  className={styles.input}
                  value={formData.galleryName}
                  onChange={handleChange('galleryName')}
                  placeholder="John & Jane's Wedding"
                  required
                />
              </Column>

              <Column className={styles.fieldColumn}>
                <Text size={0.9} weight={500}>Wedding Date</Text>
                <input
                  type="date"
                  className={styles.input}
                  value={formData.weddingDate}
                  onChange={handleChange('weddingDate')}
                />
              </Column>

              <Column className={styles.fieldColumn}>
                <Text size={0.9} weight={500}>TheKnot URL</Text>
                <input
                  type="url"
                  className={styles.input}
                  value={formData.theKnot}
                  onChange={handleChange('theKnot')}
                  placeholder="https://www.theknot.com/..."
                />
              </Column>

              <Column className={styles.fieldColumn}>
                <Text size={0.9} weight={500}>Zola URL</Text>
                <input
                  type="url"
                  className={styles.input}
                  value={formData.zola}
                  onChange={handleChange('zola')}
                  placeholder="https://www.zola.com/..."
                />
              </Column>

              {error && (
                <Container className={styles.error}>
                  <Text size={0.9} color="error">{error}</Text>
                </Container>
              )}

              <Row className={styles.modalFooter} justify="flex-end">
                <Button className={styles.cancelButton} onClick={onClose} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Gallery'}
                </Button>
              </Row>
            </Column>
          </form>
        </Column>
      </Container>
    </Container>
  );
}