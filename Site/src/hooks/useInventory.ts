"use client";

import { Product } from "@/types/product";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthedUser } from "./useAuthedUser";
import { ProductNft } from "@/contracts/ProductNft";
import { Nft } from "@/contracts/Nft";
import { Address, fromNano, toNano } from "@ton/core";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { sender } from "@/lib/wallet";
import { tonClient } from "@/contracts/connection";
import uploadImage from "@/supabase/uploadFile";

interface baseSideEffects {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
  onSettled?: (data: unknown, error: unknown) => void;
}

const productNftAddress = Address.parse(
  "EQDbqRuKhJzVePg-iEuIaz027J9esBL5v4mGT5gCV2MxO_VV"
);

const productNftContract = tonClient.open(
  ProductNft.fromAddress(productNftAddress)
);

export function useInventory() {
  const queryClient = useQueryClient();
  const { authedUser } = useAuthedUser();
  const [tonConnectUI] = useTonConnectUI();

  const fetchInventory = async (): Promise<Product[] | null> => {
    if (!authedUser) throw new Error("Not authenticated!");

    if (!tonClient.isContractDeployed(productNftAddress)) {
      console.error("ProductNft Contract is not deployed");
      throw new Error("Unable to list products!");
    }

    const productAddresses = await productNftContract.getGetNftAddresses();

    const products: Product[] = [];
    for (const productAddress of productAddresses.values()) {
      const nftContract = tonClient.open(Nft.fromAddress(productAddress));

      const summary = await nftContract.getSummary();

      const product: Product = {
        id: productAddress.toString(),
        name: summary.productName,
        images: [summary.descriptionImageUrl],
        description: summary.productDescription,
        location: summary.productLocation,
        pricePerHour: Number(fromNano(summary.productHourPrice)),
        cautionPrice: Number(fromNano(summary.productStake)),
        owner: summary.owner.toString(),
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

      const productNftContract = tonClient.open(
        ProductNft.fromAddress(productNftAddress)
      );

      // Upload Images
      const images: string[] = [];
      for (const file of product.imagesFiles) {
        try {
          const { publicUrl } = await uploadImage(authedUser.walletAddress, file);
          images.push(publicUrl);
        } catch (error) {
          console.log("Error uploading image : ", error);
        }
      }

      const result = await productNftContract.send(
        sender(tonConnectUI),
        {
          value: toNano("0.05"),
        },
        {
          $$type: "InitNft",
          owner: Address.parse(authedUser.walletAddress),
          productStake: toNano(product.cautionPrice),
          productHourPrice: toNano(product.pricePerHour),
          productDescription: product.description || "This is a product.",
          productName: product.name,
          productLocation: product.location || "Unknown",
          descriptionImageUrl: images.length > 0 ? images[0] : "",
        }
      );

      console.log(result);
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
      // await updateProductInSupabase(productId, updates);
      console.log(updates);

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
