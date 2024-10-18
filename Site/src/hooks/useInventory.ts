"use client"

import { Product } from "@/types/product";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTonAddress } from "@tonconnect/ui-react";

let inventoryMock: Product[] = [
  {
    id: "1",
    name: "Mountain Bike",
    images: [
      "https://pedegoelectricbikes.ca/wp-content/uploads/2022/07/Pedego-Avenue-Step-Thru-in-Ocean-Teal.jpg",
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
      "https://www.rollbicycles.com/cdn/shop/products/A1_SIDE_BRG_BLK_2880x1600_0b1024fe-3bd8-4d95-8d63-8331bba972f7.png?v=1594754081",
    ],
    pricePerHour: 8,
    cautionPrice: 150,
    owner: "user123",
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

      let productIdx = inventoryMock.findIndex((x) => x.id === productId);

      if (!productIdx) throw new Error("Product does not exist!");

			updates.name && (inventoryMock[productIdx].name = updates.name);
			updates.description && (inventoryMock[productIdx].description = updates.description);
			updates.images && (inventoryMock[productIdx].images = updates.images);
			updates.pricePerHour && (inventoryMock[productIdx].pricePerHour = updates.pricePerHour);
			updates.cautionPrice && (inventoryMock[productIdx].cautionPrice = updates.cautionPrice);
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
    isAddingToInventory: addToInventory.isLoading,
		updateProduct: updateProduct.mutate,
		isUpdatingProduct: updateProduct.isLoading
  };
}
