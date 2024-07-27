// Define Custom Error Classes
class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
  }
}

class InternalServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InternalServerError";
  }
}

// User Interface
export interface User {
  userId: string;
  firstname: string;
  lastname: string;
  description: string;
  pcowner: string;
  gender: string;
  endYear: string;
  image: string;
  barcode: string;
  phonenumber: string;
  brand: string;
  serialnumber: string;
  createdAT: string;
  updatedAT: string;
}

const BASE_URL = "http://localhost:3333/pcuser";

// Utility Function to Handle HTTP Response
const handleResponse = async (response: Response) => {
  const contentType = response.headers.get('content-type');
  
  if (!response.ok) {
    let errorMessage: string = "An error occurred";
    
    // Check if response has JSON body
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } else {
      errorMessage = await response.text();
    }

    // Throw specific error based on status code
    switch (response.status) {
      case 400:
        throw new BadRequestError(errorMessage);
      case 404:
        throw new NotFoundError(errorMessage);
      case 500:
        throw new InternalServerError(errorMessage);
      default:
        throw new Error(errorMessage);
    }
  }
  
  // Parse JSON if available
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  
  return response;
};

// Fetch Users Function
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(`${BASE_URL}/get`);
    return await handleResponse(response);
  } catch (error) {
    console.error("Error fetching users:", error);
    // Provide a user-friendly error message
    alert("Could not fetch users. Please try again later.");
    throw error;
  }
};

// Fetch Single User Function
export const fetchUser = async (id: string): Promise<User> => {
  try {
    const response = await fetch(`${BASE_URL}/search?userId=${id}`);
    return await handleResponse(response);
  } catch (error) {
    console.error("Error fetching user:", error);
    if (error instanceof NotFoundError) {
      alert("User not found.");
    } else {
      alert("Could not fetch user details. Please try again later.");
    }
    throw error;
  }
};

// Update User Function
export const updateUser = async (id: string, user: Partial<User>): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/update?userId=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    await handleResponse(response);
  } catch (error) {
    console.error("Error updating user:", error);
    alert("Failed to update user. Please check your input and try again.");
    throw error;
  }
};

// Delete User Function
export const deleteUser = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/delete?userId=${id}`, { method: "DELETE" });
    await handleResponse(response);
  } catch (error) {
    console.error("Error deleting user:", error);
    alert("Failed to delete user. Please try again later.");
    throw error;
  }
};

// Fetch Barcode Function
export const fetchBarcode = async (filename: string): Promise<string> => {
  try {
    const response = await fetch(`http://localhost:3333/pcuser/barcodes/${filename}`);
    await handleResponse(response);
    return URL.createObjectURL(await response.blob());
  } catch (error) {
    console.error("Error fetching barcode:", error);
    alert("Failed to fetch barcode. Please try again later.");
    throw error;
  }
};
