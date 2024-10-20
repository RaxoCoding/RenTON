"use client";

import { useQuery } from "@tanstack/react-query";
import { getProductById } from "@/supabase/productsQuery";
import { FullProduct, Product } from "@/types/product";
import { Address, fromNano } from "ton-core";
import { Nft } from "@/contracts/Nft";
import { User } from "@/types/user";
import { supabase } from "@/lib/supabaseClient";

// const productMock = {
// 	id: '123',
// 	name: "Mountain Explorer Pro",
// 	images: ["/bike.jpg", "/bike.jpg"],
// 	pricePerHour: 15,
// 	cautionPrice: 250,
// 	owner: {
// 		id: "owner123",
// 		username: "bikeEnthusiast",
// 		avatar: "/placeholder.svg?height=50&width=50",
// 		rating: 4.7,
// 		telegramHandle: "@bikeEnthusiast",
// 		walletAddress: "0:123",
// 	},
// 	description:
// 		"A high-performance mountain bike perfect for rough terrains and adventurous trails. Features 21-speed gears, front suspension, and durable tires.",
// };

export function useProduct(productAddress: string) {
  const fetchUser = async (walletAddress: string): Promise<User | null> => {
    const { data, error } = await supabase
      .from("users")
      .select("id, username, walletAddress, avatar, rating, telegramHandle")
      .eq("walletAddress", walletAddress)
      .single();

    if (error) throw error;

    return data;
  };

  const fetchProduct = async (): Promise<FullProduct | null> => {
    const nftContract = new Nft(productAddress);

    const summary = await nftContract.getSummary();

    const ownerAddress = Address.parse(summary.owner.toString()).toRawString();

    const owner = await fetchUser(ownerAddress);

    const product: FullProduct = {
      id: productAddress,
      name: summary.productName.toString(),
      images: [summary.descriptionImageUrl.toString()],
      description: summary.productDescription.toString(),
      location: summary.productLocation.toString(),
      pricePerHour: parseInt(fromNano(summary.productHourPrice.toString())),
      cautionPrice: parseInt(fromNano(summary.productStake.toString())),
      owner: {
        id: owner?.id || "0",
        username: owner?.username || "Not Found",
        walletAddress: ownerAddress,
        avatar: owner?.avatar || null,
        rating: owner?.rating || null,
        telegramHandle: owner?.telegramHandle || "@notfound"
      },
    };

    return product;
  };

  const {
    data: product,
    error,
    isLoading,
  } = useQuery<FullProduct | null, Error>({
    queryKey: ["product", productAddress],
    queryFn: fetchProduct,
  });

  return {
    product,
    error,
    isLoading: isLoading,
  };
}
