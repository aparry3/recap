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