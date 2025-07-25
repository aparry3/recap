import React from 'react';
import { Container, Row, Column, Text } from 'react-web-layout-components';
import Link from 'next/link';
import styles from './layout.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faImages, faUsers, faTools, faHistory, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { href: '/admin', icon: faHome, label: 'Dashboard' },
    { href: '/admin/galleries', icon: faImages, label: 'Galleries' },
    { href: '/admin/users', icon: faUsers, label: 'Users' },
    { href: '/admin/admins', icon: faUsers, label: 'Admin Management' },
    { href: '/admin/tools', icon: faTools, label: 'Tools' },
    { href: '/admin/logs', icon: faHistory, label: 'Activity Logs' },
  ];

  return (
    <Container className={styles.adminLayout}>
      <Column className={styles.sidebar}>
        <Container className={styles.sidebarHeader}>
          <Image src='/branding/wordmark.png' alt='Recap Admin' width={80} height={80} />
          <Text size={1.2} weight={600}>Admin Panel</Text>
        </Container>
        
        <Column className={styles.navItems}>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={styles.navLink}>
              <Row className={styles.navItem}>
                <FontAwesomeIcon icon={item.icon} className={styles.navIcon} />
                <Text className={styles.navLabel}>{item.label}</Text>
              </Row>
            </Link>
          ))}
        </Column>
        
        <Container className={styles.sidebarFooter}>
          <Link href="/" className={styles.navLink}>
            <Row className={styles.navItem}>
              <FontAwesomeIcon icon={faSignOutAlt} className={styles.navIcon} />
              <Text className={styles.navLabel}>Exit Admin</Text>
            </Row>
          </Link>
        </Container>
      </Column>
      
      <Container className={styles.mainContent}>
        {children}
      </Container>
    </Container>
  );
}