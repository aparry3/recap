# Admin Page Implementation RFC (Simplified)

## Overview

This RFC outlines a simplified implementation plan for enhancing the admin page functionality in the Recap application. The focus is on fixing the UI layout and adding core admin gallery management features without complex audit logging.

## Implementation Phases

### Phase 1: Fix Admin Page UI Layout

The first phase focuses on fixing the current admin page to properly display data and match the future design mockup.

#### 1.1 Create Admin API Client

First, we need to create the admin API client that the page expects:

**File**: `/src/helpers/api/adminClient.ts`

```typescript
import { Gallery } from "@/lib/types/Gallery";
import { Person } from "@/lib/types/Person";

export interface GalleryWithStats {
  id: string;
  name: string;
  path: string;
  password: string;
  created: string;
  weddingDate?: string;
  contributorsCount: number;
  photosCount: number;
}

export interface UserWithAccess {
  id: string;
  name: string;
  email?: string;
  created: string;
  galleriesCount: number;
}

export const fetchAdminGalleries = async (
  page: number = 1,
  search?: string
): Promise<{ galleries: GalleryWithStats[] }> => {
  const params = new URLSearchParams({
    page: page.toString(),
    ...(search && { search })
  });
  
  const response = await fetch(`/api/admin/galleries?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch galleries');
  }
  return response.json();
};

export const fetchAdminUsers = async (
  page: number = 1,
  search?: string
): Promise<{ users: UserWithAccess[] }> => {
  const response = await fetch('/api/admin/admins');
  if (!response.ok) {
    throw new Error('Failed to fetch admin users');
  }
  
  const admins = await response.json();
  // Transform to include galleriesCount
  const users = admins.map((admin: Person) => ({
    ...admin,
    galleriesCount: 0 // This would be populated from a real query
  }));
  
  return { users };
};
```

#### 1.2 Fix Admin Page Component

**File**: `/src/app/admin/page.tsx`

```tsx
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
                {galleries.map((gallery) => {
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
                })}
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
```

### Phase 2: Simple Database Schema Update

Add a field to track who created each gallery (whether admin or regular user).

#### 2.1 Create Migration

**File**: `/migrations/20250127000000_add_gallery_creator.ts`

```typescript
import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Add createdBy to gallery table to track who created it
  await db.schema
    .alterTable('gallery')
    .addColumn('created_by', 'varchar', (col) => 
      col.references('person.id').onDelete('set null')
    )
    .execute();

  // Add index for faster queries
  await db.schema
    .createIndex('gallery_created_by_idx')
    .on('gallery')
    .column('created_by')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex('gallery_created_by_idx').execute();
  await db.schema
    .alterTable('gallery')
    .dropColumn('created_by')
    .execute();
}
```

#### 2.2 Update Gallery Type

**File**: `/src/lib/types/Gallery.ts`

Add to GalleryTable interface:

```typescript
export interface GalleryTable {
    id: string
    name: string
    path: string
    date?: Date
    personId: string
    created: Date
    password: string
    zola?: string
    theknot?: string
    createdBy?: string  // Add this line - tracks who created the gallery
}
```

### Phase 3: Update Gallery Creation to Track Creator

#### 3.1 Update Gallery Service

**File**: `/src/lib/db/galleryService.ts`

Update the insertGallery function to accept createdBy:

```typescript
export const insertGallery = async (newGalleryData: NewGalleryData): Promise<Gallery> => {
    const newGallery = {
        ...newGalleryData, 
        id: uuidv4(),
        createdBy: newGalleryData.createdBy // Include creator if provided
    } as NewGallery

    const gallery = await db.insertInto('gallery').values(newGallery).returningAll().executeTakeFirstOrThrow();
    return gallery;
}
```

#### 3.2 Update Gallery API to Include Creator

**File**: `/src/app/api/galleries/route.ts`

Update the POST handler to include the creator:

```typescript
export const POST = async (req: Request) => {
    const newGallery: NewGalleryData = await req.json()
    if (!newGallery.personId) {
        return NextResponse.json({error: 'No personId provided'}, {status: 400})
    }
    
    // Add the creator (same as person for regular users, admin for admin-created)
    newGallery.createdBy = newGallery.createdBy || newGallery.personId;
    
    const person = await selectPerson(newGallery.personId)
    // ... rest of the existing code
}
```

### Phase 4: Create Admin Gallery Management Endpoints

#### 4.1 Enhanced Admin Galleries Endpoint

**File**: `/src/app/api/admin/galleries/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin/middleware';
import { db } from '@/lib/db';
import { insertGallery } from '@/lib/db/galleryService';
import { insertGalleryPerson, selectPersonByEmail, insertPerson } from '@/lib/db/personService';
import { sendGridClient } from '@/lib/email';
import { NewGalleryData } from '@/lib/types/Gallery';
import { generateRandomString } from '@/lib/utils';
import { handleWeddingWebsites } from '@/lib/web';
import { v4 as uuidv4 } from 'uuid';

