"use client";

import Image from "next/image";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();

  const bookingId = params.id as string;

  const { data: bookingData, isLoading: isLoadingBooking } = useQuery(
    "get",
    "/booking/{id}",
    {
      params: {
        path: { id: bookingId },
      },
    },
  );

  const updateMutation = useMutation("put", "/booking/{id}");
  const deleteMutation = useMutation("delete", "/booking/{id}");

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editBoothType, setEditBoothType] = useState<"small" | "big">("small");
  const [editAmount, setEditAmount] = useState<number>(1);
  const [message, setMessage] = useState<string | null>(null);

  if (isAuthLoading || isLoadingBooking) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-xl text-gray-500">Loading...</div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-red-600">Forbidden</h1>
          <p className="text-lg text-gray-700">
            You must be logged in to view this booking.
          </p>
        </div>
      </main>
    );
  }

  if (!bookingData?.success || !bookingData?.data) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-red-600">Not Found</h1>
          <p className="text-lg text-gray-700">Booking not found.</p>
          <Button
            className="mt-4 bg-[#FF69B4] hover:bg-pink-600"
            onClick={() => router.push("/booking")}
          >
            Back to Bookings
          </Button>
        </div>
      </main>
    );
  }

  const booking = bookingData.data;
  const exhibition = booking.exhibition;

  const canEdit =
    user?.role === "admin" || booking.user.email === user?.email || false;

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
    setEditBoothType(booking.boothType);
    setEditAmount(booking.amount);
    setMessage(null);
    setIsEditDialogOpen(true);
  };

  const handleUpdateBooking = async () => {
    try {
      const result = await updateMutation.mutateAsync({
        params: {
          path: { id: bookingId },
        },
        body: {
          boothType: editBoothType,
          amount: editAmount,
        },
      });

      if (result?.success) {
        setMessage("Booking updated successfully!");
        setIsEditDialogOpen(false);
        // Refresh the page data
        window.location.reload();
      } else {
        setMessage("Failed to update booking.");
      }
    } catch {
      setMessage("Failed to update booking. Please try again.");
    }
  };

  const handleDeleteBooking = async () => {
    try {
      await deleteMutation.mutateAsync({
        params: {
          path: { id: bookingId },
        },
      });

      router.push("/booking");
    } catch {
      setMessage("Failed to delete booking. Please try again.");
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <main className="min-h-screen p-8 py-16">
      <div className="mx-auto max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => router.push("/booking")}
          className="mb-6 text-gray-600 hover:text-pink-600"
        >
          ← Back to Bookings
        </Button>

        <Card className="overflow-hidden border-gray-200 bg-white/60 backdrop-blur-sm">
          <CardHeader className="bg-linear-to-r from-pink-100 to-purple-100 px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <CardTitle
                  className="pb-2 text-3xl font-bold"
                  style={{
                    background: "linear-gradient(to right, #1f2937, #4b5563)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    display: "inline-block",
                  }}
                >
                  Booking Details
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Booking ID: {booking._id}
                </p>
              </div>
              <Badge
                className={
                  booking.boothType === "small"
                    ? "bg-pink-500 text-white"
                    : "bg-purple-500 text-white"
                }
              >
                {booking.boothType === "small" ? "Small Booth" : "Big Booth"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 p-8">
            {/* Exhibition Details */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800">
                Exhibition Information
              </h3>
              <div className="rounded-lg bg-gray-50 p-6">
                <div className="flex flex-col gap-6 md:flex-row">
                  {/* Poster Image */}
                  {exhibition.posterPicture && (
                    <div className="relative w-full md:w-1/3">
                      <div className="relative aspect-3/4 w-full">
                        <Image
                          src={exhibition.posterPicture}
                          alt={exhibition.name}
                          fill
                          className="rounded-lg border border-pink-100 object-cover shadow-md"
                        />
                      </div>
                    </div>
                  )}
                  {/* Exhibition Info */}
                  <div className="flex-1">
                    <h4 className="mb-3 text-2xl font-bold text-pink-600">
                      {exhibition.name}
                    </h4>
                    <div className="space-y-2 text-gray-700">
                      <p className="flex items-start gap-2">
                        <span className="font-semibold">Description:</span>
                        <span>{exhibition.description}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="font-semibold">📍 Venue:</span>
                        <span>{exhibition.venue}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="font-semibold">📅 Dates:</span>
                        <span>
                          {formatDate(exhibition.startDate)} -{" "}
                          {formatDate(endDate.toISOString())}
                        </span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="font-semibold">⏰ Duration:</span>
                        <span>{exhibition.durationDay} days</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800">
                Booking Information
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-pink-50 p-4">
                  <p className="text-sm font-semibold text-pink-700">
                    Booth Type
                  </p>
                  <p className="text-lg font-bold text-gray-800">
                    {booking.boothType === "small"
                      ? "Small Booth"
                      : "Big Booth"}
                  </p>
                </div>
                <div className="rounded-lg bg-purple-50 p-4">
                  <p className="text-sm font-semibold text-purple-700">
                    Quantity
                  </p>
                  <p className="text-lg font-bold text-gray-800">
                    {booking.amount} booth{booking.amount > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-sm font-semibold text-blue-700">
                    Booked On
                  </p>
                  <p className="text-lg font-bold text-gray-800">
                    {formatDate(booking.createdAt)}
                  </p>
                </div>
                <div className="rounded-lg bg-green-50 p-4">
                  <p className="text-sm font-semibold text-green-700">
                    Last Updated
                  </p>
                  <p className="text-lg font-bold text-gray-800">
                    {formatDate(booking.updatedAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* User Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800">
                Customer Information
              </h3>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-gray-700">
                  <span className="font-semibold">Name:</span>{" "}
                  {booking.user.name}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Email:</span>{" "}
                  {booking.user.email}
                </p>
              </div>
            </div>

            {message && (
              <div className="rounded-lg border border-pink-200 bg-pink-50 p-4">
                <p className="text-pink-700">{message}</p>
              </div>
            )}

            {/* Action Buttons */}
            {canEdit && (
              <div className="flex gap-4">
                <Button
                  onClick={handleOpenEditDialog}
                  className="flex-1 bg-[#FF69B4] text-white shadow-lg shadow-pink-400/50 hover:bg-pink-600"
                  disabled={updateMutation.isPending}
                >
                  Edit Booking
                </Button>
                <Button
                  onClick={() => setIsDeleteDialogOpen(true)}
                  variant="outline"
                  className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                  disabled={deleteMutation.isPending}
                >
                  Delete Booking
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Booking</DialogTitle>
              <DialogDescription>
                Update your booth booking details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="boothType">Booth Type</Label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    className={`flex-1 rounded-lg border-2 p-4 text-center font-bold transition-all ${
                      editBoothType === "small"
                        ? "border-pink-500 bg-pink-50 text-pink-700"
                        : "border-gray-200 bg-white text-gray-700"
                    }`}
                    onClick={() => setEditBoothType("small")}
                  >
                    Small
                  </button>
                  <button
                    type="button"
                    className={`flex-1 rounded-lg border-2 p-4 text-center font-bold transition-all ${
                      editBoothType === "big"
                        ? "border-purple-500 bg-purple-50 text-purple-700"
                        : "border-gray-200 bg-white text-gray-700"
                    }`}
                    onClick={() => setEditBoothType("big")}
                  >
                    Big
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  min={1}
                  max={6}
                  value={editAmount}
                  onChange={(e) => setEditAmount(Number(e.target.value))}
                  className="border-[#FFCBCB] bg-[#FFF0F5]"
                />
                <p className="text-xs text-gray-500">
                  Maximum 6 booths per exhibition
                </p>
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
                onClick={handleUpdateBooking}
                disabled={updateMutation.isPending}
                className="bg-[#FF69B4] hover:bg-pink-600"
              >
                {updateMutation.isPending ? "Updating..." : "Update Booking"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                booking for {exhibition.name}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteBooking}
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
