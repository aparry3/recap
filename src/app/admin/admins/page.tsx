'use client';
import React, { useEffect, useState } from 'react';
import { Container, Row, Column, Text } from 'react-web-layout-components';
import styles from './page.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';
import { fetchAdminList, removeAdminUser } from '@/helpers/api/adminClient';
import Loading from '@/components/Loading';
import { Person } from '@/lib/types/Person';

export default function AdminManagement() {
  const router = useRouter();
  const [admins, setAdmins] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminList();
      setAdmins(data);
    } catch (error) {
      console.error('Failed to load admins:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleRemoveAdmin = async (personId: string) => {
    if (window.confirm('Are you sure you want to remove admin access for this user?')) {
      try {
        await removeAdminUser(personId);
        await loadAdmins();
      } catch (error) {
        console.error('Failed to remove admin:', error);
        alert('Failed to remove admin access');
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Column className={styles.adminManagementPage}>
      <Container className={styles.header}>
        <Column>
          <Text size={2.5} weight={600}>Admin Management</Text>
          <Text size={1.1} className={styles.subtitle}>
            Manage administrative users
          </Text>
        </Column>
        <Button
          className={styles.createButton}
          onClick={() => router.push('/admin/admins/create')}
        >
          <FontAwesomeIcon icon={faUserPlus} className={styles.buttonIcon} />
          <Text>Create Admin</Text>
        </Button>
      </Container>

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
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td>
                  <Text weight={500}>{admin.name}</Text>
                </td>
                <td>
                  <Text>{admin.email || 'No email'}</Text>
                </td>
                <td>
                  <span className={styles.role}>Admin</span>
                </td>
                <td>
                  <Text>{new Date(admin.created).toLocaleDateString()}</Text>
                </td>
                <td>
                  <Container className={styles.actions}>
                    <button
                      className={styles.actionButton}
                      onClick={() => handleRemoveAdmin(admin.id)}
                      title="Remove admin access"
                    >
                      <FontAwesomeIcon icon={faEllipsisV} />
                    </button>
                  </Container>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {admins.length === 0 && (
          <Container className={styles.emptyState}>
            <Text>No admin users found</Text>
          </Container>
        )}
      </Container>
    </Column>
  );
}