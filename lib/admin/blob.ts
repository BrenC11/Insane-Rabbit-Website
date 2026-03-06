import { del, get, put, type PutBlobResult } from "@vercel/blob";

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

export function toAdminBlobDownloadUrl(
  pathname: string,
  access: BlobAccessMode,
  downloadUrl: string
) {
  if (access === "public") {
    return downloadUrl;
  }

  return `/api/admin/media/blob?pathname=${encodeURIComponent(
    pathname
  )}&access=${access}&download=1`;
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

export async function deleteAdminBlob(pathname: string) {
  return del(pathname);
}

export async function readAdminBlobText(
  pathname: string,
  access: BlobAccessMode
) {
  const result = await getAdminBlob(pathname, access);

  if (!result || result.statusCode !== 200 || !result.stream) {
    return null;
  }

  return new Response(result.stream).text();
}

export async function readAdminBlobJson<T>(
  pathname: string,
  access: BlobAccessMode
) {
  const text = await readAdminBlobText(pathname, access);

  if (!text) {
    return null;
  }

  return JSON.parse(text) as T;
}
