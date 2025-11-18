import Image from "next/image";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { components } from "@/libs/api/schema";

import { ExhibitionActionButtons } from "./ExhibitionActionButtons";

type Exhibition = components["schemas"]["PopulatedExhibitionResponse"];

interface ExhibitionCardProps {
  exhibition: Exhibition;
}

export function ExhibitionCard({ exhibition }: ExhibitionCardProps) {
  const startDate = new Date(exhibition.startDate);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + exhibition.durationDay - 1);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="overflow-hidden border-gray-200 bg-white/60 p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Poster Section */}
        <Link
          href={`/exhibitions/${exhibition._id}`}
          className="w-full md:w-2/5 lg:w-1/3"
        >
          <div className="relative aspect-9/16 w-full overflow-hidden md:h-full">
            <Image
              src={exhibition.posterPicture}
              alt={exhibition.name}
              fill
              className="rounded-xl object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        </Link>

        {/* Content Section */}
        <div className="flex flex-1 flex-col">
          <CardHeader className="p-0">
            <Link href={`/exhibitions/${exhibition._id}`}>
              <CardTitle className="text-2xl font-bold text-gray-800 transition-colors hover:text-pink-600">
                {exhibition.name}
              </CardTitle>
            </Link>
            <div className="mt-2 flex flex-col gap-1 text-sm text-gray-600">
              <p>
                📍 <span className="font-medium">{exhibition.venue}</span>
              </p>
              <p>
                📅 {formatDate(startDate)} - {formatDate(endDate)}
              </p>
              <p>⏰ {exhibition.durationDay} days</p>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <p className="mb-4 line-clamp-3 text-gray-700">
              {exhibition.description}
            </p>
            <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-lg bg-pink-50 p-3">
                <p className="font-semibold text-pink-700">Small Booths</p>
                <p className="text-gray-600">
                  {exhibition.smallBoothQuota} available
                </p>
              </div>
              <div className="rounded-lg bg-purple-50 p-3">
                <p className="font-semibold text-purple-700">Big Booths</p>
                <p className="text-gray-600">
                  {exhibition.bigBoothQuota} available
                </p>
              </div>
            </div>
            <ExhibitionActionButtons exhibitionId={exhibition._id} />
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
