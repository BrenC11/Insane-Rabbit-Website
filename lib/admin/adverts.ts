import { list } from "@vercel/blob";
import { getProjectBySlug, projects } from "@/data/projects";
import { getBlobAccessFromUrl, toAdminBlobUrl } from "@/lib/admin/blob";

export const DEFAULT_ADVERT_MODEL = "fal-ai/nano-banana-2";
export const MAX_REFERENCE_IMAGE_COUNT = 14;
export const MAX_REFERENCE_IMAGE_BYTES = 4 * 1024 * 1024;
export const MAX_PROMPT_LENGTH = 3000;

export const advertModelOptions = [
  {
    value: "fal-ai/nano-banana-2",
    label: "Nano Banana 2",
    editModel: "fal-ai/nano-banana-2/edit",
    description: "Fast, versatile image generation with text prompts and references."
  },
  {
    value: "fal-ai/nano-banana-pro",
    label: "Nano Banana Pro",
    editModel: "fal-ai/nano-banana-pro/edit",
    description: "Higher-end generation for more polished campaign outputs."
  }
] as const;

export const aspectRatioOptions = [
  {
    value: "auto",
    label: "Auto",
    description: "Let Nano Banana 2 infer the strongest framing from the brief."
  },
  {
    value: "1:1",
    label: "Square",
    description: "Balanced creative for social tiles and product cards."
  },
  {
    value: "4:5",
    label: "Portrait Feed",
    description: "Good for Instagram feed posts and static paid ads."
  },
  {
    value: "9:16",
    label: "Story Vertical",
    description: "Built for reels, stories, and full-screen mobile placements."
  },
  {
    value: "16:9",
    label: "Landscape",
    description: "Useful for headers, YouTube promos, and web hero ads."
  },
  {
    value: "3:2",
    label: "Poster",
    description: "A cinematic frame that works well for launch artwork."
  }
] as const;

export const advertStyleOptions = [
  {
    value: "feature-splash",
    label: "Feature Splash",
    guidance:
      "Lead with the main product benefit and make the ad feel crisp and modern."
  },
  {
    value: "launch-poster",
    label: "Launch Poster",
    guidance:
      "Build a bold campaign visual with high contrast, strong hierarchy, and hype."
  },
  {
    value: "lifestyle-campaign",
    label: "Lifestyle Campaign",
    guidance:
      "Show the product in use with a scene that sells the feeling around it."
  },
  {
    value: "app-store-promo",
    label: "App Promo",
    guidance:
      "Make the creative feel polished, legible, and app-marketing ready."
  },
  {
    value: "brand-experiment",
    label: "Brand Experiment",
    guidance:
      "Push the visual style further while keeping the brand and offer clear."
  }
] as const;

export type AspectRatioOption = (typeof aspectRatioOptions)[number]["value"];
export type AdvertStyleOption = (typeof advertStyleOptions)[number]["value"];
export type AdvertModelOption = (typeof advertModelOptions)[number]["value"];
export type ResolutionOption = "1K" | "2K" | "4K";

export type UploadedReference = {
  contentType: string;
  pathname: string;
  url: string;
};

export type AdvertLibraryItem = {
  pathname: string;
  projectName: string;
  projectSlug: string;
  uploadedAt: string;
  url: string;
};

export type AdvertLibrarySection = {
  items: AdvertLibraryItem[];
  projectName: string;
  projectSlug: string;
};

export function getAdvertModelConfig(model: AdvertModelOption) {
  return (
    advertModelOptions.find((option) => option.value === model) ??
    advertModelOptions[0]
  );
}

export function getAdvertModelLabel(model: AdvertModelOption) {
  return getAdvertModelConfig(model).label;
}

export function getDefaultAdvertModel() {
  const envModel = process.env.FAL_DEFAULT_ADVERT_MODEL?.trim();

  if (
    envModel &&
    advertModelOptions.some((option) => option.value === envModel)
  ) {
    return envModel as AdvertModelOption;
  }

  return DEFAULT_ADVERT_MODEL;
}

export function isBlobConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export function isFileAiConfigured() {
  return Boolean(
    process.env.FAL_KEY?.trim() ||
    process.env.FAL_KEY_ID?.trim() ||
    process.env.FAL_API_KEY?.trim() ||
    process.env.FILE_API_KEY?.trim() ||
    process.env.FILE_AI_API_KEY?.trim()
  );
}

