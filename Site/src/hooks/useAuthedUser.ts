"use client";

import { User } from "@/types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useIsConnectionRestored, useTonConnectUI } from "@tonconnect/ui-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

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
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return {
        id: "NULL",
        username: "",
        walletAddress: "",
        telegramHandle: "",
        avatar: null,
        rating: null,
      };
    }

    return { ...data };
  };

  interface registerUserInterface extends baseSideEffects {
    username: string;
    telegramHandle: string;
  }

  const registerUser = useMutation({
    mutationFn: async ({ username, telegramHandle }: registerUserInterface) => {
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
          username: username,
          walletAddress: account.address,
          telegramHandle:
            telegramHandle.charAt(0) == "@"
              ? telegramHandle
              : "@" + telegramHandle,
          avatar: null,
          rating: null,
        };

        const { error } = await supabase.from("users").insert(user);

        if (error) throw error;
      }
    },
    onSuccess: (_, { onSuccess }: registerUserInterface) => {
      queryClient.invalidateQueries({ queryKey: ["authed_user"] });
      if (onSuccess) {
        onSuccess(error);
      }
    },
    onError: (error, { onError }: registerUserInterface) => {
      if (onError) {
        onError(error);
      }
    },
  });

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
        .update({
          username: updates.username,
          telegramHandle: updates.telegramHandle,
        })
        .eq("walletAddress", tonConnectUI.account.address);

      if (error) throw error;
    },
    onSuccess: (data, { onSuccess }: updaterUserVairables) => {
      queryClient.invalidateQueries({ queryKey: ["authed_user"] });
      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError: (error, { onError }: updaterUserVairables) => {
      if (onError) {
        onError(error);
      }
    },
    onSettled: (data, error, { onSettled }: updaterUserVairables) => {
      if (onSettled) {
        onSettled(data, error);
      }
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
      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError: (error, { onError }: baseSideEffects) => {
      if (onError) {
        onError(error);
      }
    },
    onSettled: (data, error, { onSettled }: baseSideEffects) => {
      if (onSettled) {
        onSettled(data, error);
      }
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
    register: registerUser.mutate,
    isRegistering: registerUser.isPending,
    login: loginUser.mutate,
    isLoggingIn: loginUser.isPending,
    logout: logoutUser.mutate,
    isLoggingOut: logoutUser.isPending,
    updateUser: updateUser.mutate,
    isUpdatingUser: updateUser.isPending,
    deleteUser: deleteUser.mutate,
    isDeletingUser: deleteUser.isPending,
  };
}
