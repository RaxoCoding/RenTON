"use client";

import { Product } from "@/types/product";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getProducts,
  addProductToSupabase,
  updateProductInSupabase,
} from "@/supabase/productsQuery";
import { useAuthedUser } from "./useAuthedUser";
import { ProductNft } from "@/contracts/ProductNft";
import { Nft } from "@/contracts/Nft";
import { Address, fromNano, toNano } from "ton-core";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { sender } from "@/lib/wallet";

interface baseSideEffects {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
  onSettled?: (data: unknown, error: unknown) => void;
}

const productNftContract = new ProductNft(
  "EQDbqRuKhJzVePg-iEuIaz027J9esBL5v4mGT5gCV2MxO_VV"
);

export function useInventory() {
  const queryClient = useQueryClient();
  const { authedUser } = useAuthedUser();
  const [tonConnectUI] = useTonConnectUI();

  const fetchInventory = async (): Promise<Product[] | null> => {
    if (!authedUser) throw new Error("Not authenticated!");

    if (!productNftContract.isDeployed) {
      console.error("ProductNft Contract is not deployed");
      throw new Error("Unable to list products!");
    }

    const productAddresses = await productNftContract.getNftAddresses();

    let products: Product[] = [];
    for (const { address: productAddress } of productAddresses) {
      const nftContract = new Nft(productAddress);

      const summary = await nftContract.getSummary();

      const product: Product = {
        id: productAddress,
        name: summary.productName.toString(),
        images: [summary.descriptionImageUrl.toString()],
        description: summary.productDescription.toString(),
        location: summary.productLocation.toString(),
        pricePerHour: parseInt(fromNano(summary.productHourPrice.toString())),
        cautionPrice: parseInt(fromNano(summary.productStake.toString())),
        owner: Address.parse(summary.owner.toString()).toString(),
      };

      if (
        Address.parse(summary.owner.toString()).toRawString() ==
        authedUser.walletAddress
      ) {
        products.push(product);
      }
    }

    return products;
  };

  interface addToInventoryVariables extends baseSideEffects {
    product: Omit<Product, "id" | "owner"> & { imagesFiles: File[] };
  }

  const addToInventory = useMutation({
    mutationFn: async ({ product }: addToInventoryVariables) => {
      if (!authedUser) throw new Error("Not authenticated!");

      // await addProductToSupabase({ ...product, owner: authedUser.id });

      console.log(await productNftContract.mintNft(
        sender(tonConnectUI),
        Address.parse(authedUser.walletAddress),
        product.name,
        product.description || "",
        "https://mnlfkqhkiahkfkyumdgl.supabase.co/storage/v1/object/public/images/Mountainbike-fully-MTB-27-5-Zoll-Velo-Rocker-X--3--3900553759.jpg",
        toNano(product.cautionPrice),
        product.location || "Unknown",
        toNano(product.pricePerHour)
      ));
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
