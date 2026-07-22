'use client';
import React, { FormEvent, useEffect, useState } from 'react';
import { Container, Row, Column, Text } from 'react-web-layout-components';
import styles from './page.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus, faUserPlus, faEye, faLink, faCheck } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/Button';
import {
  AdminSession,
  GalleryWithStats,
  fetchAdminGalleries,
  fetchAdminUsers,
  fetchAdminDeletedGalleries,
  fetchAdminSession,
  fetchAllAdminGalleries,
  requestAdminSignIn,
  deleteAdminGallery,
  restoreAdminGallery,
} from '@/helpers/api/adminClient';
import Loading from '@/components/Loading';
import CreateGalleryModal from './CreateGalleryModal';
import CreateAdminModal from './CreateAdminModal';
import { formatLocaleDateString } from '@/helpers/dates';
import Toast from './Toast';
import ConfirmDelete from '@/components/ConfirmDelete';
import { faTrash, faUndo } from '@fortawesome/free-solid-svg-icons';

interface UserWithAccess {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  created: string;
  galleriesCount: number;
}

export default function AdminDashboard() {
  const [session, setSession] = useState<AdminSession>();
  const [sessionResolved, setSessionResolved] = useState(false);
  const [galleries, setGalleries] = useState<GalleryWithStats[]>([]);
  const [allGalleries, setAllGalleries] = useState<GalleryWithStats[]>([]);
  const [allGalleriesTotal, setAllGalleriesTotal] = useState(0);
  const [allGalleriesPage, setAllGalleriesPage] = useState(1);
  const [allGallerySearch, setAllGallerySearch] = useState('');
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
  const [deletedGalleries, setDeletedGalleries] = useState<GalleryWithStats[]>([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [galleryToDelete, setGalleryToDelete] = useState<GalleryWithStats | null>(null);
  const [signInEmail, setSignInEmail] = useState('');
  const [signInMessage, setSignInMessage] = useState('');
  const [signInError, setSignInError] = useState('');
  const [signInLoading, setSignInLoading] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      try {
        setSession(await fetchAdminSession());
      } catch (error) {
        console.error('Failed to check admin session:', error);
      } finally {
        setSessionResolved(true);
      }
    };
    loadSession();
  }, []);

  useEffect(() => {
    if (!session) return;
    const loadData = async () => {
      try {
        setLoading(true);
        const [galleriesData, usersData, deletedData] = await Promise.all([
          fetchAdminGalleries(1, gallerySearch),
          fetchAdminUsers(1),
          fetchAdminDeletedGalleries(1, gallerySearch)
        ]);
        setGalleries(galleriesData.galleries);
        setAdminUsers(usersData.users);
        setDeletedGalleries(deletedData.galleries);
      } catch (error) {
        console.error('Failed to load admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [gallerySearch, session]);

  useEffect(() => {
    if (!session?.isSuperAdmin) return;
    const loadAllGalleries = async () => {
      try {
        const data = await fetchAllAdminGalleries(allGalleriesPage, allGallerySearch);
        setAllGalleries(data.galleries);
        setAllGalleriesTotal(data.total);
      } catch (error) {
        console.error('Failed to load the super-admin gallery overview:', error);
        showToast('Failed to load all galleries', 'error');
      }
    };
    loadAllGalleries();
    // showToast is stable for the lifetime of this client page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allGalleriesPage, allGallerySearch, session]);

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
        showToast('Admin created successfully! An invitation email has been sent.', 'success');
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
    if (!gallery.password) return;
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
    if (!gallery.password) return;
    window.open(`/${gallery.path}?password=${gallery.password}`, '_blank');
  };

  const handleDeleteGallery = (gallery: GalleryWithStats) => {
    setGalleryToDelete(gallery);
    setShowConfirmDelete(true);
  };

  const confirmDeleteGallery = async () => {
    if (!galleryToDelete) return;
    try {
      setShowConfirmDelete(false);
      await deleteAdminGallery(galleryToDelete.id);
      setGalleries(prev => prev.filter(g => g.id !== galleryToDelete.id));
      setDeletedGalleries(prev => [{...galleryToDelete}, ...prev]);
      showToast('Gallery moved to Deleted', 'success');
    } catch (error) {
      console.error('Failed to delete gallery:', error);
      showToast('Failed to delete gallery', 'error');
    } finally {
      setGalleryToDelete(null);
    }
  };

  const handleRestoreGallery = async (gallery: GalleryWithStats) => {
    try {
      await restoreAdminGallery(gallery.id);
      setDeletedGalleries(prev => prev.filter(g => g.id !== gallery.id));
      setGalleries(prev => [gallery, ...prev]);
      showToast('Gallery restored', 'success');
    } catch (error) {
      console.error('Failed to restore gallery:', error);
      showToast('Failed to restore gallery', 'error');
    }
  };

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSignInLoading(true);
    setSignInError('');
    setSignInMessage('');
    try {
      const result = await requestAdminSignIn(signInEmail);
      setSignInMessage(result.message);
    } catch (error) {
      setSignInError(error instanceof Error ? error.message : 'Failed to send a sign-in link');
    } finally {
      setSignInLoading(false);
    }
  };

  if (!sessionResolved || (session && loading)) {
    return <Loading />;
  }

  if (!session) {
    return (
      <Column as="main" className={styles.signInPage}>
        <Column className={styles.signInCard}>
          <Text size={1} className={styles.eyebrow}>Our Wedding Recap</Text>
          <Text size={2.3} weight={600}>Admin sign in</Text>
          <Text size={1.05} className={styles.subtitle}>
            Enter your admin email and we’ll send you a secure sign-in link.
          </Text>
          <form className={styles.signInForm} onSubmit={handleSignIn}>
            <label htmlFor="admin-email">Email address</label>
            <input
              id="admin-email"
              className={styles.searchInput}
              type="email"
              autoComplete="email"
              value={signInEmail}
              onChange={(event) => setSignInEmail(event.target.value)}
              required
            />
            <Button type="submit" disabled={signInLoading}>
              <Text>{signInLoading ? 'Sending…' : 'Email me a sign-in link'}</Text>
            </Button>
          </form>
          {signInMessage && <Text className={styles.signInSuccess}>{signInMessage}</Text>}
          {signInError && <Text className={styles.signInError}>{signInError}</Text>}
        </Column>
      </Column>
    );
  }

  return (
    <Column className={styles.adminPage}>
      <Container className={styles.header}>
        <Row className={styles.titleRow}>
          <Column className={styles.title}>
            <Row className={styles.headingWithBadge}>
              <Text size={2.5} weight={600}>Admin Dashboard</Text>
              {session.isSuperAdmin && <span className={styles.superAdminBadge}>Super Admin</span>}
            </Row>
            <Text size={1.1} className={styles.subtitle}>
              {session.isSuperAdmin
                ? 'Platform overview and gallery administration'
                : 'Manage galleries and administrators'}
            </Text>
          </Column>
        </Row>
      </Container>

      <Column className={styles.content}>
        {session.isSuperAdmin && (
          <Column className={styles.section}>
            <Row className={styles.sectionHeader}>
              <Column>
                <Text size={1.8} weight={600}>All Galleries</Text>
                <Text size={1} className={styles.sectionSubtitle}>
                  Read-only platform overview. Gallery passwords and access actions are not exposed here.
                </Text>
              </Column>
            </Row>

            <Container className={styles.searchContainer}>
              <Container className={styles.searchWrapper}>
                <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
                <input
                  className={styles.searchInput}
                  placeholder="Search all galleries..."
                  value={allGallerySearch}
                  onChange={(event) => {
                    setAllGallerySearch(event.target.value);
                    setAllGalleriesPage(1);
                  }}
                  type="search"
                />
              </Container>
            </Container>

            <Container className={styles.tableContainer}>
              <table className={`${styles.table} ${styles.overviewTable}`}>
                <thead>
                  <tr>
                    <th>Gallery</th>
                    <th>Owner</th>
                    <th>Wedding Date</th>
                    <th>Albums</th>
                    <th>Images</th>
                    <th>Users</th>
                  </tr>
                </thead>
                <tbody>
                  {allGalleries.length === 0 ? (
                    <tr>
                      <td colSpan={6} className={styles.emptyCell}>No galleries found</td>
                    </tr>
                  ) : allGalleries.map((gallery) => (
                    <tr key={gallery.id}>
                      <td data-label="Gallery">
                        <div>{gallery.name}</div>
                        <div className={styles.galleryPath}>/{gallery.path}</div>
                      </td>
                      <td data-label="Owner">
                        <div>{gallery.ownerName || 'Unknown owner'}</div>
                        {gallery.ownerEmail && <div className={styles.galleryPath}>{gallery.ownerEmail}</div>}
                      </td>
                      <td data-label="Wedding Date">
                        {gallery.weddingDate ? formatLocaleDateString(gallery.weddingDate) : 'Not set'}
                      </td>
                      <td data-label="Albums">{gallery.albumsCount}</td>
                      <td data-label="Images">{gallery.photosCount}</td>
                      <td data-label="Users">{gallery.contributorsCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Container>

            <Row className={styles.pagination}>
              <Text size={0.9} className={styles.totalCount}>
                {allGalleriesTotal} {allGalleriesTotal === 1 ? 'gallery' : 'galleries'}
              </Text>
              <Row className={styles.paginationButtons}>
                <button
                  className={styles.pageButton}
                  disabled={allGalleriesPage === 1}
                  onClick={() => setAllGalleriesPage((page) => Math.max(1, page - 1))}
                >
                  Previous
                </button>
                <Text size={0.9}>Page {allGalleriesPage} of {Math.max(1, Math.ceil(allGalleriesTotal / 20))}</Text>
                <button
                  className={styles.pageButton}
                  disabled={allGalleriesPage >= Math.ceil(allGalleriesTotal / 20)}
                  onClick={() => setAllGalleriesPage((page) => page + 1)}
                >
                  Next
                </button>
              </Row>
            </Row>
          </Column>
        )}

        {/* Galleries Section */}
        <Column className={styles.section}>
          <Row className={styles.sectionHeader}>
            <Column>
              <Text size={1.8} weight={600}>Your Galleries</Text>
              <Text size={1} className={styles.sectionSubtitle}>
                Manage galleries created through your admin account
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
            <Button
              className={styles.createButton}
              onClick={() => setShowCreateModal(true)}
            >
              <FontAwesomeIcon icon={faPlus} className={styles.buttonIcon} />
              <Text>Create New Gallery</Text>
            </Button>
          </Container>

          <Container className={styles.tableContainer}>
            <table className={`${styles.table} ${styles.ownedGalleryTable}`}>
              <thead>
                <tr>
                  <th>Gallery</th>
                  <th>Wedding Date</th>
                  <th>Contributors</th>
                  <th>Albums</th>
                  <th>Photos</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {galleries.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                      No galleries found
                    </td>
                  </tr>
                ) : (
                  galleries.map((gallery) => {
                    const status = getStatus(gallery.created);
                    return (
                      <tr key={gallery.id}>
                        <td data-label="Gallery">
                          <div>{gallery.name}</div>
                          <div className={styles.mobileOnly} style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            {gallery.weddingDate ? formatLocaleDateString(gallery.weddingDate) : new Date(gallery.created).toLocaleDateString()}
                          </div>
                        </td>
                        <td data-label="Wedding Date">{gallery.weddingDate ? formatLocaleDateString(gallery.weddingDate) : new Date(gallery.created).toLocaleDateString()}</td>
                        <td data-label="Contributors">{gallery.contributorsCount}</td>
                        <td data-label="Albums">{gallery.albumsCount}</td>
                        <td data-label="Photos">{gallery.photosCount}</td>
                        <td data-label="Status">
                          <span className={`${styles.status} ${styles[status]}`}>
                            {status}
                          </span>
                        </td>
                        <td data-label="Actions">
                          <Row className={styles.actionButtons}>
                            <button
                              className={styles.actionButton}
                              onClick={() => handleViewGallery(gallery)}
                              title="View gallery"
                            >
                              <FontAwesomeIcon icon={faEye} />
                              <span className={styles.mobileOnly}> View</span>
                            </button>
                            <button
                              className={styles.actionButton}
                              onClick={() => handleCopyLink(gallery)}
                              title="Copy gallery link"
                            >
                              <FontAwesomeIcon icon={copiedGalleryId === gallery.id ? faCheck : faLink} />
                              <span className={styles.mobileOnly}> {copiedGalleryId === gallery.id ? 'Copied!' : 'Copy Link'}</span>
                            </button>
                            <button
                              className={styles.actionButton}
                              onClick={() => handleDeleteGallery(gallery)}
                              title="Delete gallery"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                              <span className={styles.mobileOnly}> Delete</span>
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
            <table className={`${styles.table} ${styles.adminTable}`}>
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
                      <td data-label="Name">
                        <div>{user.name}</div>
                        <div className={styles.mobileOnly} style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {new Date(user.created).toLocaleDateString()}
                        </div>
                      </td>
                      <td data-label="Email">{user.email || 'No email'}</td>
                      <td data-label="Phone">
                        {user.phone || <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>Not provided</span>}
                      </td>
                      <td data-label="Date Added">{new Date(user.created).toLocaleDateString()}</td>
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

        {/* Deleted Galleries Section */}
        <Column className={styles.section}>
          <Row className={styles.sectionHeader}>
            <Column>
              <Text size={1.8} weight={600}>Deleted Galleries</Text>
              <Text size={1} className={styles.sectionSubtitle}>
                Recently deleted galleries (soft-deleted)
              </Text>
            </Column>
          </Row>

          <Container className={styles.tableContainer}>
            <table className={`${styles.table} ${styles.galleryTable}`}>
              <thead>
                <tr>
                  <th>Gallery</th>
                  <th>Wedding Date</th>
                  <th>Contributors</th>
                  <th>Photos</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {deletedGalleries.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                      No deleted galleries
                    </td>
                  </tr>
                ) : (
                  deletedGalleries.map((gallery) => (
                    <tr key={gallery.id}>
                      <td data-label="Gallery">
                        <div>{gallery.name}</div>
                        <div className={styles.mobileOnly} style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {gallery.weddingDate ? formatLocaleDateString(gallery.weddingDate) : new Date(gallery.created).toLocaleDateString()}
                        </div>
                      </td>
                      <td data-label="Wedding Date">{gallery.weddingDate ? formatLocaleDateString(gallery.weddingDate) : new Date(gallery.created).toLocaleDateString()}</td>
                      <td data-label="Contributors">{gallery.contributorsCount}</td>
                      <td data-label="Photos">{gallery.photosCount}</td>
                      <td data-label="Actions">
                        <Row className={styles.actionButtons}>
                          <button
                            className={styles.actionButton}
                            onClick={() => handleRestoreGallery(gallery)}
                            title="Restore gallery"
                          >
                            <FontAwesomeIcon icon={faUndo} />
                            <span className={styles.mobileOnly}> Restore</span>
                          </button>
                        </Row>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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

      {showConfirmDelete && (
        <ConfirmDelete 
          onCancel={() => { setShowConfirmDelete(false); setGalleryToDelete(null); }}
          onConfirm={confirmDeleteGallery}
        />
      )}
    </Column>
  );
}
