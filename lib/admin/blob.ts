import { get, put, type PutBlobResult } from "@vercel/blob";

export type BlobAccessMode = "private" | "public";
type BlobPutBody = Parameters<typeof put>[1];

type StoredBlob = {
  access: BlobAccessMode;
  blob: PutBlobResult;
};

function isPrivateStoreAccessError(error: unknown) {
  return (
    error instanceof Error &&
    error.message.includes("Cannot use public access on a private store")
  );
}

export function getBlobAccessFromUrl(url: string): BlobAccessMode {
  return url.includes(".private.blob.vercel-storage.com/") ? "private" : "public";
}

export function toAdminBlobUrl(
  pathname: string,
  access: BlobAccessMode,
  url: string
) {
  if (access === "public") {
    return url;
  }

  return `/api/admin/media/blob?pathname=${encodeURIComponent(
    pathname
  )}&access=${access}`;
}

export async function putAdminBlob(
  pathname: string,
  body: BlobPutBody,
  contentType: string
): Promise<StoredBlob> {
  try {
    const blob = await put(pathname, body, {
      access: "public",
      addRandomSuffix: false,
      contentType
    });

    return {
      access: "public",
      blob
    };
  } catch (error) {
    if (!isPrivateStoreAccessError(error)) {
      throw error;
    }

    const blob = await put(pathname, body, {
      access: "private",
      addRandomSuffix: false,
      contentType
    });

    return {
      access: "private",
      blob
    };
  }
}

export async function getAdminBlob(pathname: string, access: BlobAccessMode) {
  return get(pathname, {
    access
  });
}
