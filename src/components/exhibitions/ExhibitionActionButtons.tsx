"use client";

import Link from "next/link";

import { useAuth } from "@/contexts/AuthContext";

import { Button } from "../ui/button";

interface ExhibitionActionButtonsProps {
  exhibitionId: string;
}

export function ExhibitionActionButtons({
  exhibitionId,
}: ExhibitionActionButtonsProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-2">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
      </div>
    );
  }

  // Not logged in
  if (!isAuthenticated || !user) {
    return (
      <p className="text-center text-sm text-gray-600">
        <Link
          href="/login"
          className="font-medium text-pink-500 hover:underline"
        >
          Login
        </Link>{" "}
        to book this exhibition
      </p>
    );
  }

  // Admin user
  if (user.role === "admin") {
    return (
      <Link href={`/exhibitions/${exhibitionId}/manage`}>
        <Button className="w-full bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
          Manage Exhibition
        </Button>
      </Link>
    );
  }

  // Regular member user
  return (
    <Button className="w-full bg-linear-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
      Book this Exhibition
    </Button>
  );
}
