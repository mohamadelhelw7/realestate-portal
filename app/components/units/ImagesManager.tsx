import {
  useState,
  useRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { useFetcher, useRevalidator } from "react-router";

interface Image {
  id: string;
  url: string;
  isCover: boolean;
}

interface Props {
  unitId: string;
  images: Image[];
  onPendingChange?: (hasPending: boolean) => void;
}

export interface ImageManagerHandle {
  hasPendingChanges: () => boolean;
  flush: () => Promise<void>;
  discard: () => void;
}

interface UploadItem {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const ImageManager = forwardRef<ImageManagerHandle, Props>(
  function ImageManager(
    { unitId, images: initialImages, onPendingChange },
    ref,
  ) {
    const [images, setImages] = useState<Image[]>(initialImages);
    const [uploads, setUploads] = useState<UploadItem[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [lightboxId, setLightboxId] = useState<string | null>(null);

    // Pending (uncommitted) changes
    const [pendingDeletes, setPendingDeletes] = useState<Set<string>>(
      new Set(),
    );
    const [pendingCoverId, setPendingCoverId] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const revalidator = useRevalidator();

    useEffect(() => {
      setImages(initialImages);
    }, [initialImages]);

    useEffect(() => {
      return () => {
        uploads.forEach((u) => u.preview && URL.revokeObjectURL(u.preview));
      };
    }, [uploads]);

    const hasPending = pendingDeletes.size > 0 || pendingCoverId !== null;

    useEffect(() => {
      onPendingChange?.(hasPending);
    }, [hasPending, onPendingChange]);

    // Warn on unload if there are pending changes
    useEffect(() => {
      if (!hasPending) return;
      const handler = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = "";
      };
      window.addEventListener("beforeunload", handler);
      return () => window.removeEventListener("beforeunload", handler);
    }, [hasPending]);

    const validateFiles = (files: File[]) => {
      const valid: File[] = [];
      const errors: string[] = [];
      for (const file of files) {
        if (!ACCEPTED_TYPES.includes(file.type)) {
          errors.push(`${file.name}: unsupported type`);
          continue;
        }
        if (file.size > MAX_FILE_SIZE) {
          errors.push(`${file.name}: exceeds 10MB`);
          continue;
        }
        valid.push(file);
      }
      return { valid, errors };
    };

    const uploadFile = (item: UploadItem, isCover: boolean): Promise<void> => {
      return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append("intent", "uploadImages");
        formData.append("isCover", isCover ? "true" : "false");
        formData.append("images", item.file);

        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            setUploads((prev) =>
              prev.map((u) => (u.id === item.id ? { ...u, progress } : u)),
            );
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setUploads((prev) =>
              prev.map((u) =>
                u.id === item.id ? { ...u, status: "done", progress: 100 } : u,
              ),
            );
          } else {
            setUploads((prev) =>
              prev.map((u) =>
                u.id === item.id
                  ? { ...u, status: "error", error: `Failed (${xhr.status})` }
                  : u,
              ),
            );
          }
          resolve();
        });

        xhr.addEventListener("error", () => {
          setUploads((prev) =>
            prev.map((u) =>
              u.id === item.id
                ? { ...u, status: "error", error: "Network error" }
                : u,
            ),
          );
          resolve();
        });

        xhr.open("POST", `/units/${unitId}/images`);
        xhr.send(formData);
      });
    };

    const handleFiles = useCallback(
      async (fileList: FileList | File[]) => {
        const files = Array.from(fileList);
        const { valid, errors } = validateFiles(files);

        if (errors.length > 0) {
          const erroredItems: UploadItem[] = errors.map((err) => ({
            id: crypto.randomUUID(),
            file: new File([], err.split(":")[0]),
            preview: "",
            progress: 0,
            status: "error",
            error: err.split(": ")[1],
          }));
          setUploads((prev) => [...prev, ...erroredItems]);
        }

        if (valid.length === 0) return;

        const newItems: UploadItem[] = valid.map((file) => ({
          id: crypto.randomUUID(),
          file,
          preview: URL.createObjectURL(file),
          progress: 0,
          status: "pending",
        }));

        setUploads((prev) => [...prev, ...newItems]);

        for (let i = 0; i < newItems.length; i++) {
          const item = newItems[i];
          setUploads((prev) =>
            prev.map((u) =>
              u.id === item.id ? { ...u, status: "uploading" } : u,
            ),
          );
          const isCover = images.length === 0 && i === 0;
          await uploadFile(item, isCover);
        }

        revalidator.revalidate();

        setTimeout(() => {
          setUploads((prev) => prev.filter((u) => u.status !== "done"));
        }, 1500);
      },
      [images.length, unitId, revalidator],
    );

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    };

    // Pending toggles — no server hit
    const togglePendingDelete = (imageId: string) => {
      setPendingDeletes((prev) => {
        const next = new Set(prev);
        if (next.has(imageId)) {
          next.delete(imageId);
        } else {
          next.add(imageId);
          // If the deleted image was pending cover, clear that
          if (pendingCoverId === imageId) setPendingCoverId(null);
        }
        return next;
      });
    };

    const handleSetCover = (imageId: string) => {
      // Don't allow setting cover on a pending-deleted image
      if (pendingDeletes.has(imageId)) return;
      // If clicking the existing cover, no-op
      const current = images.find((i) => i.isCover);
      if (current?.id === imageId && pendingCoverId === null) return;
      setPendingCoverId(imageId);
    };

    // Flush pending changes to server
    const flush = async () => {
      const requests: Promise<Response>[] = [];

      for (const imageId of pendingDeletes) {
        const fd = new FormData();
        fd.append("intent", "deleteImage");
        fd.append("imageId", imageId);
        requests.push(
          fetch(`/units/${unitId}/images`, { method: "POST", body: fd }),
        );
      }

      if (pendingCoverId && !pendingDeletes.has(pendingCoverId)) {
        const fd = new FormData();
        fd.append("intent", "setCover");
        fd.append("imageId", pendingCoverId);
        requests.push(
          fetch(`/units/${unitId}/images`, { method: "POST", body: fd }),
        );
      }

      const results = await Promise.allSettled(requests);
      const failed = results.filter((r) => r.status === "rejected").length;
      if (failed > 0) {
        throw new Error(`${failed} change(s) failed to save`);
      }

      setPendingDeletes(new Set());
      setPendingCoverId(null);
      revalidator.revalidate();
    };

    const discard = () => {
      setPendingDeletes(new Set());
      setPendingCoverId(null);
    };

    useImperativeHandle(
      ref,
      () => ({
        hasPendingChanges: () => hasPending,
        flush,
        discard,
      }),
      [hasPending, pendingDeletes, pendingCoverId],
    );

    // Compute projected display state
    const visibleImages = images
      .filter((img) => !pendingDeletes.has(img.id))
      .map((img) => ({
        ...img,
        isCover: pendingCoverId ? img.id === pendingCoverId : img.isCover,
      }));

    const lightboxImage = images.find((i) => i.id === lightboxId);
    const lightboxIndex = lightboxImage
      ? visibleImages.findIndex((i) => i.id === lightboxId)
      : -1;
    const showLightboxAt = (delta: number) => {
      if (lightboxIndex === -1 || visibleImages.length === 0) return;
      const next =
        (lightboxIndex + delta + visibleImages.length) % visibleImages.length;
      setLightboxId(visibleImages[next].id);
    };

    useEffect(() => {
      if (!lightboxId) return;
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setLightboxId(null);
        if (e.key === "ArrowRight") showLightboxAt(1);
        if (e.key === "ArrowLeft") showLightboxAt(-1);
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [lightboxId, visibleImages]);

    const activeUploads = uploads.filter((u) => u.status !== "done");

    return (
      <>
        <div className="border border-gray-300 bg-white">
          <div className="px-4 py-2.5 bg-gray-100 border-b border-gray-300 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Images</span>
            <span className="text-xs text-gray-500">
              {visibleImages.length}{" "}
              {visibleImages.length === 1 ? "image" : "images"}
              {hasPending && (
                <span className="ml-2 text-amber-600">• unsaved changes</span>
              )}
            </span>
          </div>

          <div className="p-4">
            {/* Dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded p-6 mb-4 text-center cursor-pointer transition-colors ${
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={ACCEPTED_TYPES.join(",")}
                onChange={(e) => {
                  if (e.target.files) handleFiles(e.target.files);
                  e.target.value = "";
                }}
                className="hidden"
              />
              <svg
                className="w-8 h-8 mx-auto mb-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
              <p className="text-sm text-gray-600">
                <span className="text-blue-600 font-medium">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>
              <p className="text-xs text-gray-400 mt-1">
                JPEG, PNG, WebP — max 10MB each
              </p>
            </div>

            {/* Active uploads */}
            {activeUploads.length > 0 && (
              <div className="mb-4 space-y-2">
                {activeUploads.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center gap-3 border border-gray-200 p-2 bg-gray-50"
                  >
                    {u.preview ? (
                      <img
                        src={u.preview}
                        alt=""
                        className="w-10 h-10 object-cover border border-gray-300"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 border border-gray-300" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-700 truncate">
                        {u.file.name}
                      </div>
                      {u.status === "error" ? (
                        <div className="text-xs text-red-600 mt-0.5">
                          {u.error}
                        </div>
                      ) : (
                        <div className="h-1 bg-gray-200 rounded-full mt-1 overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              u.status === "done"
                                ? "bg-green-500"
                                : "bg-blue-500"
                            }`}
                            style={{ width: `${u.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setUploads((prev) => prev.filter((x) => x.id !== u.id))
                      }
                      className="text-gray-400 hover:text-gray-600 text-lg leading-none px-1"
                      aria-label="Dismiss"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Image grid */}
            {images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {images.map((image) => {
                  const markedForDelete = pendingDeletes.has(image.id);
                  const projectedCover = pendingCoverId
                    ? image.id === pendingCoverId
                    : image.isCover;

                  return (
                    <div
                      key={image.id}
                      className={`border border-gray-300 relative group bg-white transition-opacity ${
                        markedForDelete ? "opacity-40" : ""
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setLightboxId(image.id)}
                        className="block w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="View image"
                      >
                        <img
                          src={image.url}
                          alt=""
                          className="w-full h-28 object-cover"
                        />
                      </button>

                      {projectedCover && !markedForDelete && (
                        <div className="absolute top-1 left-1 bg-gray-900 text-white text-[10px] px-1.5 py-0.5 font-medium tracking-wide">
                          COVER
                          {pendingCoverId === image.id && (
                            <span className="ml-1 text-amber-300">•</span>
                          )}
                        </div>
                      )}

                      {markedForDelete && (
                        <div className="absolute top-1 right-1 bg-red-600 text-white text-[10px] px-1.5 py-0.5 font-medium tracking-wide">
                          REMOVING
                        </div>
                      )}

                      <div className="flex border-t border-gray-300">
                        {markedForDelete ? (
                          <button
                            type="button"
                            onClick={() => togglePendingDelete(image.id)}
                            className="flex-1 text-[11px] py-1 text-gray-700 hover:bg-gray-50"
                          >
                            Undo
                          </button>
                        ) : (
                          <>
                            {!projectedCover && (
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
                              onClick={() => togglePendingDelete(image.id)}
                              className="flex-1 text-[11px] py-1 text-red-600 hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              activeUploads.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-4">
                  No images uploaded yet.
                </p>
              )
            )}
          </div>
        </div>

        {/* Lightbox */}
        {lightboxImage && (
          <div
            className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4"
            onClick={() => setLightboxId(null)}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxId(null);
              }}
              className="absolute top-4 right-4 text-white text-3xl leading-none hover:text-gray-300"
              aria-label="Close"
            >
              ×
            </button>
            {visibleImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    showLightboxAt(-1);
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
                    showLightboxAt(1);
                  }}
                  className="absolute right-4 text-white text-4xl hover:text-gray-300 px-3 py-2"
                  aria-label="Next"
                >
                  ›
                </button>
              </>
            )}
            <img
              src={lightboxImage.url}
              alt=""
              className="max-h-[90vh] max-w-[90vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            {lightboxIndex >= 0 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-xs bg-black/50 px-3 py-1 rounded-full">
                {lightboxIndex + 1} / {visibleImages.length}
              </div>
            )}
          </div>
        )}
      </>
    );
  },
);
