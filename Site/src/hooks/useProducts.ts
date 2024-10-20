"use client";

import { ProductNft } from "@/contracts/ProductNft";
import { Product } from "@/types/product";
import { useQuery } from "@tanstack/react-query";

const productNftContract = new ProductNft(
  "EQAlEjFKTPjSYrbUzB-0-W-pynVfKMZvetmp7SDRSwIQtRAo"
);

export function useProducts() {
  const fetchProducts = async (): Promise<Product[] | null> => {
    if (!(productNftContract.isDeployed)) {
      console.error("ProductNft Contract is not deployed");
      throw new Error("Unable to list products!");
    }

    const productAddresses = await productNftContract.getNftAddresses();

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
