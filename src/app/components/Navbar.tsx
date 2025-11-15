import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-4 z-50 mx-auto max-w-3xl">
      <div className="rounded-full border border-gray-200/50 bg-white/80 px-6 py-3 shadow-lg backdrop-blur-xs">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex-1 text-lg font-bold text-gray-800 transition-colors hover:text-pink-600"
          >
            Yuri Conference
          </Link>
          <Link
            href="/exhibition"
            className="text-gray-700 transition-colors hover:text-pink-600"
          >
            Exhibitions
          </Link>
          <Link
            href="/boothBook"
            className="text-gray-700 transition-colors hover:text-pink-600"
          >
            Book Booth
          </Link>
          <button className="ml-4 rounded-full bg-pink-600 px-4 py-2 font-medium text-white transition-colors hover:bg-pink-700">
            Login
          </button>
        </div>
      </div>
    </nav>
  );
}
