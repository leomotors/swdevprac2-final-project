import { ExhibitionCard } from "@/components/exhibitions/ExhibitionCard";
import { serverClient } from "@/libs/api/server";

export const dynamic = "force-dynamic";

export default async function ExhibitionsPage() {
  const { data, error } = await serverClient.GET("/exhibitions");

  if (error || !data?.data) {
    return (
      <main className="flex min-h-screen flex-col items-center p-8 py-16">
        <div className="w-full max-w-6xl">
          <h1 className="mb-8 bg-linear-to-r from-pink-500 to-purple-600 bg-clip-text text-center text-5xl font-bold text-transparent">
            Exhibitions
          </h1>
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-red-600">
              Failed to load exhibitions. Please try again later.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const exhibitions = data.data;

  if (exhibitions.length === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center p-8 py-16">
        <div className="w-full max-w-6xl">
          <h1 className="mb-8 bg-linear-to-r from-pink-500 to-purple-600 bg-clip-text text-center text-5xl font-bold text-transparent">
            Exhibitions
          </h1>
          <div className="rounded-lg border border-gray-200 bg-white/60 p-12 text-center">
            <p className="text-xl text-gray-600">
              No exhibitions available at the moment.
            </p>
            <p className="mt-2 text-gray-500">
              Check back later for upcoming events!
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 py-16">
      <div className="w-full max-w-6xl">
        <h1 className="mb-4 bg-linear-to-r from-pink-500 to-purple-600 bg-clip-text text-center text-5xl font-bold text-transparent">
          Exhibitions
        </h1>
        <p className="mb-12 text-center text-xl text-gray-600">
          Discover and book booths for our upcoming exhibitions
        </p>

        <div className="grid gap-8 lg:grid-cols-2">
          {exhibitions.map((exhibition) => (
            <ExhibitionCard key={exhibition._id} exhibition={exhibition} />
          ))}
        </div>
      </div>
    </main>
  );
}
