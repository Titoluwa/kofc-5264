import { DateInput } from '@/lib/constants';

export const appUrl = () => process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.kofc5264.ca';

export function formatDate(d?: DateInput): string {
    if (!d) return 'N/A';
    const date = d instanceof Date ? d : new Date(d);
    return date.toLocaleDateString('en-CA', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/*
  COLOR PALETTE
  ─────────────────────────────────────────────────────────────
  Navy  (bg):        oklch(0.24 0.104 233)  ≈ #1a2744  (deep navy blue)
  Navy  (surface):   slightly lighter navy  ≈ #1e2f52
  Navy  (border):    muted navy             ≈ #2c3f6a
  Gold  (accent):    rgb(230, 177, 33)      ≈ #e6b121
  White (headline):  #ffffff
  Light (body text): #dde4f0
  Muted (label):     #8a9bbf
  Muted (footer):    #4e607f
  ─────────────────────────────────────────────────────────────
*/

/** Shared header/footer chrome so both emails look consistent */
export function wrapInShell(bodyContent: string): string {
    return /* html */ `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <!--[if mso]>
  <noscript>
    <xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
  </noscript>
  <![endif]-->
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@400;500&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background-color: #1a2744;
      font-family: 'DM Sans', Helvetica, Arial, sans-serif;
      color: #dde4f0;
      -webkit-font-smoothing: antialiased;
    }

    .wrapper {
      max-width: 620px;
      margin: 0 auto;
      padding: 40px 16px 60px;
    }

    /* ── Masthead ── */
    .masthead {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 24px;
      border-bottom: 1px solid #2c3f6a;
      margin-bottom: 40px;
    }
    .masthead-brand {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 22px;
      font-weight: 700;
      color: #e6b121;
      text-decoration: none;
      letter-spacing: -0.3px;
    }
    .masthead-label {
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      color: #e6b121;
    }

    /* ── Category pill ── */
    .category-pill {
      display: inline-block;
      background: #e6b121;
      color: #1a2744;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      padding: 5px 14px;
      border-radius: 100px;
      margin-bottom: 24px;
    }

    /* ── Title ── */
    .title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 32px;
      line-height: 1.18;
      font-weight: 700;
      color: #e6b121;
      margin-bottom: 28px;
      letter-spacing: -0.5px;
    }

    /* ── Divider ── */
    .divider {
      width: 48px;
      height: 2px;
      background: #e6b121;
      margin-bottom: 28px;
    }

    /* ── Detail table ── */
    .detail-card {
      background: #1e2f52;
      border: 1px solid #2c3f6a;
      border-radius: 6px;
      padding: 28px 32px;
      margin-bottom: 36px;
    }
    .detail-card table {
      width: 100%;
      border-collapse: collapse;
    }
    .detail-card td {
      padding: 10px 0;
      font-size: 14px;
      line-height: 1.6;
      vertical-align: top;
      border-bottom: 1px solid #2c3f6a;
    }
    .detail-card tr:last-child td {
      border-bottom: none;
    }
    .detail-card td.label {
      color: #8a9bbf;
      font-weight: 500;
      letter-spacing: 0.5px;
      width: 38%;
      padding-right: 16px;
    }
    .detail-card td.value {
      color: #dde4f0;
    }

    /* ── Section label ── */
    .section-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      color: #e6b121;
      margin-bottom: 14px;
    }

    /* ── Notes block ── */
    .notes-block {
      border-left: 3px solid #e6b121;
      padding: 16px 24px;
      margin-bottom: 36px;
      background: #1e2f52;
      border-radius: 0 4px 4px 0;
    }
    .notes-block p {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 15px;
      font-style: italic;
      line-height: 1.6;
      color: #dde4f0;
    }

    /* ── CTA button ── */
    .cta-wrap { margin-bottom: 48px; }
    .cta-button {
      display: inline-block;
      background: #e6b121;
      color: #1a2744 !important;
      text-decoration: none;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      padding: 16px 36px;
      border-radius: 3px;
    }

    /* ── Footer ── */
    .footer {
      border-top: 1px solid #2c3f6a;
      padding-top: 32px;
      text-align: center;
    }
    .footer p {
      font-size: 12px;
      line-height: 1.8;
      color: #4e607f;
    }
    .footer a { color: #8a9bbf; text-decoration: underline; }

    @media (max-width: 480px) {
      .title { font-size: 26px; }
      .masthead-brand { font-size: 18px; }
      .detail-card { padding: 20px 18px; }
    }
  </style>
</head>
<body>
  <div class="wrapper">

    <!-- Masthead -->
    <div class="masthead">
      <a href="${appUrl()}" class="masthead-brand">Knights of Columbus — Council 5264</a>
    </div>

    ${bodyContent}

    <!-- Footer -->
    <div class="footer">
      <p>
        This is an automated notification from <strong>Knights of Columbus — Council 5264</strong>.<br />
        <a href="${appUrl()}">Visit the site</a> &nbsp;·&nbsp;
        <a href="${appUrl()}/edit">Admin panel</a>
      </p>
      <p style="margin-top:16px;">© ${new Date().getFullYear()} Knights of Columbus — Council 5264. All rights reserved.</p>
    </div>

  </div>
</body>
</html>
  `;
}