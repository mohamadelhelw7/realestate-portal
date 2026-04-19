import { useState, useRef } from "react";
import { useFetcher } from "react-router";

interface Image {
  id: string;
  url: string;
  isCover: boolean;
}

interface Props {
  unitId: string;
  images: Image[];
}

export function ImageManager({ unitId, images: initialImages }: Props) {
  const [images, setImages] = useState<Image[]>(initialImages);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadFetcher = useFetcher();
  const deleteFetcher = useFetcher();
  const coverFetcher = useFetcher();

  async function handleUpload() {
    if (selectedFiles.length === 0) return;
    const formData = new FormData();
    formData.append("intent", "uploadImages");
    formData.append("isCover", images.length === 0 ? "true" : "false");
    selectedFiles.forEach((file) => formData.append("images", file));
    uploadFetcher.submit(formData, {
      method: "POST",
      action: `/units/${unitId}`,
      encType: "multipart/form-data",
    });
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleDelete(imageId: string) {
    if (!confirm("Delete this image?")) return;
    const formData = new FormData();
    formData.append("intent", "deleteImage");
    formData.append("imageId", imageId);
    deleteFetcher.submit(formData, {
      method: "POST",
      action: `/units/${unitId}`,
    });
    setImages((prev) => prev.filter((img) => img.id !== imageId));
  }

  function handleSetCover(imageId: string) {
    const formData = new FormData();
    formData.append("intent", "setCover");
    formData.append("imageId", imageId);
    coverFetcher.submit(formData, {
      method: "POST",
      action: `/units/${unitId}`,
    });
    setImages((prev) =>
      prev.map((img) => ({ ...img, isCover: img.id === imageId })),
    );
  }

  const uploading = uploadFetcher.state !== "idle";

  return (
    <div className="border border-gray-300 bg-white">
      <div className="px-4 py-2.5 bg-gray-100 border-b border-gray-300 text-sm font-medium text-gray-700">
        Images
      </div>
      <div className="p-4">
        {images.length > 0 && (
          <div className="grid grid-cols-4 gap-3 mb-4">
            {images.map((image) => (
              <div key={image.id} className="border border-gray-300 relative">
                <img
                  src={image.url}
                  alt=""
                  className="w-full h-24 object-cover"
                />
                {image.isCover && (
                  <div className="absolute top-1 left-1 bg-gray-900 text-white text-[10px] px-1.5 py-0.5">
                    Cover
                  </div>
                )}
                <div className="flex border-t border-gray-300">
                  {!image.isCover && (
                    <button
                      type="button"
                      onClick={() => handleSetCover(image.id)}
                      className="flex-1 text-[11px] py-1 text-blue-600 hover:bg-blue-50 border-r border-gray-300"
                    >
                      Set cover
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(image.id)}
                    className="flex-1 text-[11px] py-1 text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {images.length === 0 && (
          <p className="text-xs text-gray-400 mb-4">No images uploaded yet.</p>
        )}

        <div className="flex gap-3 items-center">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setSelectedFiles(Array.from(e.target.files ?? []))}
            className="text-sm text-gray-600 border border-gray-300 px-2 py-1.5 flex-1"
          />
          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading || selectedFiles.length === 0}
            className="bg-gray-900 text-white text-sm px-4 py-1.5 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {uploading
              ? "Uploading..."
              : `Upload${selectedFiles.length > 0 ? ` (${selectedFiles.length})` : ""}`}
          </button>
        </div>

        {selectedFiles.length > 0 && (
          <p className="text-xs text-gray-400 mt-2">
            {selectedFiles.map((f) => f.name).join(", ")}
          </p>
        )}
      </div>
    </div>
  );
}
