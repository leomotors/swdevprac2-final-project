import Link from "next/link";

import { LandingCarousel } from "@/components/LandingCarousel";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-12 p-8 py-16">
      {/* Hero Section */}
      <div className="flex max-w-4xl flex-col items-center gap-6 text-center">
        <h1 className="bg-linear-to-r from-pink-500 to-purple-600 bg-clip-text text-6xl font-bold text-transparent">
          Yuri Conference
        </h1>
        <p className="text-2xl font-light text-gray-600">
          Where passion meets creativity in the world of yuri
        </p>
      </div>

      {/* About Section */}
      <div className="flex max-w-3xl flex-col items-center gap-6">
        <h2 className="text-3xl font-bold text-gray-800">Who are we?</h2>
        <div className="flex flex-col gap-4 text-center text-lg text-gray-700">
          <p>
            We are{" "}
            <span className="font-semibold text-pink-600">
              Yuri Lover Group (百合愛好家)
            </span>
            , the premier organizers of the legendary Yuri Conference series!
            Since our inception, we've brought together thousands of
            enthusiasts, creators, and collectors who share a deep appreciation
            for yuri culture.
          </p>
          <p>
            Our conferences, from the historic 1st Yuri Conference to the
            upcoming <span className="oscillate-1">6</span>
            <span className="oscillate-2">7</span>th edition and more to come,
            have become the cornerstone events where artists showcase their
            masterpieces, merchants present exclusive merchandise, and fans
            discover new treasures.
          </p>
          <p>
            Whether you're a veteran exhibitor or a first-time attendee, our
            events provide the perfect platform to connect with like-minded
            individuals, expand your <span className="rainbow-text">gay</span>{" "}
            collection, and immerse yourself in the vibrant yuri community.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mt-8 grid w-full max-w-5xl gap-8 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition-shadow hover:shadow-xl">
          <div className="mb-4 text-4xl">🎨</div>
          <h3 className="mb-3 text-xl font-bold text-gray-800">For Artists</h3>
          <p className="text-gray-600">
            Showcase your artwork, sell your creations, and connect with fans
            who appreciate your talent. Premium booth spaces available!
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition-shadow hover:shadow-xl">
          <div className="mb-4 text-4xl">🛍️</div>
          <h3 className="mb-3 text-xl font-bold text-gray-800">
            For Collectors
          </h3>
          <p className="text-gray-600">
            Discover rare merchandise, meet your favorite creators, and find
            exclusive items you won't get anywhere else.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition-shadow hover:shadow-xl">
          <div className="mb-4 text-4xl">🤝</div>
          <h3 className="mb-3 text-xl font-bold text-gray-800">For Everyone</h3>
          <p className="text-gray-600">
            Join a welcoming community of yuri enthusiasts. Network, make
            friends, and celebrate the culture together!
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="my-12 flex flex-col items-center gap-6">
        <h2 className="text-3xl font-bold text-gray-800">Ready to Join?</h2>
        <p className="max-w-2xl text-center text-lg text-gray-600">
          Book your booth today and be part of the most exciting yuri exhibition
          events!
        </p>
        <Link
          href="/exhibition"
          className="rounded-full bg-linear-to-r from-pink-500 to-purple-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl"
        >
          View All Exhibitions →
        </Link>
      </div>

      {/* Image Carousel */}
      <LandingCarousel />
    </main>
  );
}
