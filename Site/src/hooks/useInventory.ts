"use client";

import { Product } from "@/types/product";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProducts, addProductToSupabase, updateProductInSupabase } from "@/supabase/productsQuery";
import { useAuthedUser } from "./useAuthedUser";

interface baseSideEffects {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
  onSettled?: (data: unknown, error: unknown) => void;
}

export function useInventory() {
  const queryClient = useQueryClient();
  const { authedUser } = useAuthedUser();

  const fetchInventory = async (): Promise<Product[] | null> => {
    if (!authedUser) throw new Error("Not authenticated!");

    // Récupère les produits depuis Supabase
    return await getProducts(authedUser.id);
  };

  interface addToInventoryVariables extends baseSideEffects {
    product: Omit<Product, "id" | "owner"> & { imagesFiles: File[] };
  }

  const addToInventory = useMutation({
    mutationFn: async ({ product }: addToInventoryVariables) => {
      if (!authedUser) throw new Error("Not authenticated!");

      await addProductToSupabase({ ...product, owner: authedUser.id });
    },
    onSuccess: (_, { onSuccess }: addToInventoryVariables) => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      if (onSuccess) {
        onSuccess(error);
      }
    },
    onError: (error, { onError }: addToInventoryVariables) => {
      if (onError) {
        onError(error);
      }
    },
  });

  interface updateProductVariables extends baseSideEffects {
    productId: string;
    updates: Omit<Product, "owner"> & { imagesFiles: File[] };
  }

  const updateProduct = useMutation({
    mutationFn: async ({ productId, updates }: updateProductVariables) => {
      if (!authedUser) throw new Error("Not authenticated!");

      // Met à jour le produit dans Supabase
      await updateProductInSupabase(productId, updates);

      return productId;
    },
    onSuccess: (data, { onSuccess }: updateProductVariables) => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["product", data] });
      if (onSuccess) {
        onSuccess(error);
      }
    },
    onError: (error, { onError }: updateProductVariables) => {
      if (onError) {
        onError(error);
      }
    },
  });

  const {
    data: products,
    error,
    isLoading,
  } = useQuery<Product[] | null, Error>({
    queryKey: ["inventory"],
    queryFn: fetchInventory,
  });

  return {
    products,
    error,
    isLoading,
    addToInventory: addToInventory.mutate,
    isAddingToInventory: addToInventory.isPending,
    updateProduct: updateProduct.mutate,
    isUpdatingProduct: updateProduct.isPending,
  };
}
