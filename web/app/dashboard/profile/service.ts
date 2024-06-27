export interface User {
    id: number;
    name: string;
    last_name: string;
    email: string;
    address: string;
    phonenumer: string;
    role: string;
    status: string;
    gender: string;
  }
  
  const BASE_URL = "http://localhost:3333/auth";
  
  export const fetchUser = async (id: number): Promise<User> => {
    try {
      const token = localStorage.getItem("token"); // Fetch token from localStorage or wherever it's stored
      const response = await fetch(`${BASE_URL}/get/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        //   "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to fetch user: ${errorMessage}`);
      }
      return response.json();
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error; // Rethrow the error to propagate it to the caller
    }
  };
  
  export const updateUser = async (id: number, user: Partial<User>): Promise<void> => {
    const token = localStorage.getItem("token"); // Fetch token from localStorage or wherever it's stored
    const response = await fetch(`${BASE_URL}/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) throw new Error("Failed to update user");
  };
  