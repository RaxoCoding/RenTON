"use client";

import { tonClient } from "@/contracts/connection";
import { Nft } from "@/contracts/Nft";
import { ProductNft } from "@/contracts/ProductNft";
import { Product } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import { Address, fromNano } from "@ton/core";

const productNftAddress = Address.parse(
  "EQDbqRuKhJzVePg-iEuIaz027J9esBL5v4mGT5gCV2MxO_VV"
);

const productNftContract = tonClient.open(
  ProductNft.fromAddress(productNftAddress)
);

export function useProducts() {
  const fetchProducts = async (): Promise<Product[] | null> => {    
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

      products.push(product);
    }

    console.log(products);

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
