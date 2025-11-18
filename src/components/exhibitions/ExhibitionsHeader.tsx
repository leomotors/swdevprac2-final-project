"use client";

import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export function ExhibitionsHeader() {
  const { user } = useAuth();

  return (
    <div className="mb-12 flex flex-col items-center gap-8">
      <div className="flex-1">
        <h1 className="mb-4 bg-linear-to-r from-pink-500 to-purple-600 bg-clip-text text-center text-5xl font-bold text-transparent">
          Exhibitions
        </h1>
        <p className="text-center text-xl text-gray-600">
          Discover and book booths for our upcoming exhibitions
        </p>
      </div>
      {user?.role === "admin" && (
        <Link href="/exhibitions/create">
          <Button className="rounded-lg bg-[#FF69B4] px-6 py-3 text-white shadow-lg shadow-pink-400/50 hover:bg-pink-600">
            <Plus className="mr-2 h-5 w-5" />
            Create Exhibition
          </Button>
        </Link>
      )}
    </div>
  );
}
