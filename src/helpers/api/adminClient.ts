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
    ...(search && { search }),
    status: 'active'
  });
  
  const response = await fetch(`/api/admin/galleries?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch galleries');
  }
  return response.json();
};

export const fetchAdminDeletedGalleries = async (
  page: number = 1,
  search?: string
): Promise<{ galleries: GalleryWithStats[] }> => {
  const params = new URLSearchParams({
    page: page.toString(),
    ...(search && { search }),
    status: 'deleted'
  });
  
  const response = await fetch(`/api/admin/galleries?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch deleted galleries');
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
    id: admin.id,
    name: admin.name,
    email: admin.email,
    phone: admin.phone,
    created: admin.created,
    galleriesCount: 0 // This would be populated from a real query
  }));
  
  return { users };
};

export const createAdminGallery = async (galleryData: {
  ownerName: string;
  ownerEmail: string;
  galleryName: string;
  weddingDate?: string;
  theKnot?: string;
  zola?: string;
}) => {
  const response = await fetch('/api/admin/galleries', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(galleryData)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create gallery');
  }
  
  return response.json();
};

export const createAdmin = async (adminData: {
  name: string;
  email: string;
  phone?: string;
}) => {
  const response = await fetch('/api/admin/admins', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(adminData)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create admin');
  }
  
  return response.json();
};

export const deleteAdminGallery = async (galleryId: string): Promise<{ success: boolean }> => {
  const response = await fetch(`/api/admin/galleries/${galleryId}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete gallery');
  }
  return response.json();
};

export const restoreAdminGallery = async (galleryId: string): Promise<{ success: boolean }> => {
  const response = await fetch(`/api/admin/galleries/${galleryId}/restore`, {
    method: 'PUT'
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to restore gallery');
  }
  return response.json();
};