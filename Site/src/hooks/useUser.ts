"use client"

import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

const userMock = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  username: "Raxo",
  walletAddress: "fake_news",
  avatar: "/placeholder.svg?height=100&width=100",
  rating: 4.5,
  telegramHandle: "@raxocoding"
}

export function useUser(walletAddress: string) {
  const fetchUser = async (): Promise<User | null> => {
    return userMock;
  };

  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User | null, Error>({
    queryKey: ["user", walletAddress],
    queryFn: fetchUser,
  });

  return {
    user,
    error,
    isLoading: isLoading,
  };
}