// GET - Fetch galleries with stats
export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';
    const limit = 20;
    const offset = (page - 1) * limit;

    let query = db
      .selectFrom('gallery')
      .leftJoin('galleryPerson', 'gallery.id', 'galleryPerson.galleryId')
      .leftJoin('galleryMedia', 'gallery.id', 'galleryMedia.galleryId')
      .select([
        'gallery.id',
        'gallery.name',
        'gallery.path',
        'gallery.password',
        'gallery.created',
        'gallery.date as weddingDate',
        db.fn.count('galleryPerson.personId').distinct().as('contributorsCount'),
        db.fn.count('galleryMedia.mediaId').distinct().as('photosCount'),
      ])
      .groupBy(['gallery.id']);

    if (search) {
      query = query.where('gallery.name', 'ilike', `%${search}%`);
    }

    const galleries = await query
      .orderBy('gallery.created', 'desc')
      .limit(limit)
      .offset(offset)
      .execute();

    return NextResponse.json({
      galleries: galleries.map(g => ({
        ...g,
        contributorsCount: Number(g.contributorsCount) || 0,
        photosCount: Number(g.photosCount) || 0,
      })),
      page,
      limit,
    });
  } catch (error) {
    console.error('Admin galleries error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch galleries' },
      { status: 500 }
    );
  }
}

// POST - Create gallery as admin for someone else
export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin();
    const data = await request.json();

    const {
      ownerName,
      ownerEmail,
      galleryName,
      weddingDate,
      theKnot,
      zola
    } = data;

    // Validate required fields
    if (!ownerName || !ownerEmail || !galleryName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find or create person
    let person = await selectPersonByEmail(ownerEmail);
    
    if (!person) {
      person = await insertPerson({
        id: uuidv4(),
        name: ownerName,
        email: ownerEmail,
        isAdmin: false
      });
    }

    // Create gallery
    const galleryPath = galleryName.toLowerCase().replaceAll(' ', '-');
    const newGalleryData: NewGalleryData = {
      name: galleryName,
      path: galleryPath,
      password: generateRandomString(4),
      personId: person.id,
      createdBy: admin.id, // Track that admin created this
      ...(weddingDate && { date: new Date(weddingDate) }),
      ...(theKnot && { theknot: theKnot }),
      ...(zola && { zola })
    };

    const gallery = await insertGallery(newGalleryData);

    // Handle wedding websites if provided
    if (gallery.theknot || gallery.zola) {
      await handleWeddingWebsites(gallery);
    }

    // Add person to gallery
    await insertGalleryPerson(gallery.id, person.id);

    // Send welcome email
    let emailSent = false;
    try {
      await sendGridClient.sendCreationEmail(
        ownerEmail,
        ownerName,
        `${process.env.BASE_URL}/${gallery.path}`,
        gallery.password
      );
      emailSent = true;
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }

    return NextResponse.json({
      gallery,
      emailSent
    });
  } catch (error) {
    console.error('Create gallery error:', error);
    return NextResponse.json(
      { error: 'Failed to create gallery' },
      { status: 500 }
    );
  }
}
```

### Phase 5: Update Create Page for Admin Mode

#### 5.1 Update Create Page to Use Admin Endpoint

**File**: `/src/app/create/page.tsx`

Update the submitGallery function to use the admin endpoint when appropriate:

```typescript
const submitGallery = async (_galleryName: string, _name: string, _email?: string, theKnot? :string, zola?: string, person?: Person) => {
    // If admin is creating for someone else, use admin endpoint
    if (isAdmin && _email && person?.email !== _email) {
        try {
            const response = await fetch('/api/admin/galleries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ownerName: _name,
                    ownerEmail: _email,
                    galleryName: _galleryName,
                    theKnot,
                    zola
                })
            });
            
            if (!response.ok) throw new Error('Failed to create gallery');
            
            const { gallery } = await response.json();
            setGallery(gallery);
            setStage(2); // Move to welcome stage
            return;
        } catch (error) {
            console.error('Admin gallery creation failed:', error);
            // Fall back to regular flow
        }
    }
    
    // Regular gallery creation flow
    const url = `${_galleryName.toLowerCase().replaceAll(' ', '-')}`
    let _gallery = {
        name: _galleryName, 
        path: url, 
        password: generateRandomString(4),
        createdBy: person?.id // Track creator
    } as NewGalleryData
    
    // ... rest of existing code
}
```

### Phase 6: Add Admin-Specific Features

#### 6.1 Admin Gallery Actions

Add action buttons to the admin table for viewing and editing galleries:

```typescript
// In admin/page.tsx table actions cell:
<td>
  <Row className={styles.actions}>
    <button
      className={styles.actionButton}
      onClick={() => window.open(`/${gallery.path}?password=${gallery.password}`, '_blank')}
      title="View Gallery"
    >
      <FontAwesomeIcon icon={faEye} />
    </button>
    <button
      className={styles.actionButton}
      onClick={() => navigator.clipboard.writeText(`${window.location.origin}/${gallery.path}?password=${gallery.password}`)}
      title="Copy Link"
    >
      <FontAwesomeIcon icon={faLink} />
    </button>
  </Row>
</td>
```

### Testing Checklist

1. **UI Testing**
   - Admin page displays with proper layout
   - Tables show data correctly
   - Search functionality works
   - Status badges display correctly

2. **Gallery Creation**
   - Admin can create gallery from create page
   - Email is sent to gallery owner
   - Gallery tracks who created it

3. **API Testing**
   - GET `/api/admin/galleries` returns gallery stats
   - POST `/api/admin/galleries` creates gallery as admin

## Summary

This simplified RFC focuses on:

1. **Fixing the admin page UI** to properly display data
2. **Adding a simple `createdBy` field** to track gallery creators
3. **Creating basic admin endpoints** without complex audit logging
4. **Enabling admin gallery creation** through the existing create flow

The implementation avoids complexity by:
- No audit logging table
- Reusing existing create flow for admins
- Simple database changes (just one new field)
- Minimal new endpoints