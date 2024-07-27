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

// Utility Function to Handle HTTP Response
const handleResponse = async (response: Response): Promise<any> => {
  const contentType = response.headers.get("content-type");

  if (!response.ok) {
    let errorMessage: string = "An error occurred";

    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } else {
      errorMessage = await response.text();
    }

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
      console.error(`Attempt ${attempt + 1} failed: ${error}`);
      if (attempt === retries - 1) {
        throw new NetworkError("Network error, please try again later.");
      }
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait before retrying
    }
  }

  throw new Error("Maximum retry attempts reached.");
};

export interface User {
  id: string;
  userId: string;
  firstname: string;
  lastname: string;
  description: string;
  image: string;
  brand: string;
  endYear: string;
  serialnumber: string;
  gender: string;
  barcode: string;
  createdAt: string;
  updatedAt: string;
  status: string;
}

// Fetch Users by Year
export async function fetchUsersByYear(endYear: string): Promise<User[]> {
  try {
    const response = await fetchWithRetry(`http://localhost:3333/pcuser/year/tired?endYear=${endYear}`, {
      method: 'GET',
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching users by year:', error);

    if (error instanceof NotFoundError) {
      alert('No users found for the specified year.');
    } else if (error instanceof UnauthorizedError) {
      alert('You are not authorized to access this data.');
    } else {
      alert('Failed to fetch users. Please try again later.');
    }

    throw error;
  }
}

// Trash Users by User ID
export async function trashUsersByUserId(userId: string): Promise<void> {
  try {
    const response = await fetchWithRetry(`http://localhost:3333/pcuser/trash/user/tired?userId=${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });

    await handleResponse(response);
  } catch (error) {
    console.error('Error trashing users by user ID:', error);

    if (error instanceof NotFoundError) {
      alert('User not found. Please check the user ID.');
    } else {
      alert('Failed to trash users. Please try again later.');
    }

    throw error;
  }
}

// Fetch All Users
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await fetchWithRetry('http://localhost:3333/pcuser/get/tired', {
      method: 'GET',
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching users:', error);

    if (error instanceof NetworkError) {
      alert('Network issue, please check your connection.');
    } else {
      alert('Failed to fetch users. Please try again later.');
    }

    throw error;
  }
};

// Restore Users by Year
export async function restoreUsersByYear(endYear: string): Promise<void> {
  try {
    const response = await fetchWithRetry(`http://localhost:3333/pcuser/restore?year=${endYear}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endYear }),
    });

    await handleResponse(response);
  } catch (error) {
    console.error('Error restoring users by year:', error);

    if (error instanceof NotFoundError) {
      alert('No users found to restore for the specified year.');
    } else {
      alert('Failed to restore users. Please try again later.');
    }

    throw error;
  }
}
