import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { deleteAdvertAsset } from "@/lib/admin/adverts";

export const runtime = "nodejs";

type DeleteAdvertBody = {
  manifestPathname?: string;
  outputPathname?: string;
};

export async function DELETE(request: NextRequest) {
  if (!isAdminAuthenticated(request.cookies)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as DeleteAdvertBody;

  if (!body.outputPathname?.trim()) {
    return NextResponse.json(
      { error: "Missing output pathname." },
      { status: 400 }
    );
  }

  try {
    await deleteAdvertAsset({
      manifestPathname: body.manifestPathname?.trim() || undefined,
      outputPathname: body.outputPathname.trim()
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Delete failed unexpectedly."
      },
      { status: 500 }
    );
  }
}
