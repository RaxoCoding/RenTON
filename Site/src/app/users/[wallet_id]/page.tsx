import { notFound } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StarIcon } from "lucide-react"
import { User } from "@/types/user"

// This is a mock function. In a real app, you'd fetch this data from your API
async function getUserByWalletId(walletId: string): Promise<User | null> {
  // Simulating an API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock user data
  const user: User = {
    id: "123e4567-e89b-12d3-a456-426614174000",
    username: "bikeLover2023",
    walletId: walletId,
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 4.5,
  }
  
  return user
}

// Mock function to get past rentals
async function getPastRentals(userId: string) {
  // Simulating an API call or blockchain query
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return [
    { id: "1", bikeName: "Mountain Explorer", date: "2023-05-15" },
    { id: "2", bikeName: "City Cruiser", date: "2023-06-02" },
    { id: "3", bikeName: "Electric Speedster", date: "2023-06-20" },
  ]
}

// Mock function to get current rental status
async function getCurrentRentalStatus(userId: string) {
  // Simulating an API call or blockchain query
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return {
    isRenting: true,
    bikeName: "Urban Commuter",
    startDate: "2023-07-01",
    isLending: false,
  }
}

export default async function UserProfile({ params }: { params: { wallet_id: string } }) {
  const user = await getUserByWalletId(params.wallet_id)
  
  if (!user) {
    notFound()
  }
  
  const pastRentals = await getPastRentals(user.id)
  const currentStatus = await getCurrentRentalStatus(user.id)

  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{user.username}</CardTitle>
            <CardDescription>Wallet ID: {user.walletId}</CardDescription>
            <div className="flex items-center mt-2">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(user.rating) ? "text-yellow-400" : "text-gray-300"
                  }`}
                  fill={i < Math.floor(user.rating) ? "currentColor" : "none"}
                />
              ))}
              <span className="ml-2 text-sm text-gray-600">{user.rating.toFixed(1)}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="status" className="mt-6">
            <TabsList>
              <TabsTrigger value="status">Current Status</TabsTrigger>
              <TabsTrigger value="history">Rental History</TabsTrigger>
            </TabsList>
            <TabsContent value="status">
              <Card>
                <CardHeader>
                  <CardTitle>Current Rental Status</CardTitle>
                </CardHeader>
                <CardContent>
                  {currentStatus.isRenting ? (
                    <div>
                      <Badge className="mb-2">Currently Renting</Badge>
                      <p>Bike: {currentStatus.bikeName}</p>
                      <p>Since: {currentStatus.startDate}</p>
                    </div>
                  ) : currentStatus.isLending ? (
                    <div>
                      <Badge className="mb-2">Bike Available for Rent</Badge>
                      <p>You have a bike available for others to rent.</p>
                    </div>
                  ) : (
                    <p>No active rentals or lendings at the moment.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Past Rentals</CardTitle>
                </CardHeader>
                <CardContent>
                  {pastRentals.length > 0 ? (
                    <ul className="space-y-2">
                      {pastRentals.map((rental) => (
                        <li key={rental.id} className="flex justify-between items-center">
                          <span>{rental.bikeName}</span>
                          <span className="text-sm text-gray-500">{rental.date}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No past rentals found.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}