import { useEffect } from "react";

interface Image {
  id: string;
  url: string;
}

interface Props {
  images: Image[];
  currentId: string | null;
  onChange: (id: string | null) => void;
}

export function ImageLightbox({ images, currentId, onChange }: Props) {
  const current = images.find((i) => i.id === currentId);
  const index = current ? images.findIndex((i) => i.id === currentId) : -1;

  const move = (delta: number) => {
    if (index === -1 || images.length === 0) return;
    const next = (index + delta + images.length) % images.length;
    onChange(images[next].id);
  };

  useEffect(() => {
    if (!currentId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onChange(null);
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentId, images]);

  if (!current) return null;

  return (
    <div
      className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4"
      onClick={() => onChange(null)}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onChange(null);
        }}
        className="absolute top-4 right-4 text-white text-3xl leading-none hover:text-gray-300"
        aria-label="Close"
      >
        ×
      </button>
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              move(-1);
            }}
            className="absolute left-4 text-white text-4xl hover:text-gray-300 px-3 py-2"
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              move(1);
            }}
            className="absolute right-4 text-white text-4xl hover:text-gray-300 px-3 py-2"
            aria-label="Next"
          >
            ›
          </button>
        </>
      )}
      <img
        src={current.url}
        alt=""
        className="max-h-[90vh] max-w-[90vw] object-contain"
        onClick={(e) => e.stopPropagation()}
      />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-xs bg-black/50 px-3 py-1 rounded-full">
        {index + 1} / {images.length}
      </div>
    </div>
  );
}
