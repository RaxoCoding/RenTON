import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardHeader } from "@/components/ui/card"

export default function UserProfileSkeleton() {
  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
            <div className="flex items-center mt-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-5 w-5 rounded-full mr-1" />
              ))}
              <Skeleton className="h-4 w-8 ml-2" />
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  )
}