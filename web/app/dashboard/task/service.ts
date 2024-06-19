export interface User {
    id: number;
    userId: string;
    firstname: string;
    lastname: string;
    description: string;
    image: string;
    brand: string;
    serialnumber: string;
    createdAT: string;
    updatedAT: string;
  }
  
  const BASE_URL = "http://localhost:3333/pcuser";
  
  export const fetchUsers = async (search = "", perPage = 5): Promise<User[]> => {
    const response = await fetch(`${BASE_URL}/get?perPage=${perPage}&search=${search}`);
    if (!response.ok) throw new Error("Failed to fetch users");
    return response.json();
  };
  
  export const fetchUser = async (id: number): Promise<User> => {
    const response = await fetch(`${BASE_URL}/get/${id}`);
    if (!response.ok) throw new Error("Failed to fetch user");
    return response.json();
  };
  
  export const updateUser = async (id: number, user: Partial<User>): Promise<void> => {
    const response = await fetch(`${BASE_URL}/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    if (!response.ok) throw new Error("Failed to update user");
  };
  
  export const deleteUser = async (id: number): Promise<void> => {
    const response = await fetch(`${BASE_URL}/delete/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Failed to delete user");
  };
  