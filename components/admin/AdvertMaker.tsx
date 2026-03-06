"use client";
/* eslint-disable @next/next/no-img-element */

import {
  ChangeEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition
} from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@/data/projects";
import {
  advertModelOptions,
  advertStyleOptions,
  aspectRatioOptions,
  MAX_REFERENCE_IMAGE_COUNT,
  type AdvertLibraryItem,
  type AdvertLibrarySection,
  type AdvertModelOption,
  type AdvertStyleOption,
  type AspectRatioOption,
  type ReferenceLibraryItem,
  type ResolutionOption,
  type UploadedReference
} from "@/lib/admin/adverts";

type ReferenceDraft = {
  file?: File;
  id: string;
  label: string;
  previewUrl: string;
  uploaded?: UploadedReference;
};

type GenerateResponse = {
  model: string;
  outputs: UploadedReference[];
  requestId?: string;
  textResponse?: string;
  warnings?: string[];
};

type PreviewState =
  | {
      item: AdvertLibraryItem;
      kind: "advert";
    }
  | {
      item: ReferenceLibraryItem;
      kind: "reference";
    };

async function parseApiResponse<T>(response: Response): Promise<T & { error?: string }> {
  const text = await response.text();

  if (!text) {
    return {} as T & { error?: string };
  }

  try {
    return JSON.parse(text) as T & { error?: string };
  } catch {
    throw new Error(
      `Request failed with ${response.status}. Response was not JSON: ${text.slice(0, 200)}`
    );
  }
}

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function revokePreviewUrl(previewUrl: string) {
  if (previewUrl.startsWith("blob:")) {
    URL.revokeObjectURL(previewUrl);
  }
}

function getReferencePreviewUrl(reference: UploadedReference) {
  return reference.previewUrl ?? reference.url;
}

function getReferenceLabel(reference: UploadedReference) {
  if (reference.name?.trim()) {
    return reference.name.trim();
  }

  const pathname = reference.storagePathname ?? reference.pathname;
  const segments = pathname.split("/");

  return segments[segments.length - 1] || "Reference";
}

function buildDraftFromUploaded(reference: UploadedReference): ReferenceDraft {
  return {
    id: crypto.randomUUID(),
    label: getReferenceLabel(reference),
    previewUrl: getReferencePreviewUrl(reference),
    uploaded: reference
  };
}

function buildUploadedReferenceFromLibrary(
  reference: ReferenceLibraryItem
): UploadedReference {
  return {
    contentType: reference.contentType,
    downloadUrl: reference.downloadUrl,
    name: reference.name,
    pathname: reference.storagePathname,
    previewUrl: reference.url,
    storageAccess: reference.storageAccess,
    storagePathname: reference.storagePathname,
    url: reference.falUrl
  };
}

function getReferenceKey(reference: ReferenceDraft) {
  const uploaded = reference.uploaded;

  return (
    uploaded?.storagePathname ||
    uploaded?.pathname ||
    uploaded?.url ||
    reference.file?.name ||
    reference.label
  );
}

function mergeReferenceDrafts(
  current: ReferenceDraft[],
  incoming: ReferenceDraft[]
) {
  const seen = new Set(current.map((reference) => getReferenceKey(reference)));
  const merged = [...current];

  for (const reference of incoming) {
    const key = getReferenceKey(reference);

    if (seen.has(key)) {
      revokePreviewUrl(reference.previewUrl);
      continue;
    }

    merged.push(reference);
    seen.add(key);
  }

  return merged.slice(0, MAX_REFERENCE_IMAGE_COUNT);
}

const defaultProjectSlug = "scriptforge";

