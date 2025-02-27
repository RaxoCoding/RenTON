"use client";

import { useState } from "react";
import { Plus, Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Product } from "@/types/product";
import Link from "next/link";
import InventoryPageSkeleton from "./loading";
import { useInventory } from "@/hooks/useInventory";
import Image from "next/image";
import { ProductForm } from "@/components/specific/ProductForm";
import { toast } from "sonner";

export default function InventoryPage() {
  const { products, isLoading, addToInventory, isAddingToInventory, updateProduct, isUpdatingProduct } = useInventory();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddProduct = (
    newProduct: Omit<Product, "id" | "owner"> & { imagesFiles: File[] }
  ) => {
    addToInventory({
      product: {
        name: newProduct.name,
        images: newProduct.images,
        description: newProduct.description,
        pricePerHour: newProduct.pricePerHour,
        cautionPrice: newProduct.cautionPrice,
        imagesFiles: newProduct.imagesFiles,
        location: newProduct.location
      },
      onSuccess() {
        setIsDialogOpen(false);
        toast.success("Product updated!");
      },
      onError() {
        toast.error("Error when adding product!");
      }
    });
  };

  const handleEditProduct = (
    updatedProduct: Omit<Product, "owner"> & { imagesFiles: File[] }
  ) => {
    updateProduct(
      { productId: updatedProduct.id, updates: updatedProduct },
      {
        onSuccess() {
          setEditingProduct(null);
          setIsDialogOpen(false);
          toast.success("Product updated!");
        },
        onError() {
          toast.error("Error when updating product!");
        }
      }
    );
  };

  if (!products || isLoading) {
    return <InventoryPageSkeleton />;
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Inventory</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <ProductForm
              onSubmit={handleAddProduct}
              onCancel={() => setIsDialogOpen(false)}
              isSubmitting={isAddingToInventory}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product: Product) => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
              <div className="relative aspect-square mb-4">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill={true}
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4 truncate">
                {product.description || "No description"}
              </p>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Price per hour</TableCell>
                    <TableCell className="text-right">
                      {product.pricePerHour} TON/hour
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Caution price</TableCell>
                    <TableCell className="text-right">
                      {product.cautionPrice} TON
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href={"/products/" + product.id}>
                <Button variant="outline">
                  <Eye className="mr-2 h-4 w-4" /> View Page
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => {
                  setEditingProduct(product);
                  setIsDialogOpen(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <Dialog
        open={isDialogOpen && editingProduct !== null}
        onOpenChange={setIsDialogOpen}
      >
        <DialogContent>
          {editingProduct && (
            <ProductForm
              product={editingProduct}
              onSubmit={handleEditProduct}
              onCancel={() => {
                setEditingProduct(null);
                setIsDialogOpen(false);
              }}
              isSubmitting={isUpdatingProduct}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
