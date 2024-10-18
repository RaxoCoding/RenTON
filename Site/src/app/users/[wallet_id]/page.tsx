"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StarIcon } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import UserProfileSkeleton from "./loading";

export default async function UserProfile({
  params,
}: {
  params: { wallet_id: string };
}) {
  const { user, isLoading } = useUser(params.wallet_id);

  if (isLoading || !user) {
    return <UserProfileSkeleton />;
  }

  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar || ""} alt={user.username} />
            <AvatarFallback>
              {user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{user.username}</CardTitle>
            <CardDescription>Wallet ID: {user.walletAddress}</CardDescription>
            <div className="flex items-center mt-2">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(user.rating || 0)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  fill={
                    i < Math.floor(user.rating || 0) ? "currentColor" : "none"
                  }
                />
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {(user.rating || 0).toFixed(1)}
              </span>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