export function getFileAiApiKey() {
  if (process.env.FAL_KEY_ID?.trim() && process.env.FAL_KEY_SECRET?.trim()) {
    return `${process.env.FAL_KEY_ID.trim()}:${process.env.FAL_KEY_SECRET.trim()}`;
  }

  return (
    process.env.FAL_KEY?.trim() ||
    process.env.FAL_API_KEY?.trim() ||
    process.env.FILE_API_KEY?.trim() ||
    process.env.FILE_AI_API_KEY?.trim() ||
    ""
  );
}

export function getAdvertStyleLabel(style: AdvertStyleOption) {
  return (
    advertStyleOptions.find((option) => option.value === style)?.label ??
    "Custom"
  );
}

export function getAspectRatioLabel(aspectRatio: AspectRatioOption) {
  return (
    aspectRatioOptions.find((option) => option.value === aspectRatio)?.label ??
    aspectRatio
  );
}

export function sanitizeFileSegment(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function getFileExtension(
  filename: string | null,
  contentType: string | null
) {
  const lowerFilename = filename?.toLowerCase() ?? "";

  if (lowerFilename.endsWith(".png") || contentType === "image/png") {
    return "png";
  }

  if (
    lowerFilename.endsWith(".jpg") ||
    lowerFilename.endsWith(".jpeg") ||
    contentType === "image/jpeg"
  ) {
    return "jpg";
  }

  if (lowerFilename.endsWith(".webp") || contentType === "image/webp") {
    return "webp";
  }

  if (lowerFilename.endsWith(".heic") || contentType === "image/heic") {
    return "heic";
  }

  if (lowerFilename.endsWith(".heif") || contentType === "image/heif") {
    return "heif";
  }

  return "bin";
}

export function createAdvertBlobPath(
  projectSlug: string,
  kind: "generated" | "manifests" | "references",
  filename: string
) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const safeProject = sanitizeFileSegment(projectSlug);
  const safeFilename = sanitizeFileSegment(filename) || crypto.randomUUID();

  return `admin/adverts/${safeProject}/${kind}/${timestamp}-${safeFilename}`;
}

export function buildAdvertPrompt({
  aspectRatio,
  includeProjectBrief,
  projectSlug,
  prompt,
  style
}: {
  aspectRatio: AspectRatioOption;
  includeProjectBrief: boolean;
  projectSlug: string;
  prompt: string;
  style: AdvertStyleOption;
}) {
  const project = getProjectBySlug(projectSlug);
  const styleOption = advertStyleOptions.find((option) => option.value === style);

  if (!project || !styleOption) {
    throw new Error("Unknown project or style preset.");
  }

  const projectSummary = project.shortDescription ?? project.description;
  const promptParts = [
    `Create a polished ad creative for ${project.name}.`,
    `Platform: ${project.platform}.`,
    `Creative direction: ${styleOption.guidance}`,
    `Target aspect ratio: ${aspectRatio}.`
  ];

  if (includeProjectBrief) {
    promptParts.push(`Project context: ${projectSummary}`);
  }

  promptParts.push(
    "Treat any uploaded images as reference material to preserve composition, brand cues, or product details when relevant.",
    "The result should feel campaign-ready, premium, and legible at a glance.",
    "Avoid watermarks, low-resolution artifacts, extra fingers, messy typography, and cluttered layouts.",
    `User brief: ${prompt.trim()}`
  );

  return promptParts.join("\n");
}

export async function listAdvertLibrarySections() {
  if (!isBlobConfigured()) {
    return [] as AdvertLibrarySection[];
  }

  const { blobs } = await list({
    limit: 200,
    prefix: "admin/adverts/"
  });

  const sections = new Map<string, AdvertLibrarySection>();

  for (const project of projects) {
    sections.set(project.slug, {
      items: [],
      projectName: project.name,
      projectSlug: project.slug
    });
  }

  for (const blob of blobs) {
    if (!blob.pathname.includes("/generated/")) {
      continue;
    }

    const segments = blob.pathname.split("/");
    const projectSlug = segments[2];

    if (!projectSlug) {
      continue;
    }

    const project = getProjectBySlug(projectSlug);

    if (!project) {
      continue;
    }

    const section = sections.get(projectSlug);

    if (!section) {
      continue;
    }

    section.items.push({
      pathname: blob.pathname,
      projectName: project.name,
      projectSlug,
      uploadedAt: new Date(blob.uploadedAt).toISOString(),
      url: toAdminBlobUrl(
        blob.pathname,
        getBlobAccessFromUrl(blob.url),
        blob.url
      )
    });
  }

  return Array.from(sections.values())
    .map((section) => ({
      ...section,
      items: section.items.sort((left, right) =>
        right.uploadedAt.localeCompare(left.uploadedAt)
      )
    }))
    .filter((section) => section.items.length > 0);
}
