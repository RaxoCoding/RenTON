import { useQuery } from "@tanstack/react-query";
import { getProductById } from "@/supabase/productsQuery";
import { FullProduct } from "@/types/product";



const productMock = {
	id: '123',
	name: "Mountain Explorer Pro",
	images: ["/bike.jpg", "/bike.jpg"],
	pricePerHour: 15,
	cautionPrice: 250,
	owner: {
		id: "owner123",
		username: "bikeEnthusiast",
		avatar: "/placeholder.svg?height=50&width=50",
		rating: 4.7,
		telegramHandle: "@bikeEnthusiast",
		walletAddress: "0:123",
	},
	description:
		"A high-performance mountain bike perfect for rough terrains and adventurous trails. Features 21-speed gears, front suspension, and durable tires.",
};

export function useProduct(productId: string) {
  // const fetchProduct = async (): Promise<FullProduct | null> => {
  //   return productMock;
  // };

  const {
    data: product,
    error,
    isLoading,
  } = useQuery<FullProduct | null, Error>({
    queryKey: ["product", productId],
  queryFn: () => getProductById(productId),
  });

  return {
    product,
    error,
    isLoading: isLoading,
  };
}

