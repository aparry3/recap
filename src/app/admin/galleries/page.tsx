'use client';
import React, { useEffect, useState } from 'react';
import { Container, Row, Column, Text } from 'react-web-layout-components';
import styles from './page.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEllipsisV, faPlus } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useRouter } from 'next/navigation';
import { fetchAdminGalleries } from '@/helpers/api/adminClient';
import Loading from '@/components/Loading';
import { Gallery } from '@/lib/types/Gallery';

interface GalleryWithStats extends Gallery {
  contributorsCount: number;
  photosCount: number;
  weddingDate?: string;
}

export default function AdminGalleries() {
  const router = useRouter();
  const [galleries, setGalleries] = useState<GalleryWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadGalleries = async () => {
      try {
        setLoading(true);
        const data = await fetchAdminGalleries(page, search);
        setGalleries(data.galleries);
      } catch (error) {
        console.error('Failed to load galleries:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(loadGalleries, 300);
    return () => clearTimeout(debounceTimer);
  }, [page, search]);

  const handleSearch = (value?: string) => {
    setSearch(value || '');
    setPage(1);
  };

  const getStatus = (gallery: Gallery) => {
    const now = new Date();
    const created = new Date(gallery.created);
    const daysSinceCreation = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceCreation < 30 ? 'active' : 'inactive';
  };

  if (loading && galleries.length === 0) {
    return <Loading />;
  }

  return (
    <Column className={styles.galleriesPage}>
      <Container className={styles.header}>
        <Column>
          <Text size={2.5} weight={600}>Galleries</Text>
          <Text size={1.1} className={styles.subtitle}>
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
      </Container>

      <Container className={styles.searchContainer}>
        <Container className={styles.searchWrapper}>
          <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
          <Input
            className={styles.searchInput}
            placeholder="Search galleries..."
            value={search}
            onChange={handleSearch}
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
            {galleries.map((gallery) => {
              const status = getStatus(gallery);
              return (
                <tr key={gallery.id}>
                  <td>
                    <Text weight={500}>{gallery.name}</Text>
                  </td>
                  <td>
                    <Text>{gallery.weddingDate || new Date(gallery.created).toLocaleDateString()}</Text>
                  </td>
                  <td>
                    <Text>{gallery.contributorsCount || 0}</Text>
                  </td>
                  <td>
                    <Text>{gallery.photosCount || 0}</Text>
                  </td>
                  <td>
                    <span className={`${styles.status} ${styles[status]}`}>
                      {status}
                    </span>
                  </td>
                  <td>
                    <Container className={styles.actions}>
                      <button
                        className={styles.actionButton}
                        onClick={() => router.push(`/${gallery.path}?password=${gallery.password}`)}
                      >
                        <FontAwesomeIcon icon={faEllipsisV} />
                      </button>
                    </Container>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {galleries.length === 0 && (
          <Container className={styles.emptyState}>
            <Text>No galleries found</Text>
          </Container>
        )}
      </Container>

      {galleries.length > 0 && (
        <Row className={styles.pagination}>
          <Button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={styles.paginationButton}
          >
            Previous
          </Button>
          <Text>Page {page}</Text>
          <Button
            onClick={() => setPage(page + 1)}
            className={styles.paginationButton}
          >
            Next
          </Button>
        </Row>
      )}
    </Column>
  );
}