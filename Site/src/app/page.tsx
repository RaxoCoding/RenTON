"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";
import HomePageSkeleton from "./loading";
import { Product } from "@/types/product";

export default function Home() {
  const { products, isLoading } = useProducts();
  const [filters, setFilters] = useState({
    name: "",
    owner: "",
    maxPricePerHour: "",
    maxCautionPrice: "",
  });
  const [currentPage, setCurrentPage] = useState(1);

  if (isLoading || !products) {
    return <HomePageSkeleton />;
  }

  const itemsPerPage = 10;

  const filteredProducts = products.filter((product: Product) => {
    return (
      product.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      product.owner.toLowerCase().includes(filters.owner.toLowerCase()) &&
      (filters.maxPricePerHour === "" ||
        product.pricePerHour <= parseFloat(filters.maxPricePerHour)) &&
      (filters.maxCautionPrice === "" ||
        product.cautionPrice <= parseFloat(filters.maxCautionPrice))
    );
  });

  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setCurrentPage(1);
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex flex-col sm:gap-4 px-8">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-8">Rent a Bike</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <Label htmlFor="name">Bike Name</Label>
              <Input
                id="name"
                name="name"
                value={filters.name}
                onChange={handleFilterChange}
                placeholder="Filter by name"
              />
            </div>
            <div>
              <Label htmlFor="owner">Owner</Label>
              <Input
                id="owner"
                name="owner"
                value={filters.owner}
                onChange={handleFilterChange}
                placeholder="Filter by owner"
              />
            </div>
            <div>
              <Label htmlFor="maxPricePerHour">Max Price per Hour</Label>
              <Input
                id="maxPricePerHour"
                name="maxPricePerHour"
                type="number"
                value={filters.maxPricePerHour}
                onChange={handleFilterChange}
                placeholder="Max price per hour"
              />
            </div>
            <div>
              <Label htmlFor="maxCautionPrice">Max Caution Price</Label>
              <Input
                id="maxCautionPrice"
                name="maxCautionPrice"
                type="number"
                value={filters.maxCautionPrice}
                onChange={handleFilterChange}
                placeholder="Max caution price"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
            {paginatedProducts.map((product: Product) => (
              <Link href={"/products/" + product.id} key={product.id}>
                <Card className="overflow-hidden">
                  <CardHeader className="p-0">
                    <div
                      className="relative w-full"
                      style={{ paddingBottom: "100%" }}
                    >
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-2">
                    <CardTitle className="text-sm font-medium mb-1">
                      {product.name}
                    </CardTitle>
                    <div className="flex flex-col gap-1">
                      <Badge variant="secondary" className="text-xs w-fit">
                        ${product.pricePerHour.toFixed(2)} / hour
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Caution: ${product.cautionPrice.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Owner: {product.owner}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {pageCount > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="self-center">
                Page {currentPage} of {pageCount}
              </span>
              <Button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, pageCount))
                }
                disabled={currentPage === pageCount}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
