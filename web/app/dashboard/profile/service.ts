// Custom Error Classes
class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
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

class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NetworkError";
  }
}

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

// Base URL for API requests
const BASE_URL = "http://localhost:3333/auth";

// Utility Function to Handle HTTP Response
const handleResponse = async (response: Response): Promise<any> => {
  const contentType = response.headers.get("content-type");

  if (!response.ok) {
    let errorMessage: string = "An error occurred";

    // Check if response has a JSON body
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } else {
      errorMessage = await response.text();
    }

    // Throw specific error based on status code
    switch (response.status) {
      case 400:
        throw new BadRequestError(errorMessage);
      case 401:
        throw new UnauthorizedError(errorMessage);
      case 404:
        throw new NotFoundError(errorMessage);
      case 500:
        throw new InternalServerError(errorMessage);
      default:
        throw new Error(errorMessage);
    }
  }

  // Parse JSON if available
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }

  return response;
};

// Fetch with Retry Logic
const fetchWithRetry = async (
  url: string,
  options: RequestInit = {},
  retries: number = 3
): Promise<Response> => {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
    } catch (error) {
      if (attempt === retries - 1) {
        throw new NetworkError("Network error, please try again later.");
      }
    }
  }

  throw new Error("Maximum retry attempts reached.");
};


// Fetch Single User Function
export const fetchUser = async (id: string): Promise<User> => {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new UnauthorizedError("Authentication token not found.");
    }

    const response = await fetchWithRetry(`${BASE_URL}/user?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Error fetching user:", error);

    if (error instanceof NotFoundError) {
      alert("User not found.");
    } else if (error instanceof UnauthorizedError) {
      alert("You are not authorized to access this resource.");
      // Optionally redirect to login page
      // window.location.href = '/login';
    } else {
      alert("Could not fetch user details. Please try again later.");
    }

    throw error; // Rethrow the error to propagate it to the caller
  }
};

// service.ts
// Update User Function
export const updateUser = async (id: string, user: User): Promise<User> => {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new UnauthorizedError("Authentication token not found.");
    }

    const payload = JSON.stringify(user);
    console.log("Payload being sent:", payload);

    const response = await fetchWithRetry(`${BASE_URL}/profile?id=${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: payload,
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Error updating user:", error);

    if (error instanceof BadRequestError) {
      alert("Invalid data provided. Please check your input and try again.");
    } else if (error instanceof UnauthorizedError) {
      alert("You are not authorized to update this user.");
    } else {
      alert("Failed to update user. Please try again later.");
    }

    throw error;
  }
};


