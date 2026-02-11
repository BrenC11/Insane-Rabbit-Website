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
      "Script Forge is a screenwriting platform that gives writers fast, professional-grade feedback to sharpen scripts, strengthen characters, and improve story craft.",
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
    name: "TimeCam",
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
    slug: "sipocalypse",
    name: "Sipocalypse",
    shortDescription:
      "Sipocalypse is a basic, fun drinking game generator that is free to use.",
    description:
      "Sipocalypse is a basic, fun drinking game generator built for quick laughs and easy party setup. Open the site, generate a game, and start playing right away. It is free to use and designed to keep things simple and entertaining.",
    platform: "Web App",
    websiteUrl: "https://sipocalypse.fun",
    privacyPolicy:
      "Sipocalypse respects user privacy and only collects data needed to operate the service. This placeholder will be replaced with the official policy.",
    terms:
      "By using Sipocalypse, you agree to the standard terms of service for the platform. This placeholder will be replaced with the official terms."
  },
  {
    slug: "action",
    name: "Action!",
    shortDescription:
      "Action! is an actor practice tool that lets you upload scripts and rehearse lines with real voice feedback.",
    description:
      "Action! is an iOS actor practice app built to make rehearsal fast and realistic. Upload a script, take your role, and run the scene out loud while the app performs the other characters with natural voice playback. Actors can practice timing, delivery, and responsiveness with real spoken cues instead of silent text, making line work feel closer to a live scene partner.",
    platform: "iOS App",
    privacyPolicy: `PRIVACY POLICY FOR ACTION

Effective Date: February 11, 2026
Last updated: February 11, 2026

Action ("Action," "we," "us," or "our") provides AI-powered voice generation features through our mobile application and related services (the "Service"). This Privacy Policy explains how we collect, use, disclose, and protect information when you use Action.

If you do not agree with this Privacy Policy, do not use the Service.

1. Who We Are

Data Controller / Business:

- Legal Entity: [Your Company Legal Name]
- Address: [Business Address]
- Email: support@insanerabbit.com
- Support Contact: support@insanerabbit.com

2. Scope

This Privacy Policy applies to information processed through:

- The Action iOS app
- Related websites, customer support, and communications

It does not apply to third-party services we do not control.

3. Information We Collect

Depending on how you use Action, we may collect:

a. Information You Provide

- Account details (for example, name, email, login credentials), if account creation is enabled
- Text you submit for voice generation
- Voice generation settings (for example, selected voice, style, speed, and language)
- Content you choose to upload or save in the app
- Messages sent to support

b. Automatically Collected Information

- Device and app data (for example, device model, OS version, app version, crash logs, diagnostics)
- Usage data (for example, features used, session events, timestamp data)
- IP address and approximate location derived from IP (for security and service operations)

c. Purchase and Subscription Information

- Subscription status, purchase tokens, and transaction metadata from Apple
- We do not receive your full payment card number; payments are processed by Apple

4. How We Use Information

We use information to:

- Provide and operate Action features
- Generate voices from your inputs
- Improve quality, reliability, and safety
- Detect abuse, fraud, and security incidents
- Provide customer support
- Manage subscriptions and enforce terms
- Comply with legal obligations

We do not sell your personal information.

5. OpenAI API Processing

Action uses OpenAI's API to generate voices and related outputs.

When you use AI features, we may send relevant data to OpenAI, including:

- Text inputs you submit for generation
- Generation parameters (for example, selected voice and model settings)
- Limited technical metadata needed to process your request

OpenAI processes this data on our behalf to provide the requested output. Per OpenAI's API policy, API customer content is not used to train OpenAI models by default unless a customer explicitly opts in. OpenAI may retain certain API data for limited periods for abuse monitoring and security as described in its documentation.

See OpenAI:

- https://openai.com/policies/how-your-data-is-used-to-improve-model-performance/
- https://platform.openai.com/docs/guides/your-data

6. Legal Bases for Processing (EEA/UK, where applicable)

If you are in the EEA, UK, or similar jurisdictions, we process personal data under one or more legal bases:

- Performance of a contract (to provide the Service)
- Legitimate interests (service improvement, security, fraud prevention)
- Consent (where required, such as optional marketing or specific permissions)
- Legal obligation (compliance and recordkeeping)

7. Sharing and Disclosure

We may share information with:

- Service providers (hosting, analytics, customer support, AI processing providers including OpenAI)
- Apple, for billing, subscription validation, and App Store operations
- Legal authorities when required by law or to protect rights, safety, and security
- Successors in a merger, acquisition, or asset transfer (with appropriate safeguards)

We require service providers to handle personal information under contractual confidentiality and security obligations.

8. Data Retention

We retain information only as long as needed for the purposes in this Policy, including:

- Active account lifecycle
- Service delivery and support
- Legal, tax, accounting, and dispute resolution obligations
- Security and fraud prevention

You may request deletion of your personal data, subject to lawful exceptions.

9. Your Rights and Choices

Depending on your location, you may have rights to:

- Access personal information
- Correct inaccurate information
- Delete personal information
- Restrict or object to certain processing
- Data portability
- Withdraw consent (where processing is based on consent)
- Appeal decisions or lodge complaints with regulators

To exercise rights, contact: support@insanerabbit.com.

California Privacy Rights (CCPA/CPRA)

California residents may have rights to know, delete, correct, and limit certain uses of sensitive personal information. We do not sell or share personal information for cross-context behavioral advertising as those terms are defined under California law.

10. Account Deletion

If Action offers account creation, users can request deletion by:

1. Using the in-app deletion flow at: [App path, e.g., Settings > Account > Delete Account], or
2. Contacting us at support@insanerabbit.com.

We will process verified deletion requests within the time required by applicable law. Certain data may be retained where legally required or necessary for security and fraud prevention.

11. Children's Privacy

Action is not directed to children under 13 (or older age where required by local law), and we do not knowingly collect personal information from children without required parental consent. If you believe a child has provided personal information, contact us and we will take appropriate steps.

12. International Data Transfers

Your information may be processed in countries other than your own. Where required, we use appropriate safeguards for cross-border transfers (for example, standard contractual clauses or equivalent mechanisms).

13. Security

We use reasonable administrative, technical, and organizational safeguards designed to protect personal information. No method of transmission or storage is completely secure, and we cannot guarantee absolute security.

14. Third-Party Services

Action may link to or integrate with third-party services. Their privacy practices are governed by their own policies. Key providers may include:

- Apple (App Store, subscriptions)
- OpenAI (AI voice generation APIs)
- [Analytics Provider]
- [Crash Reporting Provider]
- [Cloud Hosting Provider]

15. App Store-Specific Disclosures

To comply with Apple's App Store requirements:

- This Privacy Policy is publicly available at: [Public Privacy Policy URL]
- We maintain App Store privacy "nutrition label" disclosures in App Store Connect consistent with actual data practices
- Where required, we request device permissions in context and explain purpose before access

16. Changes to This Privacy Policy

We may update this Privacy Policy periodically. We will post updates with a revised "Last updated" date and provide additional notice where required by law.

17. Contact Us

For privacy questions, requests, or complaints:

- Email: support@insanerabbit.com`,
    terms:
      "By using Action!, you agree to the standard terms of the app. This placeholder will be replaced with the official terms."
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

Last updated: 27 January 2026

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
Email: support@insanerabbit.com`,
    terms: `LICENSED APPLICATION END USER LICENSE AGREEMENT

Last updated: 27 January 2026

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
