import { Product } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/supabase/productsQuery";

const productsMock = [
  {
    id: "1",
    name: "Laser Lemonade Machine",
    images: ["/bike.jpg"],
		description: "hello world I descfibre",
    cautionPrice: 499.99,
    pricePerHour: 5.99,
    owner: "1",
  },
  {
    id: "2",
    name: "Hypernova Headphones",
    images: ["/bike.jpg"],
    cautionPrice: 129.99,
    pricePerHour: 5.99,
    owner: "1",
		description: null
  },
  {
    id: "3",
    name: "AeroGlow Desk Lamp",
    images: ["/bike.jpg"],
    cautionPrice: 39.99,
    pricePerHour: 5.99,
    owner: "1",
		description: null
  },
  {
    id: "4",
    name: "TechTonic Energy Drink",
    images: ["/bike.jpg"],
    cautionPrice: 2.99,
    pricePerHour: 5.99,
    owner: "1",
		description: null
  },
  {
    id: "5",
    name: "Gamer Gear Pro Controller",
    images: ["/bike.jpg"],
    cautionPrice: 59.99,
    pricePerHour: 5.99,
    owner: "1",
		description: null
  },
  {
    id: "6",
    name: "Luminous VR Headset",
    images: ["/bike.jpg"],
    cautionPrice: 199.99,
    pricePerHour: 5.99,
    owner: "1",
		description: null
  },
  {
    id: "12",
    name: "Laser Lemonade Machine",
    images: ["/bike.jpg"],
    cautionPrice: 499.99,
    pricePerHour: 5.99,
    owner: "1",
		description: null
  },
  {
    id: "22",
    name: "Hypernova Headphones",
    images: ["/bike.jpg"],
    cautionPrice: 129.99,
    pricePerHour: 5.99,
    owner: "1",
		description: null
  },
  {
    id: "32",
    name: "AeroGlow Desk Lamp",
    images: ["/bike.jpg"],
    cautionPrice: 39.99,
    pricePerHour: 5.99,
    owner: "1",
		description: null
  },
  {
    id: "42",
    name: "TechTonic Energy Drink",
    images: ["/bike.jpg"],
    cautionPrice: 2.99,
    pricePerHour: 5.99,
    owner: "1",
		description: null
  },
  {
    id: "52",
    name: "Gamer Gear Pro Controller",
    images: ["/bike.jpg"],
    cautionPrice: 59.99,
    pricePerHour: 5.99,
    owner: "1",
		description: null
  },
  {
    id: "62",
    name: "Luminous VR Headset",
    images: ["/bike.jpg"],
    cautionPrice: 199.99,
    pricePerHour: 5.99,
    owner: "1",
		description: null
  },
];


export function useProducts() {
  // const fetchProducts = async (): Promise<Product[] | null> => {
  //   return productsMock;
  // };


  const {
    data: products,
    error,
    isLoading,
  } = useQuery<Product[] | null, Error>({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });

  return {
    products,
    error,
    isLoading: isLoading,
  };
}
