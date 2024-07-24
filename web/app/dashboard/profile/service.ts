import { AppContext } from "@/components/UserContext";
import { useContext } from "react";

export interface User {
  id: string;
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

export const fetchUser = async (id: string): Promise<User> => {

  
  try {
    const token = localStorage.getItem("token"); // Fetch token from localStorage or wherever it's stored
    const response = await fetch(`${BASE_URL}/user?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
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

// service.ts
export const updateUser = async (id: string, user: User): Promise<User> => {
  try {
    const token = localStorage.getItem("token");
    const payload = JSON.stringify(user);
    console.log('Payload being sent:', payload); // Debugging the payload
    const response = await fetch(`${BASE_URL}/profile?id=${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: payload, // Convert the user object to a JSON string
    });
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Failed to update user: ${errorMessage}`);
    }
    const updatedUser = await response.json();
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

