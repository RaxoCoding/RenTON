"use client";

import { User } from "@/types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useIsConnectionRestored, useTonConnectUI } from "@tonconnect/ui-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { generateUsername } from "@/lib/utils";

interface baseSideEffects {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
  onSettled?: (data: unknown, error: unknown) => void;
}

export function useAuthedUser() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [tonConnectUI] = useTonConnectUI();
  const connectionRestored = useIsConnectionRestored();

  const fetchUser = async (): Promise<User | null> => {
    if (!tonConnectUI?.account) throw new Error("User not authenticated!");

    const { data, error } = await supabase
      .from("users")
      .select("id, username, walletAddress, avatar, rating, telegramHandle")
      .eq("walletAddress", tonConnectUI.account.address)
      .single();

    if (error) throw error;

    return { ...data };
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

      if (!tonConnectUI.account) throw new Error("Not authenticated!");

      const account = {
        address: tonConnectUI.account.address,
        publicKey: tonConnectUI.account.publicKey,
        walletStateInit: tonConnectUI.account.walletStateInit,
      };

      // Check if account exists else create it
      const { data, error } = await supabase
        .from("users")
        .select("id")
        .eq("walletAddress", account.address)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        const user: Omit<User, "id"> = {
          username: generateUsername(),
          walletAddress: account.address,
          avatar: null,
          rating: null,
          telegramHandle: null,
        };

        const { error } = await supabase.from("users").insert(user);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authed_user"] });
    },
  });

  const logoutUser = useMutation({
    mutationFn: async () => {
      if (!tonConnectUI.account) throw new Error("Not authenticated!");

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

  interface updaterUserVairables extends baseSideEffects {
    updates: Omit<User, "id" | "walletAddress" | "rating" | "avatar">;
  }

  const updateUser = useMutation({
    mutationFn: async ({ updates }: updaterUserVairables) => {
      if (!tonConnectUI.account) throw new Error("Not authenticated!");

      const { error } = await supabase
        .from("users")
        .update({ username: updates.username, telegramHandle: updates.telegramHandle })
        .eq("walletAddress", tonConnectUI.account.address);

      if (error) throw error;
    },
    onSuccess: (data, { onSuccess }: updaterUserVairables) => {
      queryClient.invalidateQueries({ queryKey: ["authed_user"] });
      onSuccess && onSuccess(data);
    },
    onError: (error, { onError }: updaterUserVairables) => {
      onError && onError(error);
    },
    onSettled: (data, error, { onSettled }: updaterUserVairables) => {
      onSettled && onSettled(data, error);
    },
  });

	const deleteUser = useMutation({
    mutationFn: async () => {
      if (!tonConnectUI.account) throw new Error("Not authenticated!");

      const { error } = await supabase
        .from("users")
        .delete()
        .eq("walletAddress", tonConnectUI.account.address);

      if (error) throw error;
    },
    onSuccess: (data, { onSuccess }: baseSideEffects) => {
			tonConnectUI.disconnect();
			queryClient.setQueryData(["authed_user"], null);
			router.push("/");
      onSuccess && onSuccess(data);
    },
    onError: (error, { onError }: baseSideEffects) => {
      onError && onError(error);
    },
    onSettled: (data, error, { onSettled }: baseSideEffects) => {
      onSettled && onSettled(data, error);
    },
  });

  const {
    data: authedUser,
    error,
    isLoading,
  } = useQuery<User | null, Error>({
    queryKey: ["authed_user"],
    queryFn: fetchUser,
    enabled:
      connectionRestored &&
      !!tonConnectUI &&
      !!tonConnectUI.account &&
      !!supabase,
  });

  return {
    authedUser,
    error,
    isLoading: isLoading,
    login: loginUser.mutate,
    isLoggingIn: loginUser.isPending,
    logout: logoutUser.mutate,
    isLoggingOut: logoutUser.isPending,
		updateUser: updateUser.mutate,
		isUpdatingUser: updateUser.isPending,
		deleteUser: deleteUser.mutate,
		isDeletingUser: deleteUser.isPending
  };
}
