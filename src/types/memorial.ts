export interface Memorial {
  id: string;
  name: string;
  birthYear: number;
  deathYear: number;
  description: string;
  profileImage?: string;
  createdBy: string;
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface CreateMemorialRequest {
  name: string;
  birthYear: number;    // Keep as number
  deathYear: number;    // Keep as number
  description?: string;
  relationship?: string;
  imageUri?: string;
  createdBy: string;
}