"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useAuthedUser } from "@/hooks/useAuthedUser";
import SettingsPageSkeleton from "./loading";

export default function SettingsPage() {
	const { authedUser, updateUser, isUpdatingUser, deleteUser, isDeletingUser } = useAuthedUser();
  const [username, setUsername] = useState<string>("");
  const [telegramHandle, setTelegramHandle] = useState<string>("");

	useEffect(() => {
		if(authedUser) {
			setUsername(authedUser.username);
			setTelegramHandle(authedUser.telegramHandle);
		}
	}, [authedUser])

	if (!authedUser) {
		return <SettingsPageSkeleton />
	}

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

		updateUser({
      updates: { username, telegramHandle },
      onSuccess: () => toast.success("Your profile has been successfully updated."),
      onError: () => toast.error(
        "There was an error updating your profile. Please try again."
      ),
    });
  };

  const handleDeleteAccount = async () => {
		deleteUser({
      onSuccess: () => toast.success("Your account has been successfully deleted."),
      onError: () => toast.error(
        "There was an error deleting your account. Please try again."
      ),
    });
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">User Settings</h1>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your account settings here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telegramHandle">Telegram Handle</Label>
                  <Input
                    id="telegramHandle"
                    value={telegramHandle || undefined}
                    onChange={(e) => setTelegramHandle(e.target.value)}
                    placeholder="Enter your Telegram handle"
                  />
                </div>
              </div>
              <Button type="submit" className="mt-4" disabled={isUpdatingUser}>
                {isUpdatingUser ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>Delete Account</CardTitle>
            <CardDescription>
              Permanently delete your account and all associated data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove all of your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    disabled={isDeletingUser}
                  >
                    {isDeletingUser ? "Deleting..." : "Yes, delete my account"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
