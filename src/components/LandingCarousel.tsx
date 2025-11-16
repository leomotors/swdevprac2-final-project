"use client";

import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { useRef } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import yuri1 from "./assets/carousel/yuri-1.webp";
import yuri2 from "./assets/carousel/yuri-2.webp";
import yuri3 from "./assets/carousel/yuri-3.webp";

const images = [yuri1, yuri2, yuri3];

export function LandingCarousel() {
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  return (
    <div className="w-full max-w-5xl px-4">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        opts={{ loop: true }}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <Image
                  src={image}
                  alt={`Yuri Image ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
