"use client";

import { useState } from "react";
import Image from "next/image";
import { isCatalogueImage } from "@/lib/images";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const gallery = images.length ? images : [];
  const [active, setActive] = useState(0);
  // A square catalogue image as the main picture gets a square frame it fills.
  const square = isCatalogueImage(gallery[0]);
  const fills = isCatalogueImage(gallery[active]);

  return (
    <div>
      <div
        className={`relative ${square ? "aspect-square" : "aspect-[4/3]"} overflow-hidden rounded-2xl border border-slate-200 bg-white`}
      >
        {/* contain, not cover: tall pump photos (vertical / multistage / borehole)
            would otherwise lose their top and bottom in the frame */}
        <Image
          key={active}
          src={gallery[active]}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className={fills ? "object-cover" : "object-contain p-2"}
        />
      </div>
      {gallery.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {gallery.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={i === active}
              className={`relative aspect-square overflow-hidden rounded-xl border transition-all ${
                i === active
                  ? "border-accent ring-2 ring-accent/40"
                  : "border-slate-200 opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill sizes="120px" className="bg-white object-contain p-1" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
