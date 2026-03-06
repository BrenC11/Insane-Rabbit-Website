import { fal } from "@fal-ai/client";
import { NextRequest, NextResponse } from "next/server";
import { getProjectBySlug } from "@/data/projects";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { putAdminBlob, toAdminBlobUrl } from "@/lib/admin/blob";
import {
  createAdvertBlobPath,
  getFileAiApiKey,
  getFileExtension,
  isBlobConfigured,
  isFileAiConfigured,
  MAX_REFERENCE_IMAGE_BYTES
} from "@/lib/admin/adverts";

export const runtime = "nodejs";

export async function PUT(request: NextRequest) {
  if (!isAdminAuthenticated(request.cookies)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (!isFileAiConfigured()) {
    return NextResponse.json(
      { error: "Set FAL_KEY before uploading reference images." },
      { status: 503 }
    );
  }

  if (!isBlobConfigured()) {
    return NextResponse.json(
      { error: "BLOB_READ_WRITE_TOKEN is missing." },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const projectSlug = searchParams.get("projectSlug")?.trim() ?? "";
  const filename = searchParams.get("filename");
  const contentType = request.headers.get("content-type");
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  const project = getProjectBySlug(projectSlug);

  if (!project) {
    return NextResponse.json({ error: "Unknown project." }, { status: 400 });
  }

  if (!contentType?.startsWith("image/")) {
    return NextResponse.json(
      { error: "Reference uploads must be image files." },
      { status: 400 }
    );
  }

  if (contentLength > MAX_REFERENCE_IMAGE_BYTES) {
    return NextResponse.json(
      {
        error: "Reference images must be 4 MB or smaller per file."
      },
      { status: 413 }
    );
  }

  try {
    const arrayBuffer = await request.arrayBuffer();

    if (!arrayBuffer.byteLength) {
      return NextResponse.json(
        { error: "Missing upload body." },
        { status: 400 }
      );
    }

    const extension = getFileExtension(filename, contentType);
    const safeFilename = filename?.trim()
      ? filename.trim()
      : `reference-image.${extension}`;
    const baseFilename =
      safeFilename.replace(/\.[^.]+$/, "") || `reference-image-${Date.now()}`;

    fal.config({
      credentials: getFileAiApiKey()
    });

    const file = new File([arrayBuffer], safeFilename, {
      type: contentType
    });
    const url = await fal.storage.upload(file);
    const storagePathname = `${createAdvertBlobPath(
      projectSlug,
      "references",
      baseFilename
    )}.${extension}`;
    const storedReference = await putAdminBlob(
      storagePathname,
      Buffer.from(arrayBuffer),
      contentType
    );
    const referenceManifestPath = `${createAdvertBlobPath(
      projectSlug,
      "reference-manifests",
      baseFilename
    )}.json`;

    await putAdminBlob(
      referenceManifestPath,
      JSON.stringify(
        {
          contentType,
          falUrl: url,
          name: safeFilename,
          projectName: project.name,
          projectSlug,
          storageAccess: storedReference.access,
          storagePathname: storedReference.blob.pathname,
          uploadedAt: new Date().toISOString()
        },
        null,
        2
      ),
      "application/json"
    );

    return NextResponse.json({
      contentType,
      name: safeFilename,
      pathname: storedReference.blob.pathname,
      previewUrl: toAdminBlobUrl(
        storedReference.blob.pathname,
        storedReference.access,
        storedReference.blob.url
      ),
      storageAccess: storedReference.access,
      storagePathname: storedReference.blob.pathname,
      url
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Reference upload failed."
      },
      { status: 500 }
    );
  }
}
