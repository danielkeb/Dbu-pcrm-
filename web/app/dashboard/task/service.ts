export interface User {
  userId: string;
  firstname: string;
  lastname: string;
  description: string;
  image: string;
  barcode: string;
  brand: string;
  serialnumber: string;
  createdAT: string;
  updatedAT: string;
}

const BASE_URL = "http://localhost:3333/pcuser";

export const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch(`${BASE_URL}/get`);
  if (!response.ok) throw new Error("Failed to fetch users");
  return response.json();
};

export const fetchUser = async (id: string): Promise<User> => {
  try {
    const response = await fetch(`${BASE_URL}/search?userId=${id}`);
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to fetch user: ${errorMessage}`);
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const updateUser = async (id: string, user: Partial<User>): Promise<void> => {
  const response = await fetch(`${BASE_URL}/update?userId=${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!response.ok) throw new Error("Failed to update user");
};

export const deleteUser = async (id: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/delete/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete user");
};

export const fetchBarcode = async (filename: string): Promise<string> => {
  try {
    const response = await fetch(`http://localhost:3333/pcuser/barcodes/${filename}`);
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to fetch barcode: ${errorMessage}`);
    }
    const url = URL.createObjectURL(await response.blob());
    return url;
  } catch (error) {
    console.error("Error fetching barcode:", error);
    throw error;
  }
};
