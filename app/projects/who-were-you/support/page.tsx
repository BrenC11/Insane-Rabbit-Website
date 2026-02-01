export default function WhoWereYouSupportPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-6 py-16">
      <div className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Support
        </p>
        <h1 className="text-3xl font-semibold text-white">
          Who Were You? - Support &amp; Help
        </h1>
        <p className="text-base text-zinc-300">
          Welcome to Who Were You? This app helps you quickly see recently added
          contacts on your iPhone, so you can remember who someone is and follow
          up at the right time.
        </p>
        <p className="text-base text-zinc-300">
          Support email:{" "}
          <a
            href="mailto:hello@insanerabbit.com"
            className="text-zinc-100 transition hover:text-white"
          >
            hello@insanerabbit.com
          </a>
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-white">Quick Start</h2>
        <ul className="list-disc space-y-2 pl-5 text-base text-zinc-300">
          <li>
            Allow Contacts Access: When prompted, tap Allow so the app can read
            your contacts locally on your device.
          </li>
          <li>
            Choose a Filter: Use Today, Yesterday, Last 7 Days, Last 30 Days, or
            Custom to narrow the list.
          </li>
          <li>
            Tap a Contact: View details and take quick actions like call or
            message.
          </li>
          <li>
            Set a Follow-Up Reminder: Add a reminder to text/call later
            (optional notification).
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-white">
          How "Recently Added" Works
        </h2>
        <p className="text-base text-zinc-300">
          iOS does not provide a perfect "date added" for every contact. Who
          Were You? uses the best available on-device signals to estimate when a
          contact was added and then improves accuracy over time as the app
          runs.
        </p>
        <p className="text-base text-zinc-300">
          Important: The most accurate tracking happens from the point you
          start using the app.
        </p>
        <p className="text-base text-zinc-300">
          If results ever look off, you can reset local tracking in the app (see
          below).
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-white">Reminders</h2>
        <ul className="list-disc space-y-2 pl-5 text-base text-zinc-300">
          <li>
            Follow-up reminders help you remember to text or call someone later.
          </li>
          <li>
            Reminders stay in the app until you delete them (they will not
            disappear automatically).
          </li>
          <li>
            If notifications are enabled, you will receive an alert when a
            reminder is due.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-white">
          Subscriptions / Pro (if enabled)
        </h2>
        <ul className="list-disc space-y-2 pl-5 text-base text-zinc-300">
          <li>
            Free users may have limits (for example: fewer contacts shown, fewer
            filters, or reminder limits).
          </li>
          <li>Pro unlocks the full feature set.</li>
        </ul>
        <p className="text-base text-zinc-300">
          If a purchase does not unlock Pro immediately:
        </p>
        <ul className="list-disc space-y-2 pl-5 text-base text-zinc-300">
          <li>Make sure you are signed into the correct Apple ID on your device.</li>
          <li>Try Restore Purchases in the paywall.</li>
          <li>Close and reopen the app.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-white">Troubleshooting</h2>
        <div className="flex flex-col gap-3 text-base text-zinc-300">
          <div>
            <p className="font-semibold text-white">I cannot see any contacts</p>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>
                Check iPhone Settings -&gt; Privacy &amp; Security -&gt; Contacts
                -&gt; enable access for Who Were You?.
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
                Go to Settings in the app -&gt; Reset "Recently Added" Tracking
                (this clears local history and starts fresh).
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white">
              Reminders are not notifying me
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>
                Check iPhone Settings -&gt; Notifications -&gt; Who Were You? -&gt;
                allow notifications.
              </li>
              <li>
                Make sure Focus/Do Not Disturb is not silencing alerts.
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white">Background refresh</p>
            <p className="mt-2">
              If enabled, iOS may still delay or skip background runs to save
              battery. Opening the app periodically helps keep tracking current.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
