"use client";

import { User } from "@/types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useIsConnectionRestored, useTonConnectUI } from "@tonconnect/ui-react";
import { useRouter } from "next/navigation";

const userMock = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  username: "Raxo",
  walletAddress: "fake_news",
  avatar: "/placeholder.svg?height=100&width=100",
  rating: 4.5,
  telegramHandle: "@raxocoding",
};

export function useAuthedUser() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [tonConnectUI] = useTonConnectUI();
  const connectionRestored = useIsConnectionRestored();

  const fetchUser = async (): Promise<User | null> => {
    console.log(tonConnectUI.account);
    if (!tonConnectUI?.account) throw new Error("User not authenticated!");

    return { ...userMock, walletAddress: tonConnectUI.account.address };
  };

  const loginUser = useMutation({
    mutationFn: async () => {
      if (tonConnectUI?.account) throw new Error("Already authenticated!");

      await new Promise((resolve, reject) => {
        const unsubscribe = tonConnectUI.onStatusChange(
          () => {
            unsubscribe();
            resolve("login");
          },
          (err) => {
            reject(err);
          }
        );

				tonConnectUI.openModal();
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authed_user"] });
    },
  });

  const logoutUser = useMutation({
    mutationFn: async () => {
      if (!tonConnectUI?.account) throw new Error("Not authenticated!");

			await new Promise((resolve, reject) => {
        const unsubscribe = tonConnectUI.onStatusChange(
          () => {
            unsubscribe();
            resolve("logout");
          },
          (err) => {
            reject(err);
          }
        );

				tonConnectUI.disconnect();
      });
    },
    onSuccess: () => {
      queryClient.setQueryData(["authed_user"], null);
      router.push("/");
    },
  });

  const {
    data: authedUser,
    error,
    isLoading,
  } = useQuery<User | null, Error>({
    queryKey: ["authed_user"],
    queryFn: fetchUser,
    enabled: (connectionRestored && tonConnectUI != undefined && tonConnectUI.account != null),
  });

  return {
    authedUser,
    error,
    isLoading: isLoading,
    login: loginUser.mutate,
    isLoggingIn: loginUser.isPending,
    logout: logoutUser.mutate,
    isLoggingOut: logoutUser.isPending,
  };
}
