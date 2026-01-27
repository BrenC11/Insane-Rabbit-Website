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
    privacyPolicy: `PRIVACY POLICY
Dive Bar Finder

Last updated: 26 January 2026

Dive Bar Finder (“the App”) respects your privacy. This Privacy Policy explains how information is collected, used, and protected when you use the App.

INFORMATION WE COLLECT

Dive Bar Finder is designed to be lightweight and privacy-friendly.

Information You Provide
The App does not require account creation.
We do not collect names, email addresses, phone numbers, or payment details.

Automatically Collected Information
The App may collect non-personally identifiable technical data, including:
- Device type and operating system
- App version
- Anonymous usage and performance data
- Approximate location data (if location services are enabled)

This data is used only to:
- Improve app performance
- Fix bugs
- Understand feature usage

LOCATION DATA

If you allow location access, Dive Bar Finder may use your location solely to show nearby dive bars or venues.

- Location access is optional
- You can disable it at any time in your device settings
- Location data is not stored, sold, or used for advertising

DATA SHARING

We do not sell, rent, or trade your data.

Limited data may be processed by trusted third-party services (such as Apple or analytics tools) only to support core app functionality.

DATA SECURITY

We take reasonable steps to protect information using industry-standard safeguards. However, no system can be guaranteed 100% secure.

CHILDREN’S PRIVACY

Dive Bar Finder does not knowingly collect personal data from children under 13. If you believe such data has been collected, please contact us so we can remove it.

YOUR RIGHTS (UK / EU / GDPR)

You have the right to:
- Request access to your data
- Request deletion of your data
- Withdraw consent for location access at any time

Because Dive Bar Finder stores little to no personal data, most requests can be resolved immediately.

CHANGES TO THIS POLICY

This Privacy Policy may be updated from time to time. Any changes will be reflected by updating the “Last updated” date.

CONTACT

If you have questions about this Privacy Policy, contact:

App Provider: Dive Bar Finder  
Email: [INSERT SUPPORT EMAIL]`,
    terms: `LICENSED APPLICATION END USER LICENSE AGREEMENT

Last updated: 26 January 2026

Apps made available through the App Store are licensed, not sold, to you. Your license to each App is subject to your prior acceptance of either this Licensed Application End User License Agreement (“Standard EULA”), or a custom end user license agreement between you and the Application Provider (“Custom EULA”), if one is provided.

Your license to any Apple App under this Standard EULA or Custom EULA is granted by Apple, and your license to any Third Party App under this Standard EULA or Custom EULA is granted by the Application Provider of that Third Party App.

Any App that is subject to this Standard EULA is referred to herein as the “Licensed Application.”
The Application Provider or Apple as applicable (“Licensor”) reserves all rights in and to the Licensed Application not expressly granted to you under this Standard EULA.

a. Scope of License

Licensor grants to you a non-transferable license to use the Licensed Application Dive Bar Finder on any Apple-branded products that you own or control and as permitted by the Usage Rules.

You may not distribute or make the Licensed Application available over a network where it could be used by multiple devices at the same time. You may not transfer, redistribute, or sublicense the Licensed Application.

b. Consent to Use of Data

You agree that Licensor may collect and use technical data and related information—including but not limited to technical information about your device, system and application software—that is gathered periodically to facilitate software updates, product support, and other services related to the Licensed Application.

This data will be used only in a form that does not personally identify you.

c. Termination

This Standard EULA is effective until terminated by you or Licensor. Your rights under this Standard EULA will terminate automatically if you fail to comply with any of its terms.

d. External Services

The Licensed Application may enable access to third-party services and websites. You agree to use such services at your sole risk. Licensor is not responsible for examining or evaluating the content or accuracy of any third-party services.

e. No Warranty

THE LICENSED APPLICATION IS PROVIDED “AS IS” AND “AS AVAILABLE,” WITH ALL FAULTS AND WITHOUT WARRANTY OF ANY KIND, TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW.

f. Limitation of Liability

TO THE EXTENT NOT PROHIBITED BY LAW, IN NO EVENT SHALL LICENSOR BE LIABLE FOR ANY INCIDENTAL, SPECIAL, INDIRECT, OR CONSEQUENTIAL DAMAGES.

Licensor’s total liability shall not exceed fifty dollars ($50.00), except where prohibited by law.

g. Export Restrictions

You may not use or export or re-export the Licensed Application except as authorized by United States law and the laws of the jurisdiction in which the Licensed Application was obtained.

h. U.S. Government Rights

The Licensed Application and related documentation are “Commercial Items” as defined under applicable U.S. regulations.

i. Governing Law

Except where prohibited by local law, this Agreement shall be governed by the laws of the State of California.

If you are a resident of the European Union, Switzerland, Norway, or Iceland, the governing law shall be the law of your country of residence.

The United Nations Convention on the International Sale of Goods does not apply.`
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
