"use client";

import { Nft } from "@/contracts/Nft";
import { ProductNft } from "@/contracts/ProductNft";
import { Product } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import { fromNano } from "ton-core";

const productNftContract = new ProductNft(
  "EQDLbOP7Jxg4CV3GaMPglrHUn1fsecD7trwTSOZwTPf2o9Ug"
);

export function useProducts() {
  
  const fetchProducts = async (): Promise<Product[] | null> => {
    if (!(productNftContract.isDeployed)) {
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
        pricePerHour: parseInt(fromNano(summary.productValue.toString())),
        cautionPrice: parseInt(fromNano(summary.productValue.toString())),
        owner: summary.owner.toString(),
      }

      products.push(product);
    }

    return products;
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
