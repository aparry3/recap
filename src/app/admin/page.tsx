'use client';
import React, { useEffect, useState } from 'react';
import { Container, Row, Column, Text } from 'react-web-layout-components';
import styles from './page.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImages, faUsers, faCamera, faChartLine } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';
import { fetchAdminStats } from '@/helpers/api/adminClient';
import Loading from '@/components/Loading';

interface AdminStats {
  totalGalleries: number;
  totalUsers: number;
  totalPhotos: number;
  totalRevenue: number;
  recentActivity: Array<{
    id: string;
    action: string;
    targetType?: string;
    targetId?: string;
    created: string;
  }>;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchAdminStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return <Loading />;
  }

  const statCards = [
    {
      icon: faImages,
      label: 'Total Galleries',
      value: stats?.totalGalleries || 0,
      color: '#ec4899',
    },
    {
      icon: faUsers,
      label: 'Total Users',
      value: stats?.totalUsers || 0,
      color: '#3b82f6',
    },
    {
      icon: faCamera,
      label: 'Total Photos',
      value: stats?.totalPhotos || 0,
      color: '#10b981',
    },
    {
      icon: faChartLine,
      label: 'Total Revenue',
      value: `$${(stats?.totalRevenue || 0).toFixed(2)}`,
      color: '#f59e0b',
    },
  ];

  return (
    <Column className={styles.dashboard}>
      <Container className={styles.header}>
        <Text size={2.5} weight={600}>Admin Dashboard</Text>
        <Text size={1.1} className={styles.subtitle}>
          Manage galleries and administrators
        </Text>
      </Container>

      <Row className={styles.statsGrid}>
        {statCards.map((card, index) => (
          <Container key={index} className={styles.statCard}>
            <Container className={styles.iconContainer} style={{ backgroundColor: `${card.color}20` }}>
              <FontAwesomeIcon icon={card.icon} className={styles.statIcon} style={{ color: card.color }} />
            </Container>
            <Text size={2} weight={600} className={styles.statValue}>
              {card.value}
            </Text>
            <Text size={0.9} className={styles.statLabel}>
              {card.label}
            </Text>
          </Container>
        ))}
      </Row>

      <Container className={styles.section}>
        <Row className={styles.sectionHeader}>
          <Text size={1.5} weight={600}>Quick Actions</Text>
        </Row>
        <Row className={styles.quickActions}>
          <Button
            className={styles.actionButton}
            onClick={() => router.push('/admin/galleries/create')}
          >
            <Text>Create Gallery for User</Text>
          </Button>
          <Button
            className={styles.actionButton}
            onClick={() => router.push('/admin/users/invite')}
          >
            <Text>Bulk Invite Users</Text>
          </Button>
          <Button
            className={styles.actionButton}
            onClick={() => router.push('/admin/tools/export')}
          >
            <Text>Export Data</Text>
          </Button>
        </Row>
      </Container>

      <Container className={styles.section}>
        <Row className={styles.sectionHeader}>
          <Text size={1.5} weight={600}>Recent Activity</Text>
        </Row>
        <Column className={styles.activityList}>
          {stats?.recentActivity?.map((activity) => (
            <Container key={activity.id} className={styles.activityItem}>
              <Row>
                <Text size={0.95}>
                  {activity.action}
                  {activity.targetType && ` - ${activity.targetType}`}
                </Text>
                <Text size={0.85} className={styles.activityTime}>
                  {new Date(activity.created).toLocaleString()}
                </Text>
              </Row>
            </Container>
          ))}
          {(!stats?.recentActivity || stats.recentActivity.length === 0) && (
            <Text className={styles.noActivity}>No recent activity</Text>
          )}
        </Column>
      </Container>
    </Column>
  );
}