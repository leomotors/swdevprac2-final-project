"use client";

import React, { useState } from "react";

type Hall = "A" | "B" | "C";

const booths = [] as const;

const boothLayouts: Record<
  Hall,
  { x: number; y: number; width: number; height: number; label: string }[]
> = {
  A: [
    { x: 50, y: 100, width: 100, height: 100, label: "A1" },
    { x: 200, y: 100, width: 200, height: 100, label: "A2" },
    { x: 450, y: 100, width: 100, height: 100, label: "A3" },
    { x: 50, y: 250, width: 200, height: 150, label: "A4" },
    { x: 300, y: 250, width: 200, height: 150, label: "A5" },
  ],
  B: [
    { x: 50, y: 50, width: 150, height: 150, label: "B1" },
    { x: 250, y: 50, width: 100, height: 100, label: "B2" },
    { x: 400, y: 50, width: 200, height: 150, label: "B3" },
    { x: 50, y: 250, width: 100, height: 100, label: "B4" },
    { x: 250, y: 250, width: 200, height: 150, label: "B5" },
  ],
  C: [
    { x: 100, y: 100, width: 120, height: 120, label: "C1" },
    { x: 300, y: 100, width: 150, height: 120, label: "C2" },
    { x: 500, y: 100, width: 100, height: 100, label: "C3" },
    { x: 200, y: 250, width: 200, height: 150, label: "C4" },
    { x: 450, y: 250, width: 150, height: 150, label: "C5" },
  ],
};

export default function ExhibitionCreatePage() {
  // Fields required by backend:
  // name, description, venue, startDate (ISO string), durationDay (number), smallBoothQuota, bigBoothQuota, posterPicture
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

    if (!name.trim() || !description.trim() || !venue.trim() || !startDate) {
      setMessage(
        "Please fill required fields: name, description, venue, start date.",
      );
      return;
    }

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

  // (SVG pan/zoom removed for this form page)

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
            <label className="block font-bold text-[#FF69B4]">Venue</label>
            <input
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="Exhibition venue"
              className="rounded-lg border border-[#FFCBCB] bg-[#FFF0F5] p-2 text-[#6b7280] focus:ring focus:ring-pink-500 focus:outline-none"
            />
          </div>
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
