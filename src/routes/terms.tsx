import { LegalDocumentPage } from "#/routes/-components/LegalDocumentPage";
import { AppConfig } from "#/utils/system";
import { getAppUrl } from "#/lib/client-env";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: `${AppConfig.name} | Terms of Use` },
      { name: "description", content: `Terms of use for ${AppConfig.name}.` },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  const appUrl = getAppUrl();
  const effectiveDate = "June 21, 2026";

  return (
    <LegalDocumentPage title="Terms of Use">
      <p>
        <strong>Effective date:</strong> {effectiveDate}
      </p>
      <p>
        These Terms of Use (&quot;Terms&quot;) govern your access to and use of {AppConfig.name}{" "}
        (&quot;the Service&quot;) at{" "}
        <a href={appUrl} target="_blank" rel="noreferrer">
          {appUrl}
        </a>
        . By using the Service, you agree to these Terms and our{" "}
        <Link to="/privacy">Privacy Policy</Link>.
      </p>

      <h2>The Service</h2>
      <p>
        {AppConfig.name} lets you browse movies, save favorites, and maintain a watchlist. Movie
        metadata is provided by third-party sources and may be incomplete or change without notice.
      </p>

      <h2>Accounts</h2>
      <p>
        You sign in with Google. You are responsible for activity that occurs under your account and
        for maintaining the security of your Google account. You must provide accurate information
        associated with your sign-in.
      </p>

      <h2>Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the Service for unlawful purposes</li>
        <li>Attempt to access systems or data without authorization</li>
        <li>Interfere with or disrupt the Service or its infrastructure</li>
        <li>Scrape, reverse engineer, or abuse the Service in ways that harm others</li>
      </ul>

      <h2>Third-party services</h2>
      <p>
        The Service integrates with Google for authentication and with The Movie Database (TMDB) for
        movie information. Your use of those services is also subject to their respective terms and
        policies.
      </p>

      <h2>Intellectual property</h2>
      <p>
        The Service, including its design and branding, is owned by us or our licensors. Movie
        titles, images, and related metadata belong to their respective owners and are displayed for
        informational purposes.
      </p>

      <h2>Disclaimer</h2>
      <p>
        The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of
        any kind, whether express or implied, including merchantability, fitness for a particular
        purpose, and non-infringement.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, we are not liable for indirect, incidental, special,
        consequential, or punitive damages, or for loss of profits, data, or goodwill, arising from
        your use of the Service.
      </p>

      <h2>Termination</h2>
      <p>
        You may stop using the Service at any time. You may delete your account from{" "}
        <Link to="/settings">Settings</Link>. We may suspend or terminate access if you violate
        these Terms or if we discontinue the Service.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these Terms from time to time. Continued use of the Service after changes
        become effective constitutes acceptance of the updated Terms.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these Terms? Contact us at{" "}
        <a href={`mailto:${AppConfig.contactEmail}`}>{AppConfig.contactEmail}</a>.
      </p>
    </LegalDocumentPage>
  );
}
