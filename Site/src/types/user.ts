export type User = {
  id: string, // UUID
	username: string,
	walletId: string,
	avatar: string,
	rating: number, // 0-5
	telegram_handle: string | null,
};
