"use client"

import { useState } from "react"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { StarIcon, MessageCircle, ChevronLeft, ChevronRight, X } from "lucide-react"
import { useProduct } from "@/hooks/useProduct"
import ProductPageSkeleton from "./loading"

export default function ProductPage({ params }: { params: { product_id: string } }) {
  const { product } = useProduct(params.product_id);
  const [mainImage, setMainImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(0);
  
  if (!product) {
    return <ProductPageSkeleton />
  }

  const openModal = (index: number) => {
    setModalImage(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextImage = () => {
    setModalImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setModalImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="container mx-auto">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div 
            className="relative aspect-video mb-4 cursor-pointer"
            onClick={() => openModal(mainImage)}
          >
            <Image
              src={product.images[mainImage]}
              alt={product.name}
              fill
              className="rounded-lg object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((img: string, index: number) => (
              <div 
                key={index} 
                className="relative aspect-square cursor-pointer"
                onClick={() => {
                  setMainImage(index);
                }}
              >
                <Image
                  src={img}
                  alt={`${product.name} - view ${index + 1}`}
                  fill
                  className={`rounded-md object-cover ${index === mainImage ? 'ring-2 ring-primary' : ''}`}
                />
              </div>
            ))}
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center mb-4">
            <Badge variant="secondary" className="mr-2">
              {product.pricePerHour}/hour
            </Badge>
            <Badge variant="outline">
              {product.cautionPrice} caution
            </Badge>
          </div>
          <p className="text-muted-foreground mb-4">{product.description}</p>
          <Card>
            <CardHeader>
              <CardTitle>Owner</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center">
              <Avatar className="h-12 w-12 mr-4">
                <AvatarImage src={product.owner.avatar || undefined } alt={product.owner.username} />
                <AvatarFallback>{product.owner.username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{product.owner.username}</h3>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-4 w-4 ${
                        product.owner.rating && i < Math.floor(product.owner.rating) ? "text-yellow-400" : "text-gray-300"
                      }`}
                      fill={product.owner.rating && i < Math.floor(product.owner.rating) ? "currentColor" : "none"}
                    />
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">{product.owner.rating ? product.owner.rating.toFixed(1) : "No Ratings"}</span>
                </div>
              </div>
            </CardContent>
            {product.owner.telegramHandle && (
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Contact via Telegram
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
      <Separator className="my-8" />
      <div className="mt-8 text-center">
        <Button size="lg">
          Rent This Product
        </Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[90vw] h-[90vh] p-0">
          <div className="relative w-full h-full">
            <Image
              src={product.images[modalImage]}
              alt={`${product.name} - view ${modalImage + 1}`}
              fill
              className="object-contain"
            />
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 rounded-full"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}