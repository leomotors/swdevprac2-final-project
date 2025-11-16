import Image, { StaticImageData } from "next/image";

import assad from "./assets/testimonials/bashar-al-assad.webp";
import thatri from "./assets/testimonials/thatri.webp";

const testimonials = [
  {
    name: "ทนายธาตรี ธนธรรมสุนทร เฟซจริง",
    role: "Attorney",
    image: thatri,
    quote:
      "ขอโทษแฟนยูริ สำหรับโพสต์ที่ผ่านมา รู้เท่าไม่ถึงการณ์ จริง ๆ ไม่เอาแล้ว พอแล้ว เลิกแล้ว กับการโจมตียูริ ยูริสมควรได้รับความเคารพ ผมพร้อมรับผิดชอบ ขอโทษจริง ๆ ครับ 🙏",
  },
  {
    name: "Bashar al-Assad",
    role: "Conference Attendee",
    image: assad,
    quote: `الإمام علي بالأسد بشار
علي بن أبي طالب بالأسد
بشار بعمرو ما قابل الخير
بشار`,
  },
] satisfies Array<{
  image: StaticImageData;
  quote: string;
  name: string;
  role: string;
}>;

export function Testimonials() {
  return (
    <div className="w-full max-w-6xl">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-4xl font-bold text-gray-800">
          What People Say
        </h2>
        <p className="text-lg text-gray-600">
          Hear from our amazing community members
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white/40 p-8 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            {/* Image with square aspect ratio, rounded full, center cover */}
            <div className="relative mb-6 h-32 w-32 overflow-hidden rounded-full">
              <Image
                src={testimonial.image}
                alt={testimonial.name}
                fill
                className="object-cover object-center"
              />
            </div>

            {/* Quote */}
            <blockquote className="mb-6 text-center text-lg whitespace-pre-line text-gray-700 italic">
              "{testimonial.quote}"
            </blockquote>

            {/* Name and Role */}
            <div className="text-center">
              <p className="font-semibold text-gray-900">{testimonial.name}</p>
              <p className="text-sm text-gray-500">{testimonial.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
