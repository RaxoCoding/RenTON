"use client";

import { Nft } from "@/contracts/Nft";
import { ProductNft } from "@/contracts/ProductNft";
import { Product } from "@/types/product";
import { useQuery } from "@tanstack/react-query";

const productNftContract = new ProductNft(
  "EQA33aTDzwFmBmHA1bJ3vvRfpF4dO-Ke4FoU5xYPZInOdX_p"
);

export function useProducts() {
  const fetchProducts = async (): Promise<Product[] | null> => {
    if (!(productNftContract.isDeployed)) {
      console.error("ProductNft Contract is not deployed");
      throw new Error("Unable to list products!");
    }

    const productAddresses = await productNftContract.getNftAddresses();

    console.log(productAddresses);

    const nftContract = new Nft(productAddresses[0].address);

    console.log(await nftContract.getSummary());

    return [];
  };

  const {
    data: products,
    error,
    isLoading,
  } = useQuery<Product[] | null, Error>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  return {
    products,
    error,
    isLoading: isLoading,
  };
}
