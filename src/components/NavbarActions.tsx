"use client";

import { LogOut, User } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";

export default function NavbarActions() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <div className="ml-4 flex items-center gap-2">
        <Skeleton className="h-9 w-24 rounded-full" />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="cursor-pointer rounded-full border border-pink-500/30 bg-white/40 px-4 py-2 font-medium text-gray-800 transition-colors hover:bg-pink-50"
            >
              <User className="size-4" />
              {user?.name}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 rounded-2xl border-gray-200/50 bg-white/50 p-2 backdrop-blur-xs">
            <div className="space-y-1">
              <div className="px-3 py-2">
                <p className="text-sm font-medium text-gray-800">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-600">{user?.email}</p>
                <p className="mt-1 text-xs font-medium text-pink-600 capitalize">
                  {user?.role}
                </p>
              </div>

              {user?.role === "admin" ? (
                <Link href="/booking">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-gray-700 hover:bg-pink-50 hover:text-pink-700"
                  >
                    All Bookings
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/booking">
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 text-gray-700 hover:bg-pink-50 hover:text-pink-700"
                    >
                      My Bookings
                    </Button>
                  </Link>
                  <Link href="/booking/create">
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 text-gray-700 hover:bg-pink-50 hover:text-pink-700"
                    >
                      Create Booking
                    </Button>
                  </Link>
                </>
              )}

              <Button
                variant="ghost"
                className="w-full justify-start gap-2 border-red-300 text-red-600 hover:border hover:bg-red-50 hover:text-red-700"
                onClick={handleLogout}
              >
                <LogOut className="size-4" />
                Logout
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </>
    );
  }

  return (
    <Link href="/login">
      <Button className="ml-4 rounded-full bg-pink-600 px-4 py-2 font-medium text-white transition-colors hover:bg-pink-700">
        Login
      </Button>
    </Link>
  );
}
