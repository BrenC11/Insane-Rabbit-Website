"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm({
  isConfigured
}: {
  isConfigured: boolean;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isConfigured || isSubmitting) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/session", {
        body: JSON.stringify({ password }),
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST"
      });
      const json = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(json.error ?? "Login failed.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Login failed."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-[0.28em] text-zinc-500">
          Admin password
        </span>
        <input
          required
          type="password"
          name="password"
          disabled={!isConfigured || isSubmitting}
          className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-amber-300/50"
          placeholder={
            isConfigured ? "Enter the admin password" : "Set ADMIN_PASSWORD first"
          }
        />
      </label>
      {error ? (
        <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={!isConfigured || isSubmitting}
        className="rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-black transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-300"
      >
        {isSubmitting ? "Unlocking..." : "Unlock admin"}
      </button>
    </form>
  );
}
