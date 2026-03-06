import { fal } from "@fal-ai/client";
import { NextRequest, NextResponse } from "next/server";
import { getProjectBySlug } from "@/data/projects";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import {
  getFileAiApiKey,
  getFileExtension,
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

  const { searchParams } = new URL(request.url);
  const projectSlug = searchParams.get("projectSlug")?.trim() ?? "";
  const filename = searchParams.get("filename");
  const contentType = request.headers.get("content-type");
  const contentLength = Number(request.headers.get("content-length") ?? "0");

  if (!getProjectBySlug(projectSlug)) {
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

    fal.config({
      credentials: getFileAiApiKey()
    });

    const file = new File([arrayBuffer], safeFilename, {
      type: contentType
    });
    const url = await fal.storage.upload(file);

    return NextResponse.json({
      contentType,
      pathname: new URL(url).pathname,
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
