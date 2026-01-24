"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { projects } from "../data/projects";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const firstItemRef = useRef<HTMLAnchorElement | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!menuRef.current || menuRef.current.contains(event.target as Node)) {
        return;
      }
      setIsOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      requestAnimationFrame(() => firstItemRef.current?.focus());
    }

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <header className="border-b border-white/10 bg-ink/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-white">
          Insane Rabbit
        </Link>
        <nav className="flex items-center gap-6 text-sm text-zinc-200">
          <div ref={menuRef} className="relative">
            <button
              ref={buttonRef}
              className="flex items-center gap-2 text-sm text-zinc-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70"
              aria-haspopup="true"
              aria-expanded={isOpen}
              aria-controls="projects-menu"
              type="button"
              onClick={() => setIsOpen((open) => !open)}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  setIsOpen(true);
                }
              }}
            >
              Projects
              <span className="text-xs text-zinc-400">v</span>
            </button>
            <div
              id="projects-menu"
              role="menu"
              aria-label="Projects"
              className={`absolute right-0 top-8 w-56 rounded-md border border-white/10 bg-ink/95 p-2 text-sm text-zinc-100 shadow-lg transition ${
                isOpen
                  ? "visible opacity-100"
                  : "invisible pointer-events-none opacity-0"
              }`}
            >
              {projects.map((project) => (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className="block rounded px-3 py-2 text-zinc-200 hover:bg-white/5 hover:text-white"
                  onClick={() => setIsOpen(false)}
                  role="menuitem"
                  tabIndex={isOpen ? 0 : -1}
                  ref={project.slug === projects[0]?.slug ? firstItemRef : undefined}
                >
                  {project.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
