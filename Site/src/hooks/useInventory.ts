"use client";

import { Product } from "@/types/product";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProducts, addProductToSupabase, updateProductInSupabase } from "@/supabase/productsQuery";
import { useAuthedUser } from "./useAuthedUser";

export function useInventory() {
  const queryClient = useQueryClient();
  const { authedUser } = useAuthedUser();

  const fetchInventory = async (): Promise<Product[] | null> => {
    if (!authedUser) throw new Error("Not authenticated!");

    // Récupère les produits depuis Supabase
    return await getProducts(authedUser.id);
  };

  interface addToInventoryVariables {
    product: Omit<Product, "owner">;
  }

  const addToInventory = useMutation({
    mutationFn: async ({ product }: addToInventoryVariables) => {
      if (!authedUser) throw new Error("Not authenticated!");

      console.log(product);
      // Ajoute le produit à Supabase

      const { id, ...productWithoutId } = product;
      await addProductToSupabase({ ...productWithoutId, owner: authedUser.id });
    },
    onSuccess: () => {
      // Invalide le cache pour actualiser les données
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });

  interface updateProductVariables {
    productId: string;
    updates: Partial<Omit<Product, "id" | "owner">>;
  }

  const updateProduct = useMutation({
    mutationFn: async ({ productId, updates }: updateProductVariables) => {
      if (!authedUser) throw new Error("Not authenticated!");

      // Met à jour le produit dans Supabase
      await updateProductInSupabase(productId, updates);
    },
    onSuccess: () => {
      // Invalide le cache pour actualiser les données
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
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
