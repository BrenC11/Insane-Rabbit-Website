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
  getAdvertModelLabel,
  MAX_REFERENCE_IMAGE_COUNT,
  type AdvertModelOption,
  type AdvertStyleOption,
  type AspectRatioOption,
  type ResolutionOption,
  type UploadedReference
} from "@/lib/admin/adverts";

type ReferenceDraft = {
  file: File;
  id: string;
  previewUrl: string;
  uploaded?: UploadedReference;
};

type GenerateResponse = {
  model: string;
  outputs: UploadedReference[];
  requestId?: string;
  textResponse?: string;
};

const defaultProjectSlug = "scriptforge";

export default function AdvertMaker({
  defaultModel,
  hasBlob,
  hasFileAi,
  projects
}: {
  defaultModel: AdvertModelOption;
  hasBlob: boolean;
  hasFileAi: boolean;
  projects: Project[];
}) {
  const router = useRouter();
  const [isRefreshing, startRefresh] = useTransition();
  const [projectSlug, setProjectSlug] = useState(projects[0]?.slug ?? defaultProjectSlug);
  const [model, setModel] = useState<AdvertModelOption>(defaultModel);
  const [style, setStyle] = useState<AdvertStyleOption>("feature-splash");
  const [aspectRatio, setAspectRatio] = useState<AspectRatioOption>("4:5");
  const [resolution, setResolution] = useState<ResolutionOption>("2K");
  const [prompt, setPrompt] = useState("");
  const [references, setReferences] = useState<ReferenceDraft[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latestResult, setLatestResult] = useState<GenerateResponse | null>(null);
  const referenceUrlsRef = useRef<string[]>([]);

  const selectedProject = useMemo(
    () => projects.find((project) => project.slug === projectSlug) ?? projects[0],
    [projectSlug, projects]
  );
  const selectedModel = useMemo(
    () =>
      advertModelOptions.find((option) => option.value === model) ??
      advertModelOptions[0],
    [model]
  );

  useEffect(() => {
    referenceUrlsRef.current = references.map((reference) => reference.previewUrl);
  }, [references]);

  useEffect(() => {
    return () => {
      for (const previewUrl of referenceUrlsRef.current) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, []);

  function resetReferences() {
    setReferences((currentReferences) => {
      for (const reference of currentReferences) {
        URL.revokeObjectURL(reference.previewUrl);
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
    setReferences((currentReferences) => {
      const nextReferences = [...currentReferences];

      for (const file of files.slice(0, MAX_REFERENCE_IMAGE_COUNT - currentReferences.length)) {
        nextReferences.push({
          file,
          id: crypto.randomUUID(),
          previewUrl: URL.createObjectURL(file)
        });
      }

      return nextReferences;
    });

    event.target.value = "";
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
        URL.revokeObjectURL(removedReference.previewUrl);
      }

      return nextReferences;
    });
  }

  async function uploadReference(reference: ReferenceDraft) {
    if (reference.uploaded) {
      return reference.uploaded;
    }

    const response = await fetch(
      `/api/admin/adverts/reference-upload?projectSlug=${encodeURIComponent(
        projectSlug
      )}&filename=${encodeURIComponent(reference.file.name)}`,
      {
        body: reference.file,
        headers: {
          "Content-Type": reference.file.type || "application/octet-stream"
        },
        method: "PUT"
      }
    );
    const json = (await response.json()) as UploadedReference & { error?: string };

    if (!response.ok) {
      throw new Error(json.error ?? "Reference upload failed.");
    }

    setReferences((currentReferences) =>
      currentReferences.map((currentReference) =>
        currentReference.id === reference.id
          ? { ...currentReference, uploaded: json }
          : currentReference
      )
    );

    return json;
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
      const response = await fetch("/api/admin/adverts/generate", {
        body: JSON.stringify({
          aspectRatio,
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
      const json = (await response.json()) as GenerateResponse & { error?: string };

      if (!response.ok) {
        throw new Error(json.error ?? "Generation failed.");
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
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_24rem]">
      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur">
        <div className="border-b border-white/10 px-6 py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.34em] text-amber-200/70">
                Advert Maker
              </p>
              <div className="space-y-2">
                <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white">
                  Slick prompt-to-ad generation for every project.
                </h2>
                <p className="max-w-2xl text-sm leading-6 text-zinc-300">
                  Keep it fast: pick the product, set the framing, add a few
                  references, and generate a campaign-ready image without leaving
                  the Insane Rabbit site.
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                  Project
                </p>
                <p className="mt-2 text-sm font-medium text-white">
                  {selectedProject?.name}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                  Model
                </p>
                <p className="mt-2 text-sm font-medium text-white">
                  {getAdvertModelLabel(model)}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                  References
                </p>
                <p className="mt-2 text-sm font-medium text-white">
                  {references.length} / {MAX_REFERENCE_IMAGE_COUNT}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <label className="flex flex-col gap-2 rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
              <span className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                Model
              </span>
              <select
                value={model}
                onChange={(event) =>
                  setModel(event.target.value as AdvertModelOption)
                }
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-300/50"
              >
                {advertModelOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="text-xs leading-5 text-zinc-400">
                {selectedModel.description}
              </p>
            </label>

            <label className="flex flex-col gap-2 rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
              <span className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                Project
              </span>
              <select
                value={projectSlug}
                onChange={handleProjectChange}
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-300/50"
              >
                {projects.map((project) => (
                  <option key={project.slug} value={project.slug}>
                    {project.name}
                  </option>
                ))}
              </select>
              <p className="text-xs leading-5 text-zinc-400">
                Uses the same live project metadata already on the site.
              </p>
            </label>

            <label className="flex flex-col gap-2 rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
              <span className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                Advert angle
              </span>
              <select
                value={style}
                onChange={(event) => setStyle(event.target.value as AdvertStyleOption)}
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-300/50"
              >
                {advertStyleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="text-xs leading-5 text-zinc-400">
                Keeps the brief focused instead of starting from scratch.
              </p>
            </label>

            <label className="flex flex-col gap-2 rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
              <span className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                Aspect ratio
              </span>
              <select
                value={aspectRatio}
                onChange={(event) =>
                  setAspectRatio(event.target.value as AspectRatioOption)
                }
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-300/50"
              >
                {aspectRatioOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} ({option.value})
                  </option>
                ))}
              </select>
              <p className="text-xs leading-5 text-zinc-400">
                Choose the shape for feeds, stories, posters, or web placements.
              </p>
            </label>

            <label className="flex flex-col gap-2 rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
              <span className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                Resolution
              </span>
              <select
                value={resolution}
                onChange={(event) =>
                  setResolution(event.target.value as ResolutionOption)
                }
                className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-amber-300/50"
              >
                <option value="1K">1K</option>
                <option value="2K">2K</option>
                <option value="4K">4K</option>
              </select>
              <p className="text-xs leading-5 text-zinc-400">
                2K is the sensible default. Use 4K for final campaign work.
              </p>
            </label>

            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
              <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                Product brief
              </p>
              <p className="mt-3 text-base font-medium text-white">
                {selectedProject?.name}
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-300">
                {selectedProject?.shortDescription ?? selectedProject?.description}
              </p>
            </div>
          </div>

          <label className="flex flex-col gap-3 rounded-[1.7rem] border border-white/10 bg-black/20 p-5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                Prompt
              </span>
              <span className="text-xs text-zinc-500">{prompt.length} characters</span>
            </div>
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              rows={8}
              placeholder={`Example: Create a premium ${selectedProject?.name} advert with bold headline space, crisp UI framing, cinematic lighting, and a product-first composition that looks native to a paid social campaign.`}
              className="min-h-[180px] rounded-[1.2rem] border border-white/10 bg-black/40 px-4 py-4 text-sm leading-7 text-white outline-none transition placeholder:text-zinc-500 focus:border-amber-300/50"
            />
          </label>

          <div className="rounded-[1.7rem] border border-dashed border-white/15 bg-black/20 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                  Reference images
                </p>
                <p className="max-w-xl text-sm leading-6 text-zinc-300">
                  Add screenshots, product shots, or campaign references only
                  when they genuinely help anchor composition and brand details.
                </p>
              </div>
              <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-amber-300/30 bg-amber-300/10 px-5 py-3 text-sm font-medium text-amber-100 transition hover:border-amber-300/60 hover:bg-amber-300/15">
                Add references
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

            {references.length ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {references.map((reference) => (
                  <div
                    key={reference.id}
                    className="overflow-hidden rounded-[1.35rem] border border-white/10 bg-black/30"
                  >
                    <img
                      src={reference.previewUrl}
                      alt={reference.file.name}
                      className="aspect-[4/3] w-full object-cover"
                    />
                    <div className="flex items-center justify-between gap-3 p-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm text-white">
                          {reference.file.name}
                        </p>
                        <p className="text-xs text-zinc-500">
                          {(reference.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeReference(reference.id)}
                        className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-300 transition hover:border-white/30 hover:text-white"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-[1.3rem] border border-white/10 bg-black/20 px-4 py-6 text-sm text-zinc-500">
                No references loaded yet.
              </div>
            )}
          </div>

          {error ? (
            <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {error}
            </p>
          ) : null}

          <div className="flex flex-col gap-4 rounded-[1.6rem] border border-white/10 bg-black/30 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-500">
                Generate
              </p>
              <p className="text-sm text-zinc-300">
                {isRefreshing
                  ? "Refreshing the saved library."
                  : "One clean prompt. One fast advert."}
              </p>
            </div>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={generatorDisabled || isGenerating || !prompt.trim()}
              className="inline-flex items-center justify-center rounded-full bg-amber-300 px-6 py-3 text-sm font-semibold text-black transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-300"
            >
              {isGenerating ? "Generating advert..." : "Generate advert"}
            </button>
          </div>
        </div>
      </section>

      <aside className="flex flex-col gap-6">
        <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-5">
          <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
            Studio status
          </p>
          <div className="mt-5 grid gap-3">
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-300">
              <span>Blob storage</span>
              <span className={hasBlob ? "text-emerald-300" : "text-red-300"}>
                {hasBlob ? "Ready" : "Missing token"}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-zinc-300">
              <span>fal.ai key</span>
              <span className={hasFileAi ? "text-emerald-300" : "text-red-300"}>
                {hasFileAi ? "Ready" : "Missing key"}
              </span>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                Active model
              </p>
              <p className="mt-2 text-sm text-white">
                {getAdvertModelLabel(model)}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-5">
          <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
            Latest output
          </p>
          {latestResult?.outputs?.[0] ? (
            <div className="mt-5 space-y-4">
              <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/30">
                <img
                  src={latestResult.outputs[0].url}
                  alt="Latest generated advert"
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
              <div className="space-y-3 text-sm text-zinc-300">
                {latestResult.requestId ? (
                  <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-xs uppercase tracking-[0.22em] text-zinc-400">
                    Request ID: {latestResult.requestId}
                  </p>
                ) : null}
                {latestResult.textResponse ? (
                  <p className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 leading-6">
                    {latestResult.textResponse}
                  </p>
                ) : null}
                <a
                  href={latestResult.outputs[0].url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-100 transition hover:border-white/30 hover:text-white"
                >
                  Open full image
                </a>
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-[1.4rem] border border-dashed border-white/10 bg-black/20 px-4 py-8 text-sm leading-6 text-zinc-400">
              Your next generated advert will appear here.
            </div>
          )}
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-5">
          <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
            Workflow
          </p>
          <div className="mt-4 space-y-3 text-sm leading-6 text-zinc-300">
            <p>1. Pick the product and model.</p>
            <p>2. Add a concise campaign brief.</p>
            <p>3. Drop in references only when they help.</p>
            <p>4. Generate, review, and keep the winners.</p>
          </div>
        </section>
      </aside>
    </div>
  );
}
