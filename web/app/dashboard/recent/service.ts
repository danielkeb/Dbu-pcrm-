export interface Action {
    id: number;
    userId: string;
    action: string;
    createdAT: string;
  }
  
  const BASE_URL = "http://localhost:3333/pcuser";
  
  export const fetchRecentActions = async (): Promise<Action[]> => {
    const response = await fetch(`${BASE_URL}/action`);
    if (!response.ok) {
      throw new Error("Failed to fetch recent actions");
    }
    return response.json();
  };
  