const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';

export const fetchAdminStats = async () => {
  const response = await fetch(`${BASE_URL}/api/admin/stats`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch admin stats');
  }

  return response.json();
};

export const fetchAdminGalleries = async (page = 1, search = '') => {
  const params = new URLSearchParams({
    page: page.toString(),
    search,
  });

  const response = await fetch(`${BASE_URL}/api/admin/galleries?${params}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch galleries');
  }

  return response.json();
};

export const fetchAdminUsers = async (page = 1, search = '') => {
  const params = new URLSearchParams({
    page: page.toString(),
    search,
  });

  const response = await fetch(`${BASE_URL}/api/admin/users?${params}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return response.json();
};

export const fetchAdminList = async () => {
  const response = await fetch(`${BASE_URL}/api/admin/admins`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch admin list');
  }

  return response.json();
};

export const createAdminUser = async (personId: string) => {
  const response = await fetch(`${BASE_URL}/api/admin/admins`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ personId }),
  });

  if (!response.ok) {
    throw new Error('Failed to create admin user');
  }

  return response.json();
};

export const removeAdminUser = async (personId: string) => {
  const response = await fetch(`${BASE_URL}/api/admin/admins/${personId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to remove admin user');
  }

  return response.json();
};

export const exportData = async (type: 'users' | 'galleries') => {
  const response = await fetch(`${BASE_URL}/api/admin/tools/export?type=${type}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to export data');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${type}-export-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};