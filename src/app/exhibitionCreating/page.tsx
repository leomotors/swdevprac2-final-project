"use client";
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function ExhibitionCreatePage() {
  const { user, isLoading, isAuthenticated } = useAuth();

  // Only allow admin
  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-xl text-gray-500">Loading...</div>
      </main>
    );
  }
  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-red-600">Forbidden</h1>
          <p className="text-lg text-gray-700">
            You must be an admin to access this page.
          </p>
        </div>
      </main>
    );
  }

  // ...existing code...
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [venue, setVenue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [durationDay, setDurationDay] = useState<number>(1);
  const [smallBoothQuota, setSmallBoothQuota] = useState<number>(0);
  const [bigBoothQuota, setBigBoothQuota] = useState<number>(0);
  const [posterPicture, setPosterPicture] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    // Existing validation
    if (!name.trim() || !description.trim() || !venue.trim() || !startDate) {
      setMessage(
        "Please fill required fields: name, description, venue, start date.",
      );
      return;
    }

    // --- NEW VALIDATION ---
    // Validate the start date
    const selectedDate = new Date(`${startDate}T00:00:00`); // Treat date as local midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Get today's date at midnight (local)

    if (selectedDate < today) {
      setMessage("Start date cannot be earlier than today.");
      return;
    }
    // --- END NEW VALIDATION ---

    const payload = {
      name,
      description,
      venue,
      startDate,
      durationDay,
      smallBoothQuota,
      bigBoothQuota,
      posterPicture,
    };

    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      if (!token) {
        setMessage(
          "You must be logged in as an admin to create an exhibition.",
        );
        return;
      }

      const res = await fetch("http://localhost:5003/api/v1/exhibitions", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.status === 201 || json.success) {
        setMessage("Exhibition created successfully");
        // reset form
        setName("");
        setDescription("");
        setVenue("");
        setStartDate("");
        setDurationDay(1);
        setSmallBoothQuota(0);
        setBigBoothQuota(0);
        setPosterPicture("");
      } else {
        setMessage(
          json?.error || json?.message || "Failed to create exhibition",
        );
      }
    } catch (err) {
      console.error(err);
      setMessage("Request failed — see console");
    }
  }

  return (
    <main className="mx-auto max-w-[900px] rounded-xl border border-[#FFDEE9] bg-white p-6 shadow-xl">
      <header className="mb-6 text-center">
        <h1 className="text-3xl text-[#FF69B4]">Create Your Exhibition</h1>
        <p className="text-gray-500">
          Design your booth layout with a pastel touch!
        </p>
      </header>

      <section>
        <form onSubmit={handleSubmit} className="grid gap-4 text-[#6b7280]">
          <div>
            <label className="block font-bold text-[#FF69B4]">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Exhibition name"
              className="w-full rounded-lg border border-[#FFCBCB] bg-[#FFF0F5] p-2.5 focus:ring focus:ring-pink-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-[#FF69B4]">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-[#FFCBCB] bg-[#FFF0F5] p-2.5 focus:ring focus:ring-pink-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#FF69B4]">Venue</label>
              <input
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="Venue"
                className="w-full rounded-lg border border-[#FFCBCB] bg-[#FFF0F5] p-2.5 focus:ring focus:ring-pink-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-[#FF69B4]">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-lg border border-[#FFCBCB] bg-[#FFF0F5] p-2.5 focus:ring focus:ring-pink-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-[#FF69B4]">
                Duration (days)
              </label>
              <input
                type="number"
                min={1}
                value={durationDay}
                onChange={(e) => setDurationDay(Number(e.target.value))}
                className="w-full rounded-lg border border-[#FFCBCB] bg-[#FFF0F5] p-2.5 focus:ring focus:ring-pink-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-[#FF69B4]">
                Small Booth Quota
              </label>
              <input
                type="number"
                min={0}
                value={smallBoothQuota}
                onChange={(e) => setSmallBoothQuota(Number(e.target.value))}
                className="w-full rounded-lg border border-[#FFCBCB] bg-[#FFF0F5] p-2.5 focus:ring focus:ring-pink-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-[#FF69B4]">
                Big Booth Quota
              </label>
              <input
                type="number"
                min={0}
                value={bigBoothQuota}
                onChange={(e) => setBigBoothQuota(Number(e.target.value))}
                className="w-full rounded-lg border border-[#FFCBCB] bg-[#FFF0F5] p-2.5 focus:ring focus:ring-pink-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#FF69B4]">
              Poster Picture URL
            </label>
            <input
              value={posterPicture}
              onChange={(e) => setPosterPicture(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-lg border border-[#FFCBCB] bg-[#FFF0F5] p-2.5 focus:ring focus:ring-pink-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="rounded-lg border-none bg-[#FF69B4] px-4 py-2.5 text-white shadow-lg shadow-pink-400/50"
            >
              Create Exhibition
            </button>
            <button
              type="button"
              onClick={() => {
                setName("");
                setDescription("");
                setVenue("");
                setStartDate("");
                setDurationDay(1);
                setSmallBoothQuota(0);
                setBigBoothQuota(0);
                setPosterPicture("");
                setMessage(null);
              }}
              className="rounded-lg border border-[#FFCBCB] bg-[#FFF0F5] px-3 py-2.5 text-[#FF69B4]"
            >
              Reset
            </button>

            {message && (
              <div className="ml-3 font-semibold text-green-700">{message}</div>
            )}
          </div>
        </form>
      </section>
    </main>
  );
}
