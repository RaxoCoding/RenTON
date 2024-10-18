"use client"

import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { StarIcon, MessageCircle } from "lucide-react"
import { useProduct } from "@/hooks/useProduct"
import ProductPageSkeleton from "./loading"

export default function ProductPage({ params }: { params: { product_id: string } }) {
  const { product } = useProduct(params.product_id);
  
  if (!product) {
    return <ProductPageSkeleton />
  }

  return (
    <div className="container mx-auto">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="relative aspect-video mb-4">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="rounded-lg object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((img: string, index: number) => (
              <div key={index} className="relative aspect-square">
                <Image
                  src={img}
                  alt={`${product.name} - view ${index + 1}`}
                  fill
                  className="rounded-md object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center mb-4">
            <Badge variant="secondary" className="mr-2">
              ${product.pricePerHour}/hour
            </Badge>
            <Badge variant="outline">
              ${product.cautionPrice} caution
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
      {/* <Card>
        <CardHeader>
          <CardTitle>Rental History</CardTitle>
          <CardDescription>Recent rentals of this product</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {product.rentalHistory.map((rental) => (
              <li key={rental.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarFallback>{rental.renter.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span>{rental.renter}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="mr-4">{rental.date}</span>
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{rental.duration}</span>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card> */}
      <div className="mt-8 text-center">
        <Button size="lg">
          Rent This Product
        </Button>
      </div>
    </div>
  )
}