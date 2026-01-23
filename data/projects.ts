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
  }
];

export const getProjectBySlug = (slug: string) =>
  projects.find((project) => project.slug === slug);
