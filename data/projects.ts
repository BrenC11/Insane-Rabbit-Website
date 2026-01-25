export type Project = {
  slug: string;
  name: string;
  description: string;
  shortDescription?: string;
  platform: "Web App" | "iOS App" | "iOS & iPad App";
  websiteUrl?: string;
  privacyPolicy: string;
  terms: string;
};

export const projects: Project[] = [
  {
    slug: "scriptforge",
    name: "ScriptForge",
    shortDescription:
      "Script Forge is an AI-powered screenwriting platform that gives writers fast, professional-grade feedback to sharpen scripts, strengthen characters, and improve story craft.",
    description:
      "Script Forge is a comprehensive AI-driven screenwriting toolkit built for writers who want clear, actionable feedback-without the guesswork. It analyses screenplays at a professional level, breaking down story structure, character agency, dialogue, pacing, and theme to highlight both strengths and weaknesses. Writers can access everything from quick coverage reports to deep, multi-page evaluations packed with practical improvement notes. Script Forge also offers specialist tools like character agency analysis, first-10-page deep dives, and visual Poster Labs that turn scripts and ideas into striking pitch-ready artwork. Designed to support consistent growth, Script Forge rewards regular writing, helps writers track progress, and provides insights that feel closer to a seasoned script reader than a generic AI. Whether you're polishing a short, developing a feature, or preparing a script for producers, Script Forge is built to help you level up faster-and with confidence.",
    platform: "Web App",
    websiteUrl: "https://www.scriptforgeapp.com",
    privacyPolicy:
      "ScriptForge respects user privacy and only collects data needed to operate the service. This placeholder will be replaced with the official policy.",
    terms:
      "By using ScriptForge, you agree to the standard terms of service for the platform. This placeholder will be replaced with the official terms."
  },
  {
    slug: "timecam",
    name: "TimeCam.ai",
    shortDescription:
      "TimeCam lets you take photos and videos and instantly see them reimagined in the past or the future. One tap. Different time.",
    description:
      "TimeCam is a creative camera app that lets you capture the present and instantly transform it into another time period - past or future. Take a photo or video, choose a time era, and TimeCam reimagines the scene as if it were captured years ago... or decades ahead. Powered by advanced AI, TimeCam preserves the original composition of your image while changing the world around it - architecture, atmosphere, lighting, and subtle details evolve to match the selected era. From nostalgic past aesthetics to speculative futures, every result feels cinematic and grounded in the original moment. TimeCam is built for creators, storytellers, and anyone curious about how the same moment might look across time. Whether you're experimenting, world-building, or just having fun, TimeCam turns everyday photos into time-travel snapshots. Capture now. See then. Explore what's next.",
    platform: "iOS App",
    websiteUrl: "https://www.timecam.ai",
    privacyPolicy:
      "TimeCam.ai collects only the minimum data required to provide app functionality. This placeholder will be replaced with the official policy.",
    terms:
      "By using TimeCam.ai, you agree to the standard terms of the app. This placeholder will be replaced with the official terms."
  },
  {
    slug: "dive-bar-finder",
    name: "Dive Bar Finder",
    shortDescription:
      "Dive Bar Finder helps you discover nearby dive bars - rock, metal, goth, and alternative spots - using your location to surface the right places fast.",
    description:
      "Dive Bar Finder is an iOS location discovery app built for people who want the real places - dive bars with rock, metal, goth, and alternative vibes. Open the app, see what’s nearby, and explore bars around you without endless searching. It’s designed to make finding your next haunt quick, local, and effortless.",
    platform: "iOS App",
    privacyPolicy: `DIVE BAR FINDER - PRIVACY POLICY

Last updated: 25 January 2026

Dive Bar Finder ("the App") respects your privacy. This Privacy Policy explains how data is handled when you use the App.

1. Information We Collect

a. Location Data

Dive Bar Finder uses your location to show nearby bars.
- Location access is only used if you grant permission
- You can use the App with limited functionality without precise location by denying permission (where supported)
- The App may use approximate and/or precise location depending on the permission you choose

b. Search and Usage Data

The App may process basic usage information (such as which screens are used) to improve stability and user experience.

c. Crash and Performance Data

We may collect anonymised crash logs and performance diagnostics to improve reliability.

2. How Your Data Is Used

We use data only to:
- Show bars near you and improve relevance of results
- Improve app performance and fix bugs
- Provide customer support if you contact us

3. Data Storage and Sharing
- We do not sell your personal data
- We do not share your personal data with third parties for advertising
- Any data stored is limited to what is necessary for core functionality and performance

4. Third-Party Services

The App may rely on Apple and mapping/location services (for example, Apple Maps) to provide location-based results. These services are governed by their own privacy policies.

5. Your Choices
- You can change location permissions at any time in iOS Settings
- You can delete the App to remove locally stored app data

6. Children's Privacy

Dive Bar Finder is not intended for children under 13 and does not knowingly collect personal data from children.

7. Changes

We may update this policy from time to time. Continued use of the App means you accept the updated policy.

8. Contact

If you have questions about privacy, contact:`,
    terms: `DIVE BAR FINDER - TERMS OF USE

Last updated: 25 January 2026

By downloading, accessing, or using Dive Bar Finder ("the App"), you agree to these Terms of Use.

1. The Service

Dive Bar Finder helps users discover bars and venues based on location and availability of public data sources. Results may be incomplete, outdated, or inaccurate.

2. No Guarantees
- We do not guarantee venue accuracy, opening hours, music style, safety, or suitability
- Venues can change at any time; always verify details before visiting

3. Acceptable Use

You agree not to use the App:
- For unlawful purposes
- To harass, stalk, or endanger others
- To interfere with the App or attempt to access systems without authorisation

4. Location Permissions

Some features require location access. You can disable location at any time in iOS Settings, but functionality may be reduced.

5. Intellectual Property

All app content, branding, and design are owned by Insane Rabbit or its licensors unless otherwise stated.

6. Limitation of Liability

To the maximum extent permitted by law, Insane Rabbit is not liable for any damages arising from use of the App, including reliance on venue information or location results.

7. Termination

We may suspend or terminate access if you breach these Terms or if continued use poses legal or security risks.

8. Changes

We may update these Terms. Continued use of the App means you accept the updated Terms.`
  },
  {
    slug: "who-were-you",
    name: "WhoWereYou?",
    description:
      "iPhone app that helps users identify recently added contacts by date - useful for networking and events.",
    platform: "iOS App",
    privacyPolicy: `WHO WERE YOU - PRIVACY POLICY

Last updated: 23 January 2026

Who Were You ("the App") respects your privacy. This Privacy Policy explains how data is handled when you use the app.

1. Information We Collect

a. Contact Information (On-Device Only)

Who Were You accesses your device's contacts only with your explicit permission.
- Contacts are processed locally on your device
- We do not upload, store, sell, or share your contacts on any server
- We do not access contact data unless you enable the feature

b. Usage and Technical Data

We may collect limited, anonymised technical information such as:
- App version
- Device type and OS version
- Crash logs and performance data

This data:
- Does not personally identify you
- Is used solely to improve app stability and performance

c. No Sensitive Data

We do not collect:
- Location data
- Payment information
- Messages, call logs, or contact content
- Personal identifiers beyond what Apple provides for purchases/subscriptions

2. How Your Data Is Used

Data is used only to:
- Enable app functionality
- Improve performance and reliability
- Provide customer support if you contact us

3. Data Storage
- Contact data remains on your device
- No contact data is stored on our servers
- Technical logs may be processed via Apple-approved analytics tools

4. Third-Party Services

The App may rely on Apple services such as:
- App Store
- In-App Purchases
- iCloud (if enabled by you)

These services are governed by Apple's own privacy policies.

5. Your Rights (UK / EU Users)

You have the right to:
- Withdraw contact access at any time via device settings
- Request information about any data processing
- Delete the app to remove all locally stored data

6. Children's Privacy

Who Were You is not intended for children under 13 and does not knowingly collect data from children.

7. Changes

This policy may be updated occasionally. Continued use of the App means you accept the updated policy.

8. Contact

If you have questions about privacy, contact:`,
    terms: `WHO WERE YOU - END USER LICENSE AGREEMENT (CUSTOM EULA)

Last updated: 23 January 2026

This End User License Agreement ("Custom EULA") applies to the Who Were You application ("the App") and supplements Apple's Licensed Application End User License Agreement ("Standard EULA").

By downloading or using the App, you agree to both this Custom EULA and Apple's Standard EULA.

1. Relationship to Apple's Standard EULA
- Apple's Standard EULA governs licensing, warranties, liability, and export controls
- This Custom EULA only adds app-specific terms
- If there is a conflict, Apple's Standard EULA prevails

2. App Functionality

Who Were You helps you identify and remember contacts recently added to your device.
- The App does not verify the identity of contacts
- Any information shown is derived from your own device data
- You are responsible for how you use the information provided

3. Acceptable Use

You agree not to use the App:
- For harassment, stalking, or abuse
- To violate privacy, data protection, or local laws
- In any way that misuses contact information

4. Data Handling
- Contact data is processed locally on your device
- We do not store or sell contact data
- Removing the App removes all associated local data

5. No Professional Advice

The App is provided for convenience only and does not provide legal, professional, or investigative advice.

6. Termination

We may suspend or terminate access if:
- You breach these terms
- Continued use poses legal or security risks

You may stop using the App at any time by deleting it.

7. Governing Law

For UK and EU users, this Agreement is governed by the laws of your country of residence, in line with Apple's Standard EULA.`
  },
  {
    slug: "vector",
    name: "Vector",
    shortDescription:
      "Vector is an AI-powered assistant that turns raw ideas into clear decisions and actionable plans.",
    description:
      "Vector is an AI-powered assistant that turns raw ideas into clear decisions and actionable plans. Vector helps you move ideas forward. Drop in a thought, a concept, or a half-formed plan, and Vector organises it, pressure-tests it, finds what it’s similar to, and shows you what to do next. No endless lists, no false hype - just clarity, realism, and momentum from idea to action.",
    platform: "iOS & iPad App",
    privacyPolicy:
      "Vector respects user privacy and only collects data needed to operate the app. This placeholder will be replaced with the official policy.",
    terms:
      "By using Vector, you agree to the standard terms of the app. This placeholder will be replaced with the official terms."
  }
];

export const getProjectBySlug = (slug: string) =>
  projects.find((project) => project.slug === slug);
