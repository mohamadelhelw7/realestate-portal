import { useState } from "react";
import { ImageLightbox } from "./ImageLightBox";

interface Image {
  id: string;
  url: string;
  isCover: boolean;
}

interface Props {
  images: Image[];
}

export function ImageGallery({ images }: Props) {
  const [lightboxId, setLightboxId] = useState<string | null>(null);

  // Sort: cover first, then the rest in original order
  const sorted = [...images].sort((a, b) => {
    if (a.isCover && !b.isCover) return -1;
    if (!a.isCover && b.isCover) return 1;
    return 0;
  });

  const cover = sorted[0];
  const rest = sorted.slice(1);

  return (
    <div className="border border-gray-300 bg-white">
      <div className="px-4 py-2.5 bg-gray-100 border-b border-gray-300 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Images</span>
        <span className="text-xs text-gray-500">
          {images.length} {images.length === 1 ? "image" : "images"}
        </span>
      </div>

      {images.length === 0 ? (
        <div className="p-8 text-center text-xs text-gray-400">No images.</div>
      ) : (
        <div className="p-4">
          {/* Hero cover image */}
          <button
            type="button"
            onClick={() => setLightboxId(cover.id)}
            className="block w-full mb-3 border border-gray-200 relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="View cover image"
          >
            <img
              src={cover.url}
              alt=""
              className="w-full h-72 sm:h-80 object-cover group-hover:opacity-95 transition-opacity"
            />
            {cover.isCover && (
              <div className="absolute top-2 left-2 bg-gray-900 text-white text-[10px] px-2 py-1 font-medium tracking-wide">
                COVER
              </div>
            )}
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
              Click to enlarge
            </div>
          </button>

          {/* Thumbnail strip */}
          {rest.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {rest.map((image) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => setLightboxId(image.id)}
                  className="border border-gray-200 relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="View image"
                >
                  <img
                    src={image.url}
                    alt=""
                    className="w-full h-20 object-cover group-hover:opacity-90 transition-opacity"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <ImageLightbox
        images={sorted}
        currentId={lightboxId}
        onChange={setLightboxId}
      />
    </div>
  );
}
