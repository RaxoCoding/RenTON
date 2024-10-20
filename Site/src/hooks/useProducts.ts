"use client";

import { Nft } from "@/contracts/Nft";
import { ProductNft } from "@/contracts/ProductNft";
import { Product } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import { Address, fromNano } from "ton-core";

const productNftContract = new ProductNft(
  "EQDbqRuKhJzVePg-iEuIaz027J9esBL5v4mGT5gCV2MxO_VV"
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
        pricePerHour: parseInt(fromNano(summary.productHourPrice.toString())),
        cautionPrice: parseInt(fromNano(summary.productStake.toString())),
        owner: Address.parse(summary.owner.toString()).toString(),
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
