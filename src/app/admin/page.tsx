'use client';
import React, { useEffect, useState } from 'react';
import { Container, Row, Column, Text } from 'react-web-layout-components';
import styles from './page.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEllipsisV, faPlus, faUserPlus, faEye, faLink, faCheck } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';
import { fetchAdminGalleries, fetchAdminUsers } from '@/helpers/api/adminClient';
import Loading from '@/components/Loading';
import Link from 'next/link';
import Image from 'next/image';
import CreateGalleryModal from './CreateGalleryModal';
import CreateAdminModal from './CreateAdminModal';
import Toast from './Toast';

interface GalleryWithStats {
  id: string;
  name: string;
  path: string;
  password: string;
  created: string;
  weddingDate?: string;
  contributorsCount: number;
  photosCount: number;
}

interface UserWithAccess {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  created: string;
  galleriesCount: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [galleries, setGalleries] = useState<GalleryWithStats[]>([]);
  const [adminUsers, setAdminUsers] = useState<UserWithAccess[]>([]);
  const [loading, setLoading] = useState(true);
  const [gallerySearch, setGallerySearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);
  const [copiedGalleryId, setCopiedGalleryId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; visible: boolean }>({
    message: '',
    type: 'success',
    visible: false
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [galleriesData, usersData] = await Promise.all([
          fetchAdminGalleries(1, gallerySearch),
          fetchAdminUsers(1)
        ]);
        console.log('Galleries data:', galleriesData);
        console.log('Admin users data:', usersData);
        setGalleries(galleriesData.galleries);
        setAdminUsers(usersData.users);
      } catch (error) {
        console.error('Failed to load admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [gallerySearch]);

  const handleGalleryCreated = () => {
    // Reload galleries after creating a new one
    const loadData = async () => {
      try {
        const galleriesData = await fetchAdminGalleries(1, gallerySearch);
        setGalleries(galleriesData.galleries);
        showToast('Gallery created successfully!', 'success');
      } catch (error) {
        console.error('Failed to reload galleries:', error);
        showToast('Failed to reload galleries', 'error');
      }
    };
    loadData();
  };

  const handleAdminCreated = () => {
    // Reload admin users after creating a new one
    const loadData = async () => {
      try {
        const usersData = await fetchAdminUsers(1);
        setAdminUsers(usersData.users);
        showToast('Admin user created successfully!', 'success');
      } catch (error) {
        console.error('Failed to reload admin users:', error);
        showToast('Failed to reload admin users', 'error');
      }
    };
    loadData();
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type, visible: true });
    // Hide toast after 3 seconds
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  const getStatus = (created: string) => {
    const now = new Date();
    const createdDate = new Date(created);
    const daysSinceCreation = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceCreation < 30 ? 'active' : 'inactive';
  };

  const handleCopyLink = async (gallery: GalleryWithStats) => {
    const url = `${window.location.origin}/${gallery.path}?password=${gallery.password}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedGalleryId(gallery.id);
      showToast('Gallery link copied to clipboard!', 'success');
      // Clear the copied state after 2 seconds
      setTimeout(() => setCopiedGalleryId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      showToast('Failed to copy link', 'error');
    }
  };

  const handleViewGallery = (gallery: GalleryWithStats) => {
    window.open(`/${gallery.path}?password=${gallery.password}`, '_blank');
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Column className={styles.adminPage}>
      <Container className={styles.header}>
        <Row className={styles.titleRow}>
          <Column className={styles.title}>
            <Text size={2.5} weight={600}>Admin Dashboard</Text>
            <Text size={1.1} className={styles.subtitle}>
              Manage galleries and administrators
            </Text>
          </Column>
        </Row>
      </Container>

      <Column className={styles.content}>
        {/* Galleries Section */}
        <Column className={styles.section}>
          <Row className={styles.sectionHeader}>
            <Column>
              <Text size={1.8} weight={600}>Galleries</Text>
              <Text size={1} className={styles.sectionSubtitle}>
                Manage wedding galleries and their settings
              </Text>
            </Column>
          </Row>

          <Container className={styles.searchContainer}>
            <Container className={styles.searchWrapper}>
              <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
              <input
                className={styles.searchInput}
                placeholder="Search galleries..."
                value={gallerySearch}
                onChange={(e) => setGallerySearch(e.target.value)}
                type="search"
              />
            </Container>
            <Container padding={1} justify='space-between'>
              <Button
                className={styles.createButton}
                onClick={() => setShowCreateModal(true)}
              >
                  <FontAwesomeIcon icon={faPlus} className={styles.buttonIcon} />
                <Text>Create New Gallery</Text>
              </Button>

            </Container>
          </Container>

          <Container className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Gallery</th>
                  <th>Wedding Date</th>
                  <th>Contributors</th>
                  <th>Photos</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {galleries.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                      No galleries found
                    </td>
                  </tr>
                ) : (
                  galleries.map((gallery) => {
                    const status = getStatus(gallery.created);
                    return (
                      <tr key={gallery.id}>
                        <td>{gallery.name}</td>
                        <td>{gallery.weddingDate || new Date(gallery.created).toLocaleDateString()}</td>
                        <td>{gallery.contributorsCount}</td>
                        <td>{gallery.photosCount}</td>
                        <td>
                          <span className={`${styles.status} ${styles[status]}`}>
                            {status}
                          </span>
                        </td>
                        <td>
                          <Row className={styles.actionButtons}>
                            <button
                              className={styles.actionButton}
                              onClick={() => handleViewGallery(gallery)}
                              title="View gallery"
                            >
                              <FontAwesomeIcon icon={faEye} />
                            </button>
                            <button
                              className={styles.actionButton}
                              onClick={() => handleCopyLink(gallery)}
                              title="Copy gallery link"
                            >
                              <FontAwesomeIcon icon={copiedGalleryId === gallery.id ? faCheck : faLink} />
                            </button>
                          </Row>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </Container>
        </Column>

        {/* Admin Management Section */}
        <Column className={styles.section}>
          <Row className={styles.sectionHeader}>
            <Column>
              <Text size={1.8} weight={600}>Admin Management</Text>
              <Text size={1} className={styles.sectionSubtitle}>
                Manage administrative users
              </Text>
            </Column>
            <Button
              className={styles.createButton}
              onClick={() => setShowCreateAdminModal(true)}
            >
              <FontAwesomeIcon icon={faUserPlus} className={styles.buttonIcon} />
              <Text>Add Admin</Text>
            </Button>
          </Row>

          <Container className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Date Added</th>
                </tr>
              </thead>
              <tbody>
                {adminUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>
                      No admin users found
                    </td>
                  </tr>
                ) : (
                  adminUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email || 'No email'}</td>
                      <td>
                        {user.phone || <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>Not provided</span>}
                      </td>
                      <td>{new Date(user.created).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </Container>
          <Container padding={1}>
            <Text size={0.9} className={styles.totalCount}>
              Total admin users: {adminUsers.length}
            </Text>
          </Container>
        </Column>
      </Column>

      <CreateGalleryModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleGalleryCreated}
      />
      
      <CreateAdminModal
        isOpen={showCreateAdminModal}
        onClose={() => setShowCreateAdminModal(false)}
        onSuccess={handleAdminCreated}
      />
      
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
      />
    </Column>
  );
}