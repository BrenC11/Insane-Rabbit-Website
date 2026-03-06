import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { getProjectBySlug } from "@/data/projects";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import {
  createAdvertBlobPath,
  getFileExtension,
  isBlobConfigured,
  MAX_REFERENCE_IMAGE_BYTES
} from "@/lib/admin/adverts";

export const runtime = "nodejs";

export async function PUT(request: NextRequest) {
  if (!isAdminAuthenticated(request.cookies)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
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

  if (!request.body) {
    return NextResponse.json({ error: "Missing upload body." }, { status: 400 });
  }

  const extension = getFileExtension(filename, contentType);
  const pathname = `${createAdvertBlobPath(
    projectSlug,
    "references",
    filename ?? "reference-image"
  )}.${extension}`;
  const blob = await put(pathname, request.body, {
    access: "public",
    addRandomSuffix: false,
    contentType
  });

  return NextResponse.json({
    contentType: blob.contentType,
    pathname: blob.pathname,
    url: blob.url
  });
}
