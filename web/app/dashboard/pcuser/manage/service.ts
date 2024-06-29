export interface User {
  id: string;
  userId: string;
  firstname: string;
  lastname: string;
  description: string;
  image: string;
  brand: string;
  endYear: string,
  serialnumber: string;
  barcode: string;
  createdAt: string; // Corrected typo: 'createdAt' instead of 'createdAT'
  updatedAt: string; // Corrected typo: 'updatedAt' instead of 'updatedAT'
  status: string;
}

export async function fetchUsersByYear(endYear: string): Promise<User[]> {
  console.log("end year", endYear);
  try {
    const response = await fetch(`http://localhost:3333/pcuser/year?endYear=${endYear}`);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching users by year:', error);
    throw new Error('Failed to fetch users');
  }
}

export async function trashUsersByYear(endYear: string): Promise<void> {
  try {
    const response = await fetch(`http://localhost:3333/pcuser/trash?year=${endYear}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endYear }),
    });
    if (!response.ok) {
      throw new Error('Failed to trash users');
    }
  } catch (error) {
    console.error('Error trashing users by year:', error);
    throw new Error('Failed to trash users');
  }
}

export async function restoreUsersByYear(endYear: string): Promise<void> {
  try {
    const response = await fetch(`http://localhost:3333/pcuser/restore?year=${endYear}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endYear }),
    });
    if (!response.ok) {
      throw new Error('Failed to restore users');
    }
  } catch (error) {
    console.error('Error restoring users by year:', error);
    throw new Error('Failed to restore users');
  }
}
