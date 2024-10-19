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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Product } from "@/types/product";
import Link from "next/link";
import InventoryPageSkeleton from "./loading";
import { useInventory } from "@/hooks/useInventory";
import Image from "next/image";

export default function InventoryPage() {
  const { products, isLoading, addToInventory, updateProduct } = useInventory();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddProduct = (newProduct: Omit<Product, "id" | "owner">) => {
    addToInventory({ product: newProduct });
    setIsDialogOpen(false);
  };

  const handleEditProduct = (updatedProduct: Product) => {
    updateProduct({ productId: updatedProduct.id, updates: updatedProduct });
    setEditingProduct(null);
    setIsDialogOpen(false);
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
                      ${product.pricePerHour}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Caution price</TableCell>
                    <TableCell className="text-right">
                      ${product.cautionPrice}
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
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

type ProductFormProps = {
  product?: Product;
  onSubmit: (product: Product) => void;
  onCancel: () => void;
};

function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [pricePerHour, setPricePerHour] = useState(
    product?.pricePerHour.toString() || ""
  );
  const [cautionPrice, setCautionPrice] = useState(
    product?.cautionPrice.toString() || ""
  );
  const [imageUrl, setImageUrl] = useState(product?.images[0] || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: product?.id || "",
      owner: product?.owner || "",
      name,
      description,
      images: [imageUrl],
      pricePerHour: parseFloat(pricePerHour),
      cautionPrice: parseFloat(cautionPrice),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>
          {product ? "Edit Product" : "Add New Product"}
        </DialogTitle>
        <DialogDescription>
          {product
            ? "Make changes to your product here."
            : "Add the details of your new product here."}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            Description
          </Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="pricePerHour" className="text-right">
            Price per hour
          </Label>
          <Input
            id="pricePerHour"
            type="number"
            value={pricePerHour}
            onChange={(e) => setPricePerHour(e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="cautionPrice" className="text-right">
            Caution price
          </Label>
          <Input
            id="cautionPrice"
            type="number"
            value={cautionPrice}
            onChange={(e) => setCautionPrice(e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="imageUrl" className="text-right">
            Image URL
          </Label>
          <Input
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="col-span-3"
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {product ? "Save changes" : "Add product"}
        </Button>
      </DialogFooter>
    </form>
  );
}
