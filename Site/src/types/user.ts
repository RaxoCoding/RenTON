export type User = {
  id: string; // UUID
  username: string;
  walletAddress: string;
  avatar: string | null;
  rating: number | null; // 0-5
  telegramHandle: string;
};
