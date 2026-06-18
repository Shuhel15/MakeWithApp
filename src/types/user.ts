export interface User {
  id: string;
  username: string; // Will have leading @ in api responses
  name: string;
  phoneNumber: string;
  role: string;
  avatarUrl?: string; // Optional field for profile picture URL
}
