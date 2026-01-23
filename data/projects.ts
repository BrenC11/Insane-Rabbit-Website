export type Project = {
  slug: string;
  name: string;
  description: string;
  platform: "Web App" | "iOS App";
  privacyPolicy: string;
  terms: string;
};

export const projects: Project[] = [
  {
    slug: "scriptforge",
    name: "ScriptForge",
    description:
      "AI-powered screenwriting analysis platform for screenplay feedback, coverage, and evaluation.",
    platform: "Web App",
    privacyPolicy:
      "ScriptForge respects user privacy and only collects data needed to operate the service. This placeholder will be replaced with the official policy.",
    terms:
      "By using ScriptForge, you agree to the standard terms of service for the platform. This placeholder will be replaced with the official terms."
  },
  {
    slug: "timecam",
    name: "TimeCam.ai",
    description:
      "iPhone app that lets users take photos and explore the same location across different points in time.",
    platform: "iOS App",
    privacyPolicy:
      "TimeCam.ai collects only the minimum data required to provide app functionality. This placeholder will be replaced with the official policy.",
    terms:
      "By using TimeCam.ai, you agree to the standard terms of the app. This placeholder will be replaced with the official terms."
  },
  {
    slug: "who-were-you",
    name: "Who Were You",
    description:
      "iPhone app that helps users identify recently added contacts by date - useful for networking and events.",
    platform: "iOS App",
    privacyPolicy:
      "Who Were You only accesses contacts with user permission and does not sell data. This placeholder will be replaced with the official policy.",
    terms:
      "By using Who Were You, you agree to the standard terms of the app. This placeholder will be replaced with the official terms."
  }
];

export const getProjectBySlug = (slug: string) =>
  projects.find((project) => project.slug === slug);
