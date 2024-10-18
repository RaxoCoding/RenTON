import { notFound } from "next/navigation"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { StarIcon, MessageCircle, Clock, Calendar } from "lucide-react"

// This is a mock function. In a real app, you'd fetch this data from your API or blockchain
async function getBikeDetails(id: string) {
  // Simulating an API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock bike data
  return {
    id,
    name: "Mountain Explorer Pro",
    images: ["/bike.jpg", "/bike.jpg"],
    pricePerHour: 15,
    cautionPrice: 250,
    owner: {
      id: "owner123",
      username: "bikeEnthusiast",
      avatar: "/placeholder.svg?height=50&width=50",
      rating: 4.7,
      telegramHandle: "@bikeEnthusiast"
    },
    description: "A high-performance mountain bike perfect for rough terrains and adventurous trails. Features 21-speed gears, front suspension, and durable tires.",
    features: ["21-speed gears", "Front suspension", "Disc brakes", "29-inch wheels"],
    rentalHistory: [
      { id: "rent1", renter: "Alex", date: "2023-06-15", duration: "3 hours" },
      { id: "rent2", renter: "Sam", date: "2023-06-20", duration: "5 hours" },
      { id: "rent3", renter: "Jordan", date: "2023-06-25", duration: "2 hours" },
    ]
  }
}

export default async function BikePage({ params }: { params: { bike_id: string } }) {
  const bike = await getBikeDetails(params.bike_id)
  
  if (!bike) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="relative aspect-video mb-4">
            <Image
              src={bike.images[0]}
              alt={bike.name}
              fill
              className="rounded-lg object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {bike.images.map((img, index) => (
              <div key={index} className="relative aspect-square">
                <Image
                  src={img}
                  alt={`${bike.name} - view ${index + 1}`}
                  fill
                  className="rounded-md object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{bike.name}</h1>
          <div className="flex items-center mb-4">
            <Badge variant="secondary" className="mr-2">
              ${bike.pricePerHour}/hour
            </Badge>
            <Badge variant="outline">
              ${bike.cautionPrice} caution
            </Badge>
          </div>
          <p className="text-muted-foreground mb-4">{bike.description}</p>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5">
                {bike.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Owner</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center">
              <Avatar className="h-12 w-12 mr-4">
                <AvatarImage src={bike.owner.avatar} alt={bike.owner.username} />
                <AvatarFallback>{bike.owner.username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{bike.owner.username}</h3>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(bike.owner.rating) ? "text-yellow-400" : "text-gray-300"
                      }`}
                      fill={i < Math.floor(bike.owner.rating) ? "currentColor" : "none"}
                    />
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">{bike.owner.rating.toFixed(1)}</span>
                </div>
              </div>
            </CardContent>
            {bike.owner.telegramHandle && (
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
      <Card>
        <CardHeader>
          <CardTitle>Rental History</CardTitle>
          <CardDescription>Recent rentals of this bike</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {bike.rentalHistory.map((rental) => (
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
      </Card>
      <div className="mt-8 text-center">
        <Button size="lg">
          Rent This Bike
        </Button>
      </div>
    </div>
  )
}