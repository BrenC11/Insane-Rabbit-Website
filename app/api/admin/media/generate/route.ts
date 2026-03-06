import { fal } from "@fal-ai/client";
import { NextRequest, NextResponse } from "next/server";
import { getProjectBySlug } from "@/data/projects";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import {
  putAdminBlob,
  toAdminBlobDownloadUrl,
  toAdminBlobUrl
} from "@/lib/admin/blob";
import {
  buildAdvertPrompt,
  createAdvertBlobPath,
  getAdvertModelConfig,
  getAdvertModelLabel,
  getAdvertStyleLabel,
  getAspectRatioLabel,
  getFileAiApiKey,
  getFileExtension,
  isBlobConfigured,
  isFileAiConfigured,
  MAX_PROMPT_LENGTH,
  MAX_REFERENCE_IMAGE_COUNT,
  type AdvertModelOption,
  type AdvertStyleOption,
  type AspectRatioOption,
  type ResolutionOption,
  type UploadedReference
} from "@/lib/admin/adverts";

export const runtime = "nodejs";

type GenerateAdvertBody = {
  aspectRatio: AspectRatioOption;
  includeProjectBrief?: boolean;
  model: AdvertModelOption;
  prompt: string;
  projectSlug: string;
  references: UploadedReference[];
  resolution?: ResolutionOption;
  style: AdvertStyleOption;
};

type FalGeneratedImage = {
  content_type?: string;
  file_name?: string;
  url: string;
};

type FalGenerateResult = {
  data?: {
    description?: string;
    images?: FalGeneratedImage[];
  };
  requestId?: string;
};

function buildFalInput({
  aspectRatio,
  prompt,
  references,
  resolution
}: {
  aspectRatio: AspectRatioOption;
  prompt: string;
  references: UploadedReference[];
  resolution: ResolutionOption;
}) {
  const normalizedAspectRatio = aspectRatio === "auto" ? undefined : aspectRatio;

  return {
    ...(normalizedAspectRatio ? { aspect_ratio: normalizedAspectRatio } : {}),
    ...(references.length
      ? { image_urls: references.map((reference) => reference.url) }
      : {}),
    num_images: 1,
    output_format: "png",
    prompt,
    resolution
  };
}

async function requestFalGeneration({
  aspectRatio,
  model,
  prompt,
  references,
  resolution
}: {
  aspectRatio: AspectRatioOption;
  model: AdvertModelOption;
  prompt: string;
  references: UploadedReference[];
  resolution: ResolutionOption;
}) {
  const modelConfig = getAdvertModelConfig(model);
  const targetModel = references.length ? modelConfig.editModel : modelConfig.value;

  fal.config({
    credentials: getFileAiApiKey()
  });

  const result = (await fal.subscribe(targetModel, {
    input: buildFalInput({
      aspectRatio,
      prompt,
      references,
      resolution
    }),
    logs: true
  })) as FalGenerateResult;

  return {
    description: result.data?.description ?? "",
    images: result.data?.images ?? [],
    model: modelConfig.value,
    requestId: result.requestId ?? ""
  };
}

async function fetchGeneratedAsset(image: FalGeneratedImage) {
  const response = await fetch(image.url);

  if (!response.ok) {
    throw new Error("The generated image could not be downloaded from fal.ai.");
  }

  const arrayBuffer = await response.arrayBuffer();

  return {
    buffer: Buffer.from(arrayBuffer),
    contentType:
      image.content_type || response.headers.get("content-type") || "image/png"
  };
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated(request.cookies)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!isBlobConfigured()) {
    return NextResponse.json(
      { error: "BLOB_READ_WRITE_TOKEN is missing." },
      { status: 503 }
    );
  }

  if (!isFileAiConfigured()) {
    return NextResponse.json(
      {
        error: "Set FAL_KEY before generating adverts with Nano Banana."
      },
      { status: 503 }
    );
  }

  const body = (await request.json()) as GenerateAdvertBody;
  const project = getProjectBySlug(body.projectSlug);
  const prompt = body.prompt?.trim() ?? "";
  const references = Array.isArray(body.references) ? body.references : [];
  const resolution = body.resolution ?? "2K";

  if (!project) {
    return NextResponse.json({ error: "Unknown project." }, { status: 400 });
  }

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
  }

  if (prompt.length > MAX_PROMPT_LENGTH) {
    return NextResponse.json(
      { error: "Prompt is too long. Keep it under 3000 characters." },
      { status: 400 }
    );
  }

  if (references.length > MAX_REFERENCE_IMAGE_COUNT) {
    return NextResponse.json(
      {
        error: `Use up to ${MAX_REFERENCE_IMAGE_COUNT} reference images per advert.`
      },
      { status: 400 }
    );
  }

  try {
    const promptText = buildAdvertPrompt({
      aspectRatio: body.aspectRatio,
      includeProjectBrief: Boolean(body.includeProjectBrief),
      projectSlug: body.projectSlug,
      prompt,
      style: body.style
    });
    const result = await requestFalGeneration({
      aspectRatio: body.aspectRatio,
      model: body.model,
      prompt: promptText,
      references,
      resolution
    });

    if (!result.images.length) {
      return NextResponse.json(
        {
          error:
            "Nano Banana returned no image output. Try a more explicit brief or fewer references."
        },
        { status: 502 }
      );
    }

    const outputs = await Promise.all(
      result.images.map(async (image, index) => {
        const generated = await fetchGeneratedAsset(image);
        const extension = getFileExtension(
          image.file_name ?? null,
          generated.contentType
        );
        const pathname = `${createAdvertBlobPath(
          project.slug,
          "generated",
          `${project.slug}-advert-${index + 1}`
        )}.${extension}`;
        const stored = await putAdminBlob(
          pathname,
          generated.buffer,
          generated.contentType
        );

        return {
          contentType: stored.blob.contentType,
          downloadUrl: toAdminBlobDownloadUrl(
            stored.blob.pathname,
            stored.access,
            stored.blob.downloadUrl
          ),
          pathname: stored.blob.pathname,
          url: toAdminBlobUrl(stored.blob.pathname, stored.access, stored.blob.url)
        };
      })
    );

    const manifestPath = `${createAdvertBlobPath(
      project.slug,
      "manifests",
      `${project.slug}-advert-manifest`
    )}.json`;

    await putAdminBlob(
      manifestPath,
      JSON.stringify(
        {
          aspectRatio: body.aspectRatio,
          aspectRatioLabel: getAspectRatioLabel(body.aspectRatio),
          generatedAt: new Date().toISOString(),
          includeProjectBrief: Boolean(body.includeProjectBrief),
          model: result.model,
          modelLabel: getAdvertModelLabel(result.model),
          outputs,
          prompt,
          promptText,
          projectName: project.name,
          projectSlug: project.slug,
          references,
          requestId: result.requestId,
          resolution,
          textResponse: result.description,
          style: body.style,
          styleLabel: getAdvertStyleLabel(body.style)
        },
        null,
        2
      ),
      "application/json"
    );

    return NextResponse.json({
      model: result.model,
      outputs,
      requestId: result.requestId,
      textResponse: result.description
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Generation failed unexpectedly.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
