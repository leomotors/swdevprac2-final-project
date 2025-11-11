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

  return (
    <div
      className={`min-h-screen p-8 font-['Comic_Sans_MS',_'Inter',ui-sans-serif,system-ui,-apple-system,'Segoe_UI',Roboto,'Helvetica_Neue',Arial] bg-gradient-to-b from-[#FFDEE9] via-[#B5EAEA] to-[#FFCBCB]`}
    >
      <div className="max-w-[900px] mx-auto bg-white rounded-xl shadow-xl p-6 border border-[#FFDEE9]">
        <header className="text-center mb-6">
          <h1 className="text-3xl text-[#FF69B4]">Create Your Exhibition</h1>
          <p className="text-gray-500">
            Design your booth layout with a pastel touch!
          </p>
        </header>

        <section className="mb-8 grid gap-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <label className="font-bold text-[#FF69B4]">Select Hall: </label>
              <select
                value={hall}
                onChange={(e) => setHall(e.target.value as Hall)}
                className="p-2 rounded-lg border border-[#FFCBCB] bg-[#FFF0F5] text-[#6b7280] focus:outline-none focus:ring focus:ring-pink-500"
              >
                <option value="A">Hall A</option>
                <option value="B">Hall B</option>
                <option value="C">Hall C</option>
              </select>
            </div>
          </div>

          <div
            className="w-full h-[400px] rounded-xl overflow-hidden relative border-2 border-dashed border-[#FFCBCB] bg-[#FFF0F5]"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
          >
            <svg
              ref={svgRef}
              viewBox="0 0 700 500"
              className="w-full h-full"
              style={{
                transform: `translate(${transform.translateX}px, ${transform.translateY}px) scale(${transform.scale})`,
                transformOrigin: "center",
              }}
            >
              <rect x={0} y={0} width={700} height={500} fill="#FFF0F5" />

              {boothLayouts[hall].map((booth, index) => (
                <g key={booth.label}>
                  <rect
                    x={booth.x}
                    y={booth.y}
                    width={booth.width}
                    height={booth.height}
                    rx={8}
                    ry={8}
                    fill={pastelColors[index % pastelColors.length]}
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
          <form onSubmit={handleSubmit} className="grid gap-4 text-[#6b7280]">
            <div>
              <label className="block font-bold text-[#FF69B4]">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Exhibition title"
                className="w-full p-2.5 rounded-lg border border-[#FFCBCB] bg-[#FFF0F5] focus:outline-none focus:ring focus:ring-pink-500"
              />
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block font-bold text-[#FF69B4]">
                  Start Date
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#FFCBCB] bg-[#FFF0F5] focus:outline-none focus:ring focus:ring-pink-500"
                />
              </div>
              <div className="flex-1">
                <label className="block font-bold text-[#FF69B4]">
                  End Date
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#FFCBCB] bg-[#FFF0F5] focus:outline-none focus:ring focus:ring-pink-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#FF69B4]">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full p-2.5 rounded-lg border border-[#FFCBCB] bg-[#FFF0F5] focus:outline-none focus:ring focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block font-bold text-[#FF69B4]">Capacity</label>
              <input
                type="number"
                min={0}
                value={capacity}
                onChange={(e) =>
                  setCapacity(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                placeholder="e.g. 100"
                className="w-full p-2.5 rounded-lg border border-[#FFCBCB] bg-[#FFF0F5] focus:outline-none focus:ring focus:ring-pink-500"
              />
            </div>

            <div className="flex gap-3 items-center">
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#FF69B4] text-white border-none rounded-lg shadow-pink-400/50 shadow-lg"
              >
                Create Exhibition
              </button>
              <button
                type="button"
                onClick={() => {
                  setTitle("");
                  setDateFrom("");
                  setDateTo("");
                  setDescription("");
                  setCapacity("");
                  setMessage(null);
                }}
                className="px-3 py-2.5 border border-[#FFCBCB] rounded-lg bg-[#FFF0F5] text-[#FF69B4]"
              >
                Reset
              </button>

              {message && (
                <div className="ml-3 text-green-700 font-semibold">
                  {message}
                </div>
              )}
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
