'use client';
import React, { useEffect, useState } from 'react';
import { Container, Row, Column, Text } from 'react-web-layout-components';
import styles from './page.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEllipsisV, faPlus, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';
import { fetchAdminGalleries, fetchAdminUsers } from '@/helpers/api/adminClient';
import Loading from '@/components/Loading';
import Link from 'next/link';
import Image from 'next/image';

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
  created: string;
  galleriesCount: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [galleries, setGalleries] = useState<GalleryWithStats[]>([]);
  const [users, setUsers] = useState<UserWithAccess[]>([]);
  const [loading, setLoading] = useState(true);
  const [gallerySearch, setGallerySearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [galleriesData, usersData] = await Promise.all([
          fetchAdminGalleries(1, gallerySearch),
          fetchAdminUsers(1, userSearch)
        ]);
        console.log('Galleries data:', galleriesData);
        console.log('Users data:', usersData);
        setGalleries(galleriesData.galleries);
        setUsers(usersData.users);
      } catch (error) {
        console.error('Failed to load admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [gallerySearch, userSearch]);

  const getStatus = (created: string) => {
    const now = new Date();
    const createdDate = new Date(created);
    const daysSinceCreation = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceCreation < 30 ? 'active' : 'inactive';
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Column className={styles.adminPage}>
      <Container className={styles.header}>
        <Row className={styles.titleRow}>
          <Link href="/">
            <Image src='/branding/wordmark.png' alt='Recap' width={60} height={60} />
          </Link>
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
            <Button
              className={styles.createButton}
              onClick={() => router.push('/create')}
            >
              <FontAwesomeIcon icon={faPlus} className={styles.buttonIcon} />
              <Text>Create New Gallery</Text>
            </Button>
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
                          <button
                            className={styles.actionButton}
                            onClick={() => router.push(`/${gallery.path}?password=${gallery.password}`)}
                          >
                            <FontAwesomeIcon icon={faEllipsisV} />
                          </button>
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
              onClick={() => router.push('/admin/create-admin')}
            >
              <FontAwesomeIcon icon={faUserPlus} className={styles.buttonIcon} />
              <Text>Create Admin</Text>
            </Button>
          </Row>

          <Container className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Date Added</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email || 'No email'}</td>
                    <td>
                      <span className={styles.role}>Admin</span>
                    </td>
                    <td>{new Date(user.created).toLocaleDateString()}</td>
                    <td>
                      <button className={styles.actionButton}>
                        <FontAwesomeIcon icon={faEllipsisV} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Container>
        </Column>
      </Column>
    </Column>
  );
}