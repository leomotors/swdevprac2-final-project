"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { useMutation, useQuery } from "@/libs/api";

function BoothBookForm() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const searchParams = useSearchParams();

  const [boothType, setBoothType] = useState<"small" | "big">("small");
  const [amount, setAmount] = useState<number>(1);
  const [message, setMessage] = useState<string | null>(null);

  const bookingMutation = useMutation("post", "/booking");

  const { data: exhibitionsData } = useQuery("get", "/exhibitions");

  const exhibitions = React.useMemo(() => {
    if (!exhibitionsData?.success || !Array.isArray(exhibitionsData?.data)) {
      return [];
    }

    return exhibitionsData.data.filter((ex) => {
      const exStartDate = new Date(ex.startDate);
      const today = new Date();
      exStartDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      return exStartDate >= today;
    });
  }, [exhibitionsData]);

  const exhibitionFromQuery = searchParams.get("exhibition");

  const [selectedExhibition, setSelectedExhibition] = useState<string>("");
  const [hasInitialized, setHasInitialized] = useState(false);

  // Initialize selected exhibition from query params once
  if (!hasInitialized && exhibitionFromQuery && exhibitions.length > 0) {
    const exhibitionExists = exhibitions.some(
      (ex) => ex._id === exhibitionFromQuery,
    );
    if (exhibitionExists) {
      console.log("Exhibition from query:", exhibitionFromQuery);
      setSelectedExhibition(exhibitionFromQuery);
      setHasInitialized(true);
    } else if (exhibitions.length > 0) {
      setHasInitialized(true);
    }
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-xl text-gray-500">Loading...</div>
      </main>
    );
  }

  if (!isAuthenticated || user?.role !== "member") {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-red-600">Forbidden</h1>
          <p className="text-lg text-gray-700">
            You must be a member to book a booth.
          </p>
        </div>
      </main>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!selectedExhibition) {
      setMessage("Please select an exhibition.");
      return;
    }
    if (!["small", "big"].includes(boothType)) {
      setMessage("Booth type must be small or big.");
      return;
    }
    if (amount < 1) {
      setMessage("Amount must be at least 1.");
      return;
    }

    try {
      const result = await bookingMutation.mutateAsync({
        body: {
          exhibition: selectedExhibition,
          boothType,
          amount,
        },
      });

      if (!result?.success) {
        setMessage("Failed to book booth. Please try again.");
        return;
      }

      setMessage("Booth booked successfully!");
      setAmount(1);
      // Note: Exhibition data will be automatically refetched/updated by React Query
    } catch (err: unknown) {
      if (err && typeof err === "object" && "message" in err) {
        setMessage(`Booking error: ${err.message}`);
      } else {
        setMessage(`Request failed: ${err}`);
      }
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 py-16">
      <div className="w-full max-w-2xl">
        <h1 className="mb-4 bg-linear-to-r from-pink-500 to-purple-600 bg-clip-text text-center text-5xl font-bold text-transparent">
          Book a Booth
        </h1>
        <p className="mb-8 text-center text-xl text-gray-600">
          Select an exhibition and booth type to book your spot
        </p>

        <form onSubmit={handleSubmit} className="grid gap-6 text-[#6b7280]">
          <div>
            <label className="block font-bold text-[#FF69B4]">Exhibition</label>
            <select
              value={selectedExhibition} // This will now be correctly set
              onChange={(e) => setSelectedExhibition(e.target.value)}
              className="w-full rounded-lg border border-[#FFCBCB] bg-[#FFF0F5] p-2.5"
            >
              <option value="">Select exhibition</option>
              {exhibitions.map((ex) => (
                <option key={ex._id} value={ex._id}>
                  {ex.name}
                </option>
              ))}
            </select>
            {/* Show details of selected exhibition below dropdown */}
            {selectedExhibition &&
              (() => {
                const ex = exhibitions.find(
                  (e) => e._id === selectedExhibition,
                );
                if (!ex) return null;
                const startDate = new Date(ex.startDate);
                const endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + ex.durationDay);
                const formatDate = (date: Date) =>
                  date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  });
                return (
                  <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white/60 p-6 shadow-lg transition-all">
                    <div className="flex flex-col gap-6 md:flex-row">
                      {/* Poster Section */}
                      <div className="w-full md:w-2/5 lg:w-1/3">
                        <div className="relative aspect-9/16 h-48 w-full overflow-hidden rounded-xl md:h-full">
                          <Image
                            src={ex.posterPicture}
                            alt={ex.name}
                            fill
                            className="border border-pink-100 object-cover shadow-md"
                          />
                        </div>
                      </div>
                      {/* Content Section */}
                      <div className="flex flex-1 flex-col">
                        <div className="p-0">
                          <div className="text-2xl font-bold text-gray-800 transition-colors hover:text-pink-600">
                            {ex.name}
                          </div>
                          <div className="mt-2 flex flex-col gap-1 text-sm text-gray-600">
                            <p>
                              📍 <span className="font-medium">{ex.venue}</span>
                            </p>
                            <p>
                              📅 {formatDate(startDate)} - {formatDate(endDate)}
                            </p>
                            <p>⏰ {ex.durationDay} days</p>
                          </div>
                        </div>
                        <div className="flex-1 p-0">
                          <p className="mb-4 line-clamp-3 text-gray-700">
                            {ex.description}
                          </p>
                          <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
                            <div className="rounded-lg bg-pink-50 p-3">
                              <p className="font-semibold text-pink-700">
                                Small Booths
                              </p>
                              <p className="text-gray-600">
                                {ex.smallBoothQuota} available
                              </p>
                            </div>
                            <div className="rounded-lg bg-purple-50 p-3">
                              <p className="font-semibold text-purple-700">
                                Big Booths
                              </p>
                              <p className="text-gray-600">
                                {ex.bigBoothQuota} available
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
          </div>
          <div className="item-center row gap-4">
            <div>
              <label className="mb-2 block font-bold text-[#FF69B4]">
                Booth Type
              </label>
              <div className="flex gap-6">
                <button
                  type="button"
                  className={`w-2/5 rounded-xl border-2 p-6 text-lg font-bold shadow-md transition-all ${
                    boothType === "small"
                      ? "border-pink-500 bg-pink-50 text-pink-700"
                      : "border-gray-200 bg-white text-gray-700"
                  }`}
                  onClick={() => setBoothType("small")}
                  aria-pressed={boothType === "small"}
                >
                  Small Booth
                </button>
                <button
                  type="button"
                  className={`w-3/5 rounded-xl border-2 p-6 text-lg font-bold shadow-md transition-all ${
                    boothType === "big"
                      ? "border-purple-500 bg-purple-50 text-purple-700"
                      : "border-gray-200 bg-white text-gray-700"
                  }`}
                  onClick={() => setBoothType("big")}
                  aria-pressed={boothType === "big"}
                >
                  Big Booth
                </button>
              </div>
            </div>
          </div>
          <div>
            <label className="block font-bold text-[#FF69B4]">Amount</label>
            <input
              type="number"
              min={1}
              max={6}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full rounded-lg border border-[#FFCBCB] bg-[#FFF0F5] p-2.5"
            />
          </div>
          <div className="flex items-center justify-center gap-3">
            <button
              type="submit"
              disabled={bookingMutation.isPending}
              className="rounded-lg border-none bg-[#FF69B4] px-4 py-2.5 text-white shadow-lg shadow-pink-400/50 disabled:opacity-60"
            >
              {bookingMutation.isPending ? "Booking..." : "Book Booth"}
            </button>
          </div>
        </form>

        {message && (
          <div className="mt-8 rounded-lg border border-pink-200 bg-pink-50 p-4 text-center">
            <p className="text-pink-700">{message}</p>
          </div>
        )}
      </div>
    </main>
  );
}

// -------------------------------------------------------------------
// This is your actual page component.
// It wraps the form in <Suspense> so useSearchParams can be used.
// -------------------------------------------------------------------
export default function BoothBookPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center">
          <div className="text-xl text-gray-500">Loading...</div>
        </main>
      }
    >
      <BoothBookForm />
    </Suspense>
  );
}
