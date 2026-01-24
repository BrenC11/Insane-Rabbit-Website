import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProjectBySlug, projects } from "../../../data/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export function generateMetadata({
  params
}: {
  params: { slug: string };
}): Metadata {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    return {
      title: "Project not found"
    };
  }

  const description = project.shortDescription ?? project.description;

  return {
    title: project.name,
    description,
    openGraph: {
      title: project.name,
      description,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "Insane Rabbit"
        }
      ]
    },
    twitter: {
      title: project.name,
      description,
      images: ["/opengraph-image"]
    }
  };
}

export default function ProjectPage({
  params
}: {
  params: { slug: string };
}) {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-16">
      <section className="flex flex-col gap-4">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Project
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-4xl font-semibold text-white sm:text-5xl">
            {project.name}
          </h1>
          <span className="text-sm text-zinc-400">{project.platform}</span>
        </div>
        <p className="max-w-3xl text-lg text-zinc-300">
          {project.description}
        </p>
        {project.websiteUrl ? (
          <a
            href={project.websiteUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-zinc-300 transition hover:text-white"
          >
            Visit website
          </a>
        ) : null}
        {project.slug === "who-were-you" ? (
          <details className="text-sm text-zinc-300">
            <summary className="flex cursor-pointer items-center gap-2 text-zinc-400 transition hover:text-white">
              Support
              <span className="text-xs">v</span>
            </summary>
            <div className="mt-4 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <p className="text-base font-semibold text-white">
                  Who Were You? - Support &amp; Help
                </p>
                <p>
                  Welcome to Who Were You? This app helps you quickly see
                  recently added contacts on your iPhone, so you can remember
                  who someone is and follow up at the right time.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-base font-semibold text-white">Quick Start</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    Allow Contacts Access: When prompted, tap Allow so the app
                    can read your contacts locally on your device.
                  </li>
                  <li>
                    Choose a Filter: Use Today, Yesterday, Last 7 Days, Last 30
                    Days, or Custom to narrow the list.
                  </li>
                  <li>
                    Tap a Contact: View details and take quick actions like call
                    or message.
                  </li>
                  <li>
                    Set a Follow-Up Reminder: Add a reminder to text/call later
                    (optional notification).
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-base font-semibold text-white">
                  How &quot;Recently Added&quot; Works
                </p>
                <p>
                  iOS does not provide a perfect &quot;date added&quot; for
                  every contact. Who Were You? uses the best available on-device
                  signals to estimate when a contact was added and then improves
                  accuracy over time as the app runs.
                </p>
                <p>
                  Important: The most accurate tracking happens from the point
                  you start using the app.
                </p>
                <p>
                  If results ever look off, you can reset local tracking in the
                  app (see below).
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-base font-semibold text-white">Reminders</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    Follow-up reminders help you remember to text or call
                    someone later.
                  </li>
                  <li>
                    Reminders stay in the app until you delete them (they will
                    not disappear automatically).
                  </li>
                  <li>
                    If notifications are enabled, you will receive an alert when
                    a reminder is due.
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-base font-semibold text-white">
                  Subscriptions / Pro (if enabled)
                </p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    Free users may have limits (for example: fewer contacts
                    shown, fewer filters, or reminder limits).
                  </li>
                  <li>Pro unlocks the full feature set.</li>
                </ul>
                <p>If a purchase does not unlock Pro immediately:</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    Make sure you are signed into the correct Apple ID on your
                    device.
                  </li>
                  <li>Try Restore Purchases in the paywall.</li>
                  <li>Close and reopen the app.</li>
                </ul>
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-base font-semibold text-white">
                  Troubleshooting
                </p>
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="font-semibold text-white">
                      I cannot see any contacts
                    </p>
                    <ul className="mt-2 list-disc space-y-2 pl-5">
                      <li>
                        Check iPhone Settings -&gt; Privacy &amp; Security -&gt;
                        Contacts -&gt; enable access for Who Were You?.
                      </li>
                      <li>Reopen the app and pull to refresh.</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      The filters are not showing what I expect
                    </p>
                    <ul className="mt-2 list-disc space-y-2 pl-5">
                      <li>Recently-added tracking improves over time.</li>
                      <li>
                        Go to Settings in the app -&gt; Reset &quot;Recently
                        Added&quot; Tracking (this clears local history and
                        starts fresh).
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      Reminders are not notifying me
                    </p>
                    <ul className="mt-2 list-disc space-y-2 pl-5">
                      <li>
                        Check iPhone Settings -&gt; Notifications -&gt; Who Were
                        You? -&gt; allow notifications.
                      </li>
                      <li>
                        Make sure Focus/Do Not Disturb is not silencing alerts.
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      Background refresh
                    </p>
                    <p className="mt-2">
                      If enabled, iOS may still delay or skip background runs to
                      save battery. Opening the app periodically helps keep
                      tracking current.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </details>
        ) : null}
      </section>

      <section className="border-t border-white/10 pt-8">
        <h2 className="text-sm uppercase tracking-[0.3em] text-zinc-500">
          About
        </h2>
        <p className="mt-4 text-base text-zinc-300">
          {project.name} is part of the Insane Rabbit product lineup. We focus on
          clarity, utility, and responsible software design. Details will evolve
          as the product grows.
        </p>
      </section>

      <section className="border-t border-white/10 pt-8">
        <h2 className="text-sm uppercase tracking-[0.3em] text-zinc-500">
          Policies
        </h2>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-zinc-300">
          <Link
            href={`/projects/${project.slug}/privacy`}
            className="transition hover:text-white"
          >
            Privacy Policy
          </Link>
          <Link
            href={`/projects/${project.slug}/terms`}
            className="transition hover:text-white"
          >
            Terms
          </Link>
        </div>
      </section>
    </div>
  );
}
