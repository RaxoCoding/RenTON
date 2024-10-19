import { Skeleton } from "@/components/ui/skeleton"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function SettingsPageSkeleton() {
  return (
    <div className="container mx-auto py-10">
      <Skeleton className="h-9 w-48 mb-6" />
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <form>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>
                    <Skeleton className="h-4 w-20" />
                  </Label>
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Label>
                    <Skeleton className="h-4 w-32" />
                  </Label>
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <Skeleton className="h-10 w-32 mt-4" />
            </form>
          </CardContent>
        </Card>

        <Separator />

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-36 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-40" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}