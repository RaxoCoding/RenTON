"use client";

import { Product } from "@/types/product";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTonAddress } from "@tonconnect/ui-react";

const inventoryMock: Product[] = [
  {
    id: "1",
    name: "Mountain Bike",
    images: [
      "/bike.jpg",
    ],
    pricePerHour: 10,
    cautionPrice: 200,
    owner: "user123",
    description: "test description",
  },
  {
    id: "2",
    name: "City Bike",
    images: [
      "/bike.jpg",
    ],
    pricePerHour: 8,
    cautionPrice: 150,
    owner: "user123",
		description: null
  },
];

export function useInventory() {
  const queryClient = useQueryClient();
  const walletAddress = useTonAddress();

  const fetchInventory = async (): Promise<Product[] | null> => {
    if (!walletAddress) throw new Error("Not authenticated!");

    return inventoryMock;
  };

  interface addToInventoryVariables {
    product: Omit<Product, "id" | "owner">;
  }

  const addToInventory = useMutation({
    mutationFn: async ({ product }: addToInventoryVariables) => {
      if (!walletAddress) throw new Error("Not authenticated!");

      inventoryMock.push({ ...product, id: "bla", owner: "123" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });

  interface updateProductVariables {
    productId: string;
    updates: Partial<Omit<Product, "id" | "owner">>;
  }

  const updateProduct = useMutation({
    mutationFn: async ({ productId, updates }: updateProductVariables) => {
      if (!walletAddress) throw new Error("Not authenticated!");

      const productIdx = inventoryMock.findIndex((x) => x.id === productId);

      if (!productIdx) throw new Error("Product does not exist!");

      if (updates.name) {
        inventoryMock[productIdx].name = updates.name;
      }
      if (updates.description) {
        inventoryMock[productIdx].description = updates.description;
      }
      if (updates.images) {
        inventoryMock[productIdx].images = updates.images;
      }
      if (updates.pricePerHour) {
        inventoryMock[productIdx].pricePerHour = updates.pricePerHour;
      }
      if (updates.cautionPrice) {
        inventoryMock[productIdx].cautionPrice = updates.cautionPrice;
      }
    },
    onSuccess: () => {
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
    isLoading: isLoading,
    addToInventory: addToInventory.mutate,
    isAddingToInventory: addToInventory.isPending,
    updateProduct: updateProduct.mutate,
    isUpdatingProduct: updateProduct.isPending,
  };
}