export default function AdvertMaker({
  defaultModel,
  hasBlob,
  hasFileAi,
  librarySections,
  projects
}: {
  defaultModel: AdvertModelOption;
  hasBlob: boolean;
  hasFileAi: boolean;
  librarySections: AdvertLibrarySection[];
  projects: Project[];
}) {
  const router = useRouter();
  const promptRef = useRef<HTMLTextAreaElement | null>(null);
  const [isRefreshing, startRefresh] = useTransition();
  const [libraryState, setLibraryState] = useState(librarySections);
  const [projectSlug, setProjectSlug] = useState(projects[0]?.slug ?? defaultProjectSlug);
  const [model, setModel] = useState<AdvertModelOption>(defaultModel);
  const [style, setStyle] = useState<AdvertStyleOption>("feature-splash");
  const [aspectRatio, setAspectRatio] = useState<AspectRatioOption>("4:5");
  const [resolution, setResolution] = useState<ResolutionOption>("2K");
  const [includeProjectBrief, setIncludeProjectBrief] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [references, setReferences] = useState<ReferenceDraft[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploadingLibraryRefs, setIsUploadingLibraryRefs] = useState(false);
  const [isDeletingAdvert, setIsDeletingAdvert] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latestResult, setLatestResult] = useState<GenerateResponse | null>(null);
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const [thumbSize, setThumbSize] = useState(176);
  const referenceUrlsRef = useRef<string[]>([]);

  const selectedProject = useMemo(
    () => projects.find((project) => project.slug === projectSlug) ?? projects[0],
    [projectSlug, projects]
  );
  const selectedSection = useMemo(
    () =>
      libraryState.find((section) => section.projectSlug === projectSlug) ?? {
        items: [],
        projectName: selectedProject?.name ?? "",
        projectSlug,
        references: []
      },
    [libraryState, projectSlug, selectedProject]
  );

  useEffect(() => {
    setLibraryState(librarySections);
  }, [librarySections]);

  useEffect(() => {
    referenceUrlsRef.current = references.map((reference) => reference.previewUrl);
  }, [references]);

  useEffect(() => {
    return () => {
      for (const previewUrl of referenceUrlsRef.current) {
        revokePreviewUrl(previewUrl);
      }
    };
  }, []);

  function resetReferences() {
    setReferences((currentReferences) => {
      for (const reference of currentReferences) {
        revokePreviewUrl(reference.previewUrl);
      }

      return [];
    });
  }

  function handleProjectChange(event: ChangeEvent<HTMLSelectElement>) {
    setProjectSlug(event.target.value);
    setLatestResult(null);
    setError(null);
    resetReferences();
  }

  function handleReferenceSelection(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    if (!files.length) {
      return;
    }

    setError(null);
    setReferences((currentReferences) =>
      mergeReferenceDrafts(
        currentReferences,
        files.map((file) => ({
          file,
          id: crypto.randomUUID(),
          label: file.name,
          previewUrl: URL.createObjectURL(file)
        }))
      )
    );
    event.target.value = "";
  }

  function addSavedReference(reference: ReferenceLibraryItem) {
    setReferences((currentReferences) =>
      mergeReferenceDrafts(currentReferences, [
        buildDraftFromUploaded(buildUploadedReferenceFromLibrary(reference))
      ])
    );
  }

  function removeReference(referenceId: string) {
    setReferences((currentReferences) => {
      const nextReferences = currentReferences.filter(
        (reference) => reference.id !== referenceId
      );
      const removedReference = currentReferences.find(
        (reference) => reference.id === referenceId
      );

      if (removedReference) {
        revokePreviewUrl(removedReference.previewUrl);
      }

      return nextReferences;
    });
  }

  async function uploadReferenceFile(file: File) {
    const response = await fetch(
      `/api/admin/media/upload?projectSlug=${encodeURIComponent(
        projectSlug
      )}&filename=${encodeURIComponent(file.name)}`,
      {
        body: file,
        headers: {
          "Content-Type": file.type || "application/octet-stream"
        },
        method: "PUT"
      }
    );
    const json = await parseApiResponse<UploadedReference>(response);

    if (!response.ok) {
      throw new Error(
        json.error ?? `Reference upload failed with ${response.status}.`
      );
    }

    return json;
  }

  async function uploadReference(reference: ReferenceDraft) {
    if (reference.uploaded) {
      return reference.uploaded;
    }

    if (!reference.file) {
      throw new Error("Reference file is missing.");
    }

    const uploaded = await uploadReferenceFile(reference.file);

    setReferences((currentReferences) =>
      currentReferences.map((currentReference) =>
        currentReference.id === reference.id
          ? (() => {
              revokePreviewUrl(currentReference.previewUrl);

              return {
                ...currentReference,
                label: getReferenceLabel(uploaded),
                previewUrl: getReferencePreviewUrl(uploaded),
                uploaded
              };
            })()
          : currentReference
      )
    );

    return uploaded;
  }

  async function handleLibraryReferenceUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    if (!files.length) {
      return;
    }

    setError(null);
    setIsUploadingLibraryRefs(true);

    try {
      const uploaded = await Promise.all(files.map((file) => uploadReferenceFile(file)));

      setReferences((currentReferences) =>
        mergeReferenceDrafts(
          currentReferences,
          uploaded.map((reference) => buildDraftFromUploaded(reference))
        )
      );
      startRefresh(() => {
        router.refresh();
      });
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Reference upload failed."
      );
    } finally {
      setIsUploadingLibraryRefs(false);
      event.target.value = "";
    }
  }

  function loadAdvertIntoComposer(item: AdvertLibraryItem) {
    setProjectSlug(item.projectSlug);
    setModel(item.model);
    setStyle(item.style);
    setAspectRatio(item.aspectRatio);
    setResolution(item.resolution);
    setIncludeProjectBrief(item.includeProjectBrief);
    setPrompt(item.prompt);
    setLatestResult({
      model: item.model,
      outputs: [
        {
          contentType: "image/png",
          downloadUrl: item.downloadUrl,
          pathname: item.pathname,
          previewUrl: item.url,
          storagePathname: item.pathname,
          url: item.url
        }
      ],
      requestId: item.requestId,
      textResponse: item.textResponse
    });
    setError(null);
    setReferences((currentReferences) => {
      for (const reference of currentReferences) {
        revokePreviewUrl(reference.previewUrl);
      }

      return item.references.map((reference) =>
        buildDraftFromUploaded(reference)
      );
    });
    setPreview(null);

    requestAnimationFrame(() => {
      promptRef.current?.focus();
      promptRef.current?.setSelectionRange(promptRef.current.value.length, promptRef.current.value.length);
    });
  }

  async function handleDeleteAdvert(item: AdvertLibraryItem) {
    const confirmed = window.confirm("Delete this advert?");

    if (!confirmed || isDeletingAdvert) {
      return;
    }

    setIsDeletingAdvert(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/media/delete", {
        body: JSON.stringify({
          manifestPathname: item.manifestPathname,
          outputPathname: item.pathname
        }),
        headers: {
          "Content-Type": "application/json"
        },
        method: "DELETE"
      });
      const json = await parseApiResponse<{ ok?: boolean }>(response);

      if (!response.ok) {
        throw new Error(json.error ?? `Delete failed with ${response.status}.`);
      }

      setLibraryState((currentSections) =>
        currentSections.map((section) =>
          section.projectSlug === item.projectSlug
            ? {
                ...section,
                items: section.items.filter(
                  (libraryItem) => libraryItem.pathname !== item.pathname
                )
              }
            : section
        )
      );

      if (
        latestResult?.outputs?.some(
          (output) =>
            (output.storagePathname ?? output.pathname) === item.pathname
        )
      ) {
        setLatestResult(null);
      }

      setPreview((currentPreview) => {
        if (
          currentPreview?.kind === "advert" &&
          currentPreview.item.pathname === item.pathname
        ) {
          return null;
        }

        return currentPreview;
      });

      startRefresh(() => {
        router.refresh();
      });
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : "Delete failed."
      );
    } finally {
      setIsDeletingAdvert(false);
    }
  }

  async function handleGenerate() {
    if (!prompt.trim() || isGenerating) {
      return;
    }

    setError(null);
    setIsGenerating(true);

    try {
      const uploadedReferences = await Promise.all(
        references.map((reference) => uploadReference(reference))
      );
      const response = await fetch("/api/admin/media/generate", {
        body: JSON.stringify({
          aspectRatio,
          includeProjectBrief,
          model,
          prompt,
          projectSlug,
          references: uploadedReferences,
          resolution,
          style
        }),
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
      });
      const json = await parseApiResponse<GenerateResponse>(response);

      if (!response.ok) {
        throw new Error(json.error ?? `Generation failed with ${response.status}.`);
      }

      setLatestResult(json);
      startRefresh(() => {
        router.refresh();
      });
    } catch (generationError) {
      setError(
        generationError instanceof Error
          ? generationError.message
          : "Generation failed."
      );
    } finally {
      setIsGenerating(false);
    }
  }

  const generatorDisabled = !hasBlob || !hasFileAi;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_24rem]">
        <section className="rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(0,0,0,0.16))] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.28)]">
          <div className="grid gap-3 lg:grid-cols-5">
            <select
              value={projectSlug}
              onChange={handleProjectChange}
              className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30"
            >
              {projects.map((project) => (
                <option key={project.slug} value={project.slug}>
                  {project.name}
                </option>
              ))}
            </select>
            <select
              value={model}
              onChange={(event) => setModel(event.target.value as AdvertModelOption)}
              className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30"
            >
              {advertModelOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              value={style}
              onChange={(event) => setStyle(event.target.value as AdvertStyleOption)}
              className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30"
            >
              {advertStyleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select
              value={aspectRatio}
              onChange={(event) =>
                setAspectRatio(event.target.value as AspectRatioOption)
              }
              className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30"
            >
              {aspectRatioOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} ({option.value})
                </option>
              ))}
            </select>
            <select
              value={resolution}
              onChange={(event) =>
                setResolution(event.target.value as ResolutionOption)
              }
              className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30"
            >
              <option value="1K">1K</option>
              <option value="2K">2K</option>
              <option value="4K">4K</option>
            </select>
          </div>

          <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <label className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-zinc-200">
              <input
                type="checkbox"
                checked={includeProjectBrief}
                onChange={(event) => setIncludeProjectBrief(event.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-black/40 accent-white"
              />
              Add project brief
            </label>

            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  hasFileAi ? "bg-emerald-400" : "bg-red-400"
                }`}
              />
              <span>fal</span>
              <span
                className={`ml-2 h-2.5 w-2.5 rounded-full ${
                  hasBlob ? "bg-emerald-400" : "bg-red-400"
                }`}
              />
              <span>storage</span>
            </div>
          </div>

          <div className="mt-4 rounded-[1.35rem] border border-white/10 bg-black/25 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
              Brief
            </p>
            <p className="mt-2 text-sm leading-6 text-zinc-300">
              {selectedProject?.shortDescription ?? selectedProject?.description}
            </p>
          </div>

          <textarea
            ref={promptRef}
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            rows={8}
            placeholder="Prompt"
            className="mt-4 min-h-[240px] w-full rounded-[1.4rem] border border-white/10 bg-black/30 px-4 py-4 text-sm leading-7 text-white outline-none transition placeholder:text-zinc-600 focus:border-white/30"
          />

          <div className="mt-4 rounded-[1.35rem] border border-dashed border-white/10 bg-black/20 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-zinc-300">
                Current refs {references.length ? `(${references.length})` : ""}
              </p>
              <div className="flex items-center gap-2">
                {references.length ? (
                  <button
                    type="button"
                    onClick={resetReferences}
                    className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-300 transition hover:border-white/30"
                  >
                    Clear
                  </button>
                ) : null}
                <label className="inline-flex cursor-pointer items-center rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-white transition hover:border-white/30">
                  Add images
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/heic,image/heif"
                    multiple
                    className="hidden"
                    onChange={handleReferenceSelection}
                    disabled={references.length >= MAX_REFERENCE_IMAGE_COUNT}
                  />
                </label>
              </div>
            </div>

            {references.length ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {references.map((reference) => (
                  <div
                    key={reference.id}
                    className="overflow-hidden rounded-[1rem] border border-white/10 bg-black/30"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setPreview({
                          item: {
                            contentType:
                              reference.uploaded?.contentType ||
                              reference.file?.type ||
                              "image/png",
                            downloadUrl:
                              reference.uploaded?.downloadUrl ??
                              reference.previewUrl,
                            falUrl: reference.uploaded?.url ?? reference.previewUrl,
                            name: reference.label,
                            pathname:
                              reference.uploaded?.storagePathname ||
                              reference.uploaded?.pathname ||
                              reference.label,
                            projectName: selectedProject?.name ?? "",
                            projectSlug,
                            storageAccess:
                              reference.uploaded?.storageAccess ?? "private",
                            storagePathname:
                              reference.uploaded?.storagePathname ||
                              reference.uploaded?.pathname ||
                              reference.label,
                            uploadedAt: new Date().toISOString(),
                            url: reference.previewUrl
                          },
                          kind: "reference"
                        })
                      }
                      className="block w-full"
                    >
                      <img
                        src={reference.previewUrl}
                        alt={reference.label}
                        className="aspect-square w-full object-cover"
                      />
                    </button>
                    <div className="flex items-center justify-between gap-2 p-2">
                      <p className="truncate text-xs text-zinc-300">
                        {reference.label}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeReference(reference.id)}
                        className="rounded-full border border-white/10 px-2 py-1 text-[11px] text-zinc-300 transition hover:border-white/30"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {error ? (
            <p className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {error}
            </p>
          ) : null}

          {latestResult?.warnings?.length ? (
            <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
              {latestResult.warnings.join(" ")}
            </div>
          ) : null}

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="text-xs text-zinc-500">
              {isRefreshing
                ? "Refreshing..."
                : prompt.length
                  ? `${prompt.length} chars`
                  : ""}
            </div>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={generatorDisabled || isGenerating || !prompt.trim()}
              className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-300"
            >
              {isGenerating ? "Generating..." : "Generate"}
            </button>
          </div>
        </section>

        <aside className="space-y-4">
          <section className="rounded-[1.6rem] border border-white/10 bg-black/20 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm text-zinc-300">Latest</p>
              {latestResult?.requestId ? (
                <span className="text-[11px] text-zinc-500">
                  {latestResult.requestId}
                </span>
              ) : null}
            </div>
            {latestResult?.outputs?.[0] ? (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() =>
                    setPreview({
                      item: {
                        aspectRatio,
                        downloadUrl:
                          latestResult.outputs[0].downloadUrl ??
                          latestResult.outputs[0].previewUrl ??
                          latestResult.outputs[0].url,
                        includeProjectBrief,
                        model,
                        pathname:
                          latestResult.outputs[0].storagePathname ??
                          latestResult.outputs[0].pathname,
                        prompt,
                        projectName: selectedProject?.name ?? "",
                        projectSlug,
                        references: references.map((reference) => reference.uploaded).filter(Boolean) as UploadedReference[],
                        requestId: latestResult.requestId,
                        resolution,
                        style,
                        textResponse: latestResult.textResponse,
                        uploadedAt: new Date().toISOString(),
                        url: latestResult.outputs[0].previewUrl ?? latestResult.outputs[0].url
                      },
                      kind: "advert"
                    })
                  }
                  className="block w-full overflow-hidden rounded-[1.1rem] border border-white/10 bg-black/30"
                >
                  <img
                    src={latestResult.outputs[0].previewUrl ?? latestResult.outputs[0].url}
                    alt="Latest generated advert"
                    className="aspect-[4/5] w-full object-cover"
                  />
                </button>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={
                      latestResult.outputs[0].downloadUrl ??
                      latestResult.outputs[0].previewUrl ??
                      latestResult.outputs[0].url
                    }
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="inline-flex rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-100 transition hover:border-white/30"
                  >
                    Download
                  </a>
                </div>
              </div>
            ) : (
              <div className="rounded-[1.1rem] border border-dashed border-white/10 bg-black/20 px-4 py-12 text-center text-sm text-zinc-500">
                No output yet
              </div>
            )}
          </section>

          <section className="rounded-[1.6rem] border border-white/10 bg-black/20 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-zinc-300">Project refs</p>
                <p className="text-xs text-zinc-500">
                  {selectedSection.references.length} saved
                </p>
              </div>
              <label className="inline-flex cursor-pointer items-center rounded-full border border-white/10 bg-black/30 px-3 py-2 text-xs text-white transition hover:border-white/30">
                {isUploadingLibraryRefs ? "Uploading..." : "Upload"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/heic,image/heif"
                  multiple
                  className="hidden"
                  onChange={handleLibraryReferenceUpload}
                  disabled={isUploadingLibraryRefs}
                />
              </label>
            </div>

            {selectedSection.references.length ? (
              <div className="grid grid-cols-3 gap-2">
                {selectedSection.references.map((reference) => (
                  <div
                    key={reference.storagePathname}
                    className="group overflow-hidden rounded-[1rem] border border-white/10 bg-black/30"
                  >
                    <button
                      type="button"
                      onClick={() => setPreview({ item: reference, kind: "reference" })}
                      className="block w-full"
                    >
                      <img
                        src={reference.url}
                        alt={reference.name}
                        className="aspect-square w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                      />
                    </button>
                    <div className="space-y-2 p-2">
                      <p className="truncate text-[11px] text-zinc-300">
                        {reference.name}
                      </p>
                      <button
                        type="button"
                        onClick={() => addSavedReference(reference)}
                        className="w-full rounded-full border border-white/10 px-2 py-1 text-[11px] text-zinc-200 transition hover:border-white/30"
                      >
                        Use
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[1.1rem] border border-dashed border-white/10 bg-black/20 px-4 py-8 text-center text-sm text-zinc-500">
                No saved refs
              </div>
            )}
          </section>
        </aside>
      </div>

      <section className="rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(0,0,0,0.16))] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.24)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm text-zinc-300">{selectedSection.projectName || selectedProject?.name}</p>
            <p className="text-xs text-zinc-500">
              {selectedSection.items.length} adverts
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-500">Thumbs</span>
            <input
              type="range"
              min={132}
              max={280}
              step={4}
              value={thumbSize}
              onChange={(event) => setThumbSize(Number(event.target.value))}
              className="h-2 w-40 accent-white"
            />
          </div>
        </div>

        {selectedSection.items.length ? (
          <div
            className="mt-4 grid gap-3"
            style={{
              gridTemplateColumns: `repeat(auto-fill, minmax(${thumbSize}px, 1fr))`
            }}
          >
            {selectedSection.items.map((item) => (
              <article
                key={item.pathname}
                className="group overflow-hidden rounded-[1.15rem] border border-white/10 bg-black/25"
              >
                <button
                  type="button"
                  onClick={() => setPreview({ item, kind: "advert" })}
                  className="block w-full text-left"
                >
                  <img
                    src={item.url}
                    alt={`${item.projectName} advert`}
                    className="aspect-[4/5] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                  />
                </button>
                <div className="space-y-2 p-3">
                  <p className="text-xs text-zinc-400">
                    {formatTimestamp(item.uploadedAt)}
                  </p>
                  <p className="line-clamp-2 text-sm text-zinc-200">{item.prompt}</p>
                  <div className="flex gap-2">
                    <a
                      href={item.downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                      download
                      className="rounded-full border border-white/10 px-3 py-1.5 text-[11px] text-zinc-100 transition hover:border-white/30"
                    >
                      Download
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDeleteAdvert(item)}
                      className="rounded-full border border-red-500/20 px-3 py-1.5 text-[11px] text-red-200 transition hover:border-red-400/40"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-[1.25rem] border border-dashed border-white/10 bg-black/20 px-6 py-10 text-sm text-zinc-500">
            No adverts saved for this project yet.
          </div>
        )}
      </section>

      {preview ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/82 px-4 py-8 backdrop-blur-sm">
          <div className="grid max-h-full w-full max-w-5xl gap-4 overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0b0b] p-4 shadow-[0_40px_100px_rgba(0,0,0,0.55)] lg:grid-cols-[minmax(0,1fr)_19rem]">
            <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/40">
              <img
                src={preview.kind === "advert" ? preview.item.url : preview.item.url}
                alt={preview.kind === "advert" ? preview.item.projectName : preview.item.name}
                className="max-h-[78vh] w-full object-contain"
              />
            </div>

            <aside className="flex flex-col gap-4 rounded-[1.5rem] border border-white/10 bg-black/30 p-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                  {preview.kind === "advert" ? "Advert" : "Reference"}
                </p>
                <p className="mt-2 text-lg font-medium text-white">
                  {preview.kind === "advert"
                    ? preview.item.projectName
                    : preview.item.name}
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  {formatTimestamp(preview.kind === "advert" ? preview.item.uploadedAt : preview.item.uploadedAt)}
                </p>
              </div>

              {preview.kind === "advert" ? (
                <div className="space-y-3 text-sm text-zinc-300">
                  <p className="rounded-2xl border border-white/10 bg-black/20 px-3 py-3 leading-6">
                    {preview.item.prompt}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400">
                    <span className="rounded-full border border-white/10 px-3 py-2">
                      {preview.item.model}
                    </span>
                    <span className="rounded-full border border-white/10 px-3 py-2">
                      {preview.item.style}
                    </span>
                    <span className="rounded-full border border-white/10 px-3 py-2">
                      {preview.item.aspectRatio}
                    </span>
                    <span className="rounded-full border border-white/10 px-3 py-2">
                      {preview.item.resolution}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500">
                    {preview.item.references.length} refs
                  </p>
                </div>
              ) : null}

              <div className="mt-auto flex flex-wrap gap-2">
                {preview.kind === "advert" ? (
                  <button
                    type="button"
                    onClick={() => loadAdvertIntoComposer(preview.item)}
                    className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-200"
                  >
                    Amend
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      addSavedReference(preview.item);
                      setPreview(null);
                    }}
                    className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-200"
                  >
                    Use as ref
                  </button>
                )}
                <a
                  href={
                    preview.kind === "advert"
                      ? preview.item.downloadUrl
                      : preview.item.downloadUrl
                  }
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-100 transition hover:border-white/30"
                >
                  Download
                </a>
                {preview.kind === "advert" ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteAdvert(preview.item)}
                    className="rounded-full border border-red-500/20 px-4 py-2 text-sm text-red-200 transition hover:border-red-400/40"
                  >
                    {isDeletingAdvert ? "Deleting..." : "Delete"}
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => setPreview(null)}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-100 transition hover:border-white/30"
                >
                  Close
                </button>
              </div>
            </aside>
          </div>
        </div>
      ) : null}
    </div>
  );
}
