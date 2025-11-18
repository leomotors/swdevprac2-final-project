"use client";

import Link from "next/link";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@/libs/api";

export default function BookingsPage() {
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();

  const { data: bookingsData, isLoading: isLoadingBookings } = useQuery(
    "get",
    "/booking",
  );

  if (isAuthLoading || isLoadingBookings) {
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
            You must be logged in to view bookings.
          </p>
        </div>
      </main>
    );
  }

  const bookings = bookingsData?.data || [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <main className="min-h-screen p-8 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1
              className="pb-2 text-5xl font-bold"
              style={{
                background: "linear-gradient(to right, #ec4899, #9333ea)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                display: "inline-block",
              }}
            >
              {user?.role === "admin" ? "All Bookings" : "My Bookings"}
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              {user?.role === "admin"
                ? "Manage all booth bookings"
                : "View and manage your booth bookings"}
            </p>
          </div>
          {user?.role === "member" && (
            <Link href="/boothBook">
              <Button className="rounded-lg bg-[#FF69B4] px-6 py-3 text-white shadow-lg shadow-pink-400/50 hover:bg-pink-600">
                Create New Booking
              </Button>
            </Link>
          )}
        </div>

        {bookings.length === 0 ? (
          <Card className="border-gray-200 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <p className="text-xl text-gray-500">No bookings found</p>
              {user?.role === "member" && (
                <Link href="/boothBook">
                  <Button className="mt-4 bg-[#FF69B4] hover:bg-pink-600">
                    Create Your First Booking
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => {
              const exhibition = booking.exhibition;
              const startDate = new Date(exhibition.startDate);
              const endDate = new Date(startDate);
              endDate.setDate(startDate.getDate() + exhibition.durationDay);

              return (
                <Card
                  key={booking._id}
                  className="group overflow-hidden border-gray-200 bg-white/60 backdrop-blur-sm transition-all hover:shadow-xl"
                >
                  <CardHeader className="space-y-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl font-bold text-gray-800">
                        {exhibition.name}
                      </CardTitle>
                      <Badge
                        className={
                          booking.boothType === "small"
                            ? "bg-pink-100 text-pink-700"
                            : "bg-purple-100 text-purple-700"
                        }
                      >
                        {booking.boothType === "small"
                          ? "Small Booth"
                          : "Big Booth"}
                      </Badge>
                    </div>
                    {user?.role === "admin" && (
                      <p className="text-sm text-gray-600">
                        Booked by: {booking.user.name}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>📍 {exhibition.venue}</p>
                      <p>
                        📅 {formatDate(exhibition.startDate)} -{" "}
                        {formatDate(endDate.toISOString())}
                      </p>
                      <p>🎪 Quantity: {booking.amount}</p>
                      <p className="text-xs text-gray-500">
                        Booked on: {formatDate(booking.createdAt)}
                      </p>
                    </div>

                    <Link href={`/booking/${booking._id}`}>
                      <Button
                        variant="outline"
                        className="w-full border-pink-300 text-pink-600 hover:bg-pink-50"
                      >
                        Manage Booking
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
