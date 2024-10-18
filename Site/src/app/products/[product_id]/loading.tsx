import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function ProductPageSkeleton() {
  return (
    <div className="container mx-auto">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Skeleton className="aspect-video w-full mb-4 rounded-lg" />
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, index) => (
              <Skeleton key={index} className="aspect-square w-full rounded-md" />
            ))}
          </div>
        </div>
        <div>
          <Skeleton className="h-10 w-3/4 mb-2" />
          <div className="flex items-center mb-4">
            <Skeleton className="h-6 w-24 mr-2" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-20 w-full mb-4" />
          <Card className="mb-6">
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {[...Array(4)].map((_, index) => (
                  <li key={index}>
                    <Skeleton className="h-4 w-full" />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-16" />
            </CardHeader>
            <CardContent className="flex items-center">
              <Skeleton className="h-12 w-12 rounded-full mr-4" />
              <div className="flex-1">
                <Skeleton className="h-5 w-32 mb-2" />
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-4 w-4 mr-1" />
                  ))}
                  <Skeleton className="h-4 w-8 ml-2" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        </div>
      </div>
      <Separator className="my-8" />
      <div className="mt-8 text-center">
        <Skeleton className="h-12 w-40 mx-auto" />
      </div>
    </div>
  )
}