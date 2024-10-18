export type Product = {
  id: string, // UUID
	name: string,
	images?: string[],
	pricePerHour: number,
	cautionPrice: number,
	owner: string,
	description?: string,
};
