import { User } from "./user";

export type Product = {
  id: string; // UUID
  name: string;
  images: string[];
  pricePerHour: number;
  cautionPrice: number;
  owner: string;
  description: string | null;
  location: string | null;
};

type FullProduct = Omit<Product, "owner"> & { owner: User };

export type { FullProduct };
