"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Product } from "@/types/product";
import { Loader2, X } from "lucide-react";

type ProductFormProps = {
  product?: Product;
  onSubmit: (product: Omit<Product, "owner"> & { imagesFiles: File[] }) => void;
  onCancel: () => void;
	isSubmitting: boolean;
};

export function ProductForm({ product, onSubmit, onCancel, isSubmitting }: ProductFormProps) {
  const [name, setName] = useState(product?.name || "");
  const [location, setLocation] = useState(product?.location || "");
  const [description, setDescription] = useState(product?.description || "");
  const [pricePerHour, setPricePerHour] = useState(
    product?.pricePerHour.toString() || ""
  );
  const [cautionPrice, setCautionPrice] = useState(
    product?.cautionPrice.toString() || ""
  );
  const [images, setImages] = useState<string[]>(product?.images || []);
	const [imagesFiles, setImagesFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: product?.id || "",
      name,
      description,
      images: images.filter(x => !x.includes("blob")),
      pricePerHour: parseFloat(pricePerHour),
      cautionPrice: parseFloat(cautionPrice),
			imagesFiles,
      location
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
			setImagesFiles([...imagesFiles, ...Array.from(files)]);

      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setImages([...images, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
		setImagesFiles(imagesFiles.filter((_, i) => i !== index));
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
          <Label htmlFor="location" className="text-right">
            Location
          </Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
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
          <Label htmlFor="images" className="text-right">
            Images
          </Label>
          <div className="col-span-3">
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              ref={fileInputRef}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload Images (50MB max)
            </Button>
          </div>
        </div>
        {images.length > 0 && (
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1"></div>
            <div className="col-span-3 grid grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
					{isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {product ? "Save changes" : "Add product"}
        </Button>
      </DialogFooter>
    </form>
  );
}
