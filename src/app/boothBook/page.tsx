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

export default function BoothBookingPage() {
  const [hall, setHall] = useState<Hall>("A");
  const [title, setTitle] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState<number | "">("");
  const [message, setMessage] = useState<string | null>(null);
  const [transform, setTransform] = useState({
    scale: 1,
    translateX: 0,
    translateY: 0,
  });
  const svgRef = React.useRef<SVGSVGElement>(null);
  const [selectedBooth, setSelectedBooth] = useState<string | null>(null);
  const exhibitions = [
    { id: "ex1", name: "Exhibition 1", hall: "A" },
    { id: "ex2", name: "Exhibition 2", hall: "B" },
    { id: "ex3", name: "Exhibition 3", hall: "C" },
  ];
  const [selectedExhibition, setSelectedExhibition] = useState(exhibitions[0]);

  const pastelColors = ["#FFDEE9", "#B5EAEA", "#FFCBCB", "#F3FFE3", "#E4C1F9"];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!title.trim()) {
      setMessage("Please provide a title.");
      return;
    }
    if (!dateFrom || !dateTo) {
      setMessage("Please provide both start and end dates.");
      return;
    }
    if (dateFrom > dateTo) {
      setMessage("Start date must be before or equal to end date.");
      return;
    }

    const payload = {
      title,
      hall,
      date_from: dateFrom,
      date_to: dateTo,
      description,
      capacity: capacity === "" ? null : capacity,
    };

    console.log("Submitting exhibition:", payload);
    setMessage("Exhibition submitted (preview). Check console for payload.");
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const scaleChange = e.ctrlKey ? (e.deltaY < 0 ? 0.1 : -0.1) : 0;
    setTransform((prev) => {
      const newScale = Math.min(Math.max(prev.scale + scaleChange, 0.5), 2);
      return { ...prev, scale: newScale };
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!svgRef.current) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const { translateX, translateY } = transform;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      setTransform((prev) => ({
        ...prev,
        translateX: translateX + dx,
        translateY: translateY + dy,
      }));
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleBoothClick = (boothLabel: string) => {
    setSelectedBooth(boothLabel);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooth) {
      alert("Please select a booth to book.");
      return;
    }
    console.log(`Booking booth ${selectedBooth} in ${selectedExhibition.name}`);
    alert(`Booth ${selectedBooth} booked successfully!`);
  };

  return (
    <main className="mx-auto max-w-[900px] rounded-xl border border-[#FFDEE9] bg-white p-6 shadow-xl">
      <header className="mb-6 text-center">
        <h1 className="text-3xl text-[#FF69B4]">Book your Booth</h1>
        <p className="text-gray-500">
          Design your booth layout with a pastel touch!
        </p>
      </header>

      <section className="mb-8 grid gap-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <label className="font-bold text-[#FF69B4]">
              Select Exhibition:{" "}
            </label>
            <select
              value={selectedExhibition.id}
              onChange={(e) => {
                const exhibition = exhibitions.find(
                  (ex) => ex.id === e.target.value,
                );
                if (exhibition) {
                  setSelectedExhibition(exhibition);
                  setHall(exhibition.hall as Hall);
                  setSelectedBooth(null);
                }
              }}
              className="rounded-lg border border-[#FFCBCB] bg-[#FFF0F5] p-2 text-[#6b7280] focus:ring focus:ring-pink-500 focus:outline-none"
            >
              {exhibitions.map((exhibition) => (
                <option key={exhibition.id} value={exhibition.id}>
                  {exhibition.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4 rounded-lg border border-[#FFCBCB] bg-[#FFF0F5] p-4">
          <h2 className="mb-2 text-2xl font-bold text-[#FF69B4]">
            {selectedExhibition.name}
          </h2>
          <p className="mb-1 text-[#6b7280]">
            <strong>Hall:</strong> {selectedExhibition.hall}
          </p>
          <p className="mb-1 text-[#6b7280]">
            <strong>Date:</strong> November 20, 2025 - November 25, 2025
          </p>
          <p className="text-[#6b7280]">
            <strong>Description:</strong> This is a mock description for{" "}
            {selectedExhibition.name}.
          </p>
        </div>

        <div
          className="relative h-[400px] w-full overflow-hidden rounded-xl border-2 border-dashed border-[#FFCBCB] bg-[#FFF0F5]"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
        >
          <svg
            ref={svgRef}
            viewBox="0 0 700 500"
            className="h-full w-full"
            style={{
              transform: `translate(${transform.translateX}px, ${transform.translateY}px) scale(${transform.scale})`,
              transformOrigin: "center",
            }}
          >
            <rect x={0} y={0} width={700} height={500} fill="#FFF0F5" />

            {boothLayouts[hall].map((booth, index) => (
              <g
                key={booth.label}
                onClick={() => handleBoothClick(booth.label)}
                style={{ cursor: "pointer" }}
              >
                <rect
                  x={booth.x}
                  y={booth.y}
                  width={booth.width}
                  height={booth.height}
                  rx={8}
                  ry={8}
                  fill={
                    selectedBooth === booth.label
                      ? "#FF69B4"
                      : pastelColors[index % pastelColors.length]
                  }
                  stroke="#FF69B4"
                  strokeWidth={2}
                />
                <text
                  x={booth.x + 10}
                  y={booth.y + 30}
                  fontSize={14}
                  fill="#6b7280"
                  fontWeight={600}
                >
                  {booth.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </section>

      <section>
        <form
          onSubmit={handleBookingSubmit}
          className="grid gap-4 text-[#6b7280]"
        >
          <div>
            <label className="block font-bold text-[#FF69B4]">
              Selected Booth (click the booth to select)
            </label>
            <input
              value={selectedBooth || ""}
              readOnly
              placeholder="Click on a booth to select"
              className="w-full rounded-lg border border-[#FFCBCB] bg-[#FFF0F5] p-2.5 focus:ring focus:ring-pink-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="rounded-lg border-none bg-[#FF69B4] px-4 py-2.5 text-white shadow-lg shadow-pink-400/50"
            >
              Book Booth
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
