"use client";

import { User } from "@/types/user";
import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export function useUser(username: string) {
  const fetchUser = async (): Promise<User | null> => {
    const { data, error } = await supabase
      .from("users")
      .select("id, username, walletAddress, avatar, rating, telegramHandle")
      .eq("username", username)
      .single();

    if (error) throw error;

    return data;
  };

  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User | null, Error>({
    queryKey: ["user", username],
    queryFn: fetchUser,
    enabled: !!supabase,
  });

  return {
    user,
    error,
    isLoading: isLoading,
  };
}
