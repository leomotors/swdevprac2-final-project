"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation, useQuery } from "@/libs/api";
import type { components } from "@/libs/api/schema";
import { getError } from "@/libs/utils";

type UpdateExhibitionForm = components["schemas"]["UpdateExhibitionRequest"] & {
  startDate: string;
};

export default function ExhibitionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();

  const exhibitionId = params.id as string;

  const {
    data: exhibitionData,
    isLoading: isLoadingExhibition,
    refetch,
  } = useQuery("get", "/exhibitions/{id}", {
    params: {
      path: { id: exhibitionId },
    },
  });

  const updateMutation = useMutation("put", "/exhibitions/{id}");
  const deleteMutation = useMutation("delete", "/exhibitions/{id}");

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editExhibition, setEditExhibition] =
    useState<UpdateExhibitionForm | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const isLoading = isAuthLoading || isLoadingExhibition;

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-xl text-gray-500">Loading...</div>
      </main>
    );
  }

  if (!exhibitionData?.success || !exhibitionData?.data) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-red-600">Not Found</h1>
          <p className="text-lg text-gray-700">Exhibition not found.</p>
          <Button
            className="mt-4 bg-[#FF69B4] hover:bg-pink-600"
            onClick={() => router.push("/exhibitions")}
          >
            Back to Exhibitions
          </Button>
        </div>
      </main>
    );
  }

  const exhibition = exhibitionData.data;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const startDate = new Date(exhibition.startDate);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + exhibition.durationDay);

  const handleOpenEditDialog = () => {
    setEditExhibition({
      ...exhibition,
      startDate: exhibition.startDate.split("T")[0],
    });
    setMessage(null);
    setIsEditDialogOpen(true);
  };

  const handleUpdateExhibition = async () => {
    if (!editExhibition) return;

    try {
      const result = await updateMutation.mutateAsync({
        params: {
          path: { id: exhibitionId },
        },
        body: {
          ...editExhibition,
          durationDay: editExhibition.durationDay
            ? Number(editExhibition.durationDay)
            : undefined,
        },
      });

      if (result?.success) {
        setMessage("Exhibition updated successfully!");
        setIsEditDialogOpen(false);
        refetch();
      } else {
        setMessage("Failed to update exhibition. Please try again.");
      }
    } catch (error: unknown) {
      setMessage(getError(error));
    }
  };

  const handleDeleteExhibition = async () => {
    try {
      await deleteMutation.mutateAsync({
        params: {
          path: { id: exhibitionId },
        },
      });

      router.push("/exhibitions");
    } catch {
      setMessage("Failed to delete exhibition. Please try again.");
      setIsDeleteDialogOpen(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (!editExhibition) return;

    const { name, value } = e.target;
    setEditExhibition({ ...editExhibition, [name]: value });
  };

  return (
    <main className="min-h-screen p-4 py-12 sm:p-8 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => router.push("/exhibitions")}
          className="mb-4 text-gray-600 hover:text-pink-600 sm:mb-6"
        >
          ← Back to Exhibitions
        </Button>

        <Card className="overflow-hidden border-gray-200 bg-white/60 backdrop-blur-sm">
          <div className="relative h-48 w-full sm:h-64">
            <Image
              src={exhibition.posterPicture || "/placeholder.png"}
              alt={exhibition.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4 sm:p-8">
              <h1 className="text-3xl font-bold text-white shadow-lg sm:text-4xl">
                {exhibition.name}
              </h1>
            </div>
          </div>

          <CardContent className="space-y-6 p-4 sm:p-6 md:p-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-500">Description</h3>
                <p className="text-gray-800">{exhibition.description}</p>
              </div>
              <div className="space-y-4 rounded-lg bg-gray-50 p-4">
                <p className="flex items-center gap-2 text-gray-700">
                  <span className="font-semibold">📍 Venue:</span>
                  <span>{exhibition.venue}</span>
                </p>
                <p className="flex items-center gap-2 text-gray-700">
                  <span className="font-semibold">📅 Dates:</span>
                  <span>
                    {formatDate(exhibition.startDate)} -{" "}
                    {formatDate(endDate.toISOString())}
                  </span>
                </p>
                <p className="flex items-center gap-2 text-gray-700">
                  <span className="font-semibold">⏰ Duration:</span>
                  <span>{exhibition.durationDay} days</span>
                </p>
              </div>
            </div>

            {message && !isEditDialogOpen && (
              <div
                className={`rounded-lg border p-4 ${
                  message.includes("success")
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                <p>{message}</p>
              </div>
            )}

            {/* Action Buttons */}
            {isAuthenticated &&
              (user?.role === "admin" ? (
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button
                    onClick={handleOpenEditDialog}
                    className="flex-1 bg-pink-400 text-white hover:bg-pink-600"
                    disabled={updateMutation.isPending}
                  >
                    Edit Exhibition
                  </Button>
                  <Button
                    onClick={() => setIsDeleteDialogOpen(true)}
                    variant="destructive"
                    className="bg-white-400 flex-1 text-pink-400 hover:bg-gray-200"
                    disabled={deleteMutation.isPending}
                  >
                    Delete Exhibition
                  </Button>
                </div>
              ) : (
                <Link href={`/boothBook?exhibitionId=${exhibitionId}`}>
                  <Button className="w-full bg-[#FF69B4] text-white shadow-lg shadow-pink-400/50 hover:bg-pink-600">
                    Book a Booth
                  </Button>
                </Link>
              ))}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        {editExhibition && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Edit Exhibition</DialogTitle>
                <DialogDescription>
                  Update the details of the exhibition.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {message && isEditDialogOpen && (
                  <div
                    className={`rounded-lg border p-3 ${
                      message.includes("success")
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-red-200 bg-red-50 text-red-700"
                    }`}
                  >
                    <p className="text-sm">{message}</p>
                  </div>
                )}
                <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-4 sm:gap-4">
                  <Label htmlFor="name" className="sm:text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={editExhibition.name}
                    onChange={handleInputChange}
                    className="sm:col-span-3"
                  />
                </div>
                <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-4 sm:gap-4">
                  <Label htmlFor="description" className="sm:text-right">
                    Description
                  </Label>
                  <textarea
                    id="description"
                    name="description"
                    value={editExhibition.description}
                    onChange={handleInputChange}
                    className="sm:col-span-3"
                  />
                </div>
                <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-4 sm:gap-4">
                  <Label htmlFor="venue" className="sm:text-right">
                    Venue
                  </Label>
                  <Input
                    id="venue"
                    name="venue"
                    value={editExhibition.venue}
                    onChange={handleInputChange}
                    className="sm:col-span-3"
                  />
                </div>
                <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-4 sm:gap-4">
                  <Label htmlFor="startDate" className="sm:text-right">
                    Start Date
                  </Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={editExhibition.startDate}
                    onChange={handleInputChange}
                    className="sm:col-span-3"
                  />
                </div>
                <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-4 sm:gap-4">
                  <Label htmlFor="durationDay" className="sm:text-right">
                    Duration
                  </Label>
                  <div className="flex items-center gap-2 sm:col-span-3">
                    <Input
                      id="durationDay"
                      name="durationDay"
                      type="number"
                      min="1"
                      value={editExhibition.durationDay}
                      onChange={handleInputChange}
                      className="w-24"
                    />
                    <span>days</span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateExhibition}
                  disabled={updateMutation.isPending}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  {updateMutation.isPending ? "Updating..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                exhibition &quot;{exhibition.name}&quot; and all associated
                bookings.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteExhibition}
                disabled={deleteMutation.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </main>
  );
}
