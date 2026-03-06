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
  const [includeProjectBrief, setIncludeProjectBrief] = useState(false);
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
      `/api/admin/media/upload?projectSlug=${encodeURIComponent(
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
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_22rem]">
      <section className="rounded-[1.6rem] border border-white/10 bg-black/20 p-4">
        <div className="grid gap-3 lg:grid-cols-5">
          <select
            value={projectSlug}
            onChange={handleProjectChange}
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30"
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
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30"
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
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30"
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
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30"
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
            className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30"
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
            Add project brief to prompt
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

        <div className="mt-4 rounded-[1.25rem] border border-white/10 bg-black/30 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
            Project brief
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-300">
            {selectedProject?.shortDescription ?? selectedProject?.description}
          </p>
        </div>

        <textarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          rows={8}
          placeholder="Prompt"
          className="mt-4 min-h-[220px] w-full rounded-[1.25rem] border border-white/10 bg-black/30 px-4 py-4 text-sm leading-7 text-white outline-none transition placeholder:text-zinc-600 focus:border-white/30"
        />

        <div className="mt-4 rounded-[1.25rem] border border-dashed border-white/10 bg-black/20 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-zinc-300">
              References {references.length ? `(${references.length})` : ""}
            </p>
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

          {references.length ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {references.map((reference) => (
                <div
                  key={reference.id}
                  className="overflow-hidden rounded-[1rem] border border-white/10 bg-black/30"
                >
                  <img
                    src={reference.previewUrl}
                    alt={reference.file.name}
                    className="aspect-square w-full object-cover"
                  />
                  <div className="flex items-center justify-between gap-2 p-2">
                    <p className="truncate text-xs text-zinc-300">
                      {reference.file.name}
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
          <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </p>
        ) : null}

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="text-xs text-zinc-500">
            {isRefreshing ? "Refreshing library..." : prompt.length ? `${prompt.length} chars` : ""}
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
          {latestResult?.outputs?.[0] ? (
            <div className="space-y-3">
              <div className="overflow-hidden rounded-[1.1rem] border border-white/10 bg-black/30">
                <img
                  src={latestResult.outputs[0].url}
                  alt="Latest generated advert"
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
              <div className="flex gap-2">
                <a
                  href={latestResult.outputs[0].url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-100 transition hover:border-white/30"
                >
                  Open
                </a>
                {latestResult.requestId ? (
                  <div className="inline-flex rounded-full border border-white/10 px-4 py-2 text-xs text-zinc-500">
                    {latestResult.requestId}
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="rounded-[1.1rem] border border-dashed border-white/10 bg-black/20 px-4 py-12 text-center text-sm text-zinc-500">
              No output yet
            </div>
          )}
        </section>
      </aside>
    </div>
  );
}
