import { LegalDocumentPage } from "#/routes/-components/LegalDocumentPage";
import { AppConfig } from "#/utils/system";
import { getAppUrl } from "#/lib/client-env";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: `${AppConfig.name} | Privacy Policy` },
      { name: "description", content: `Privacy policy for ${AppConfig.name}.` },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const appUrl = getAppUrl();
  const effectiveDate = "June 21, 2026";

  return (
    <LegalDocumentPage title="Privacy Policy">
      <p>
        <strong>Effective date:</strong> {effectiveDate}
      </p>
      <p>
        This Privacy Policy describes how {AppConfig.name} (&quot;we&quot;, &quot;us&quot;, or
        &quot;our&quot;) collects, uses, stores, and shares information when you use our movie
        browsing application at{" "}
        <a href={appUrl} target="_blank" rel="noreferrer">
          {appUrl}
        </a>
        .
      </p>

      <h2>Information we collect</h2>
      <h3>Google sign-in</h3>
      <p>
        {AppConfig.name} uses Google OAuth for authentication. When you sign in with Google, we
        receive basic profile information from your Google account, including your name, email
        address, and profile picture. We use this information only to identify your account and
        display your profile in the app.
      </p>
      <p>
        We request only the Google scopes required for sign-in (typically <code>openid</code>,{" "}
        <code>email</code>, and <code>profile</code>). We do not access your Gmail, Google Drive,
        contacts, or other Google services.
      </p>

      <h3>Movie library data</h3>
      <p>
        Your favorites and watchlist are stored locally in your browser on your device. By default,
        this library data stays on your device and is not uploaded to our servers.
      </p>
      <p>
        If you enable library sync in <Link to="/settings">Settings</Link> while signed in, changes
        to your favorites and watchlist are also stored on our servers and linked to your account so
        your library can be available across devices. You can turn library sync off at any time; when
        sync is off, new library changes are not sent to our servers.
      </p>

      <h3>Technical data</h3>
      <p>
        We may process standard technical information such as IP address, browser type, and session
        identifiers to keep you signed in, protect the service, and operate our infrastructure.
      </p>

      <h2>How we use information</h2>
      <ul>
        <li>Authenticate you and maintain your session</li>
        <li>Display your name and profile image in the app</li>
        <li>Sync your favorites and watchlist across devices when you enable library sync</li>
        <li>Operate, secure, and improve {AppConfig.name}</li>
        <li>Respond to support or privacy requests</li>
      </ul>

      <h2>How we share information</h2>
      <p>
        We do not sell your personal information. We do not share Google user data with third
        parties for advertising, data brokers, or AI model training.
      </p>
      <p>We share information only in these limited cases:</p>
      <ul>
        <li>
          <strong>Service providers:</strong> We use infrastructure providers (such as Cloudflare)
          to host the application and store authentication records. They process data on our behalf
          to run the service. If you enable library sync, your favorites and watchlist changes are
          also stored in our database and linked to your account.
        </li>
        <li>
          <strong>Movie metadata:</strong> The app fetches public movie information from The Movie
          Database (TMDB). We send movie search and detail requests to TMDB; those requests do not
          include your Google account data.
        </li>
        <li>
          <strong>Legal requirements:</strong> We may disclose information if required by law or to
          protect rights, safety, and security.
        </li>
      </ul>

      <h2>Google user data</h2>
      <p>
        Our use of information received from Google APIs adheres to the{" "}
        <a
          href="https://developers.google.com/terms/api-services-user-data-policy"
          target="_blank"
          rel="noreferrer"
        >
          Google API Services User Data Policy
        </a>
        , including the Limited Use requirements. Google user data is used only to provide
        user-facing features in {AppConfig.name}, is not used for serving ads, and is not sold or
        transferred for unrelated purposes.
      </p>

      <h2>Data retention</h2>
      <p>
        We retain your account information while your account is active. When you delete your
        account, we remove your user record, authentication data, and synced library data from our
        database. Favorites and watchlist data stored locally in your browser may remain until you
        clear site data in your browser settings.
      </p>

      <h2>Your choices</h2>
      <ul>
        <li>
          <strong>Delete your account:</strong> You can permanently delete your account from{" "}
          <Link to="/settings">Settings</Link> while signed in.
        </li>
        <li>
          <strong>Revoke Google access:</strong> You can remove {AppConfig.name}&apos;s access to
          your Google account at{" "}
          <a href="https://myaccount.google.com/permissions" target="_blank" rel="noreferrer">
            Google Account permissions
          </a>
          .
        </li>
        <li>
          <strong>Library sync:</strong> You can enable or disable syncing your favorites and
          watchlist to your account in <Link to="/settings">Settings</Link> while signed in.
        </li>
        <li>
          <strong>Clear local data:</strong> You can clear favorites and watchlist data stored on
          this device by removing site data for this application in your browser settings.
        </li>
      </ul>

      <h2>Children</h2>
      <p>
        {AppConfig.name} is not directed to children under 13, and we do not knowingly collect
        personal information from children.
      </p>

      <h2>Changes</h2>
      <p>
        We may update this Privacy Policy from time to time. We will post the updated policy on this
        page and update the effective date above.
      </p>

      <h2>Contact</h2>
      <p>
        For privacy questions or requests, contact us at{" "}
        <a href={`mailto:${AppConfig.contactEmail}`}>{AppConfig.contactEmail}</a>.
      </p>
    </LegalDocumentPage>
  );
}
