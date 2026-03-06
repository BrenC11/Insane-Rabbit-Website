import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { getAdminBlob, type BlobAccessMode } from "@/lib/admin/blob";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!isAdminAuthenticated(request.cookies)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const pathname = searchParams.get("pathname")?.trim() ?? "";
  const access = (searchParams.get("access")?.trim() ?? "private") as BlobAccessMode;
  const shouldDownload = searchParams.get("download") === "1";

  if (!pathname) {
    return NextResponse.json({ error: "Missing pathname." }, { status: 400 });
  }

  if (access !== "private" && access !== "public") {
    return NextResponse.json({ error: "Invalid blob access mode." }, { status: 400 });
  }

  const result = await getAdminBlob(pathname, access);

  if (!result) {
    return NextResponse.json({ error: "Blob not found." }, { status: 404 });
  }

  if (result.statusCode === 304 || !result.stream) {
    return new NextResponse(null, { status: 304 });
  }

  return new NextResponse(result.stream, {
    headers: {
      "cache-control": result.blob.cacheControl || "private, max-age=0, must-revalidate",
      "content-disposition": shouldDownload
        ? `attachment; filename="${pathname.split("/").pop() || "file"}"`
        : result.blob.contentDisposition || "inline",
      "content-type": result.blob.contentType || "application/octet-stream"
    }
  });
}
