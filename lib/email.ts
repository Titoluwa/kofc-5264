import nodemailer from 'nodemailer';
import { prisma } from '@/lib/db';

// ---------------------------------------------------------------------------
// Transporter
// ---------------------------------------------------------------------------
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: false 
    },
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface NewsletterPayload {
    id: string;
    title: string;
    subtitle?: string | null;
    description?: string | null;
    category?: string | null;
    content: string;
    heroImage?: string | null;
    publishedDate?: Date | null;
}

// ---------------------------------------------------------------------------
// HTML email template
// ---------------------------------------------------------------------------
function buildEmailTemplate(newsletter: NewsletterPayload, unsubscribeUrl: string): string {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://yourapp.com';
    const readMoreUrl = `${appUrl}/newsletters/${newsletter.id}`;

    // Derive a short excerpt from the content (strip any HTML tags, take first 200 chars)
    const plainContent = newsletter.content.replaceAll(/<[^>]*>/g, '');
    const excerpt =
        plainContent.length > 220 ? plainContent.slice(0, 220).trimEnd() + '…' : plainContent;

    const category = newsletter.category ?? 'Newsletter';
    const heroBlock = newsletter.heroImage
        ? `<img src="${newsletter.heroImage}" alt="${newsletter.title}" style="width:100%;max-height:360px;object-fit:cover;display:block;border-radius:0 0 2px 2px;" />`
        : '';

    return /* html */ `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${newsletter.title}</title>
  <!--[if mso]>
  <noscript>
    <xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
  </noscript>
  <![endif]-->
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@400;500&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background-color: #0f0e0c;
      font-family: 'DM Sans', Helvetica, Arial, sans-serif;
      color: #f0ece4;
      -webkit-font-smoothing: antialiased;
    }

    .wrapper {
      max-width: 620px;
      margin: 0 auto;
      padding: 40px 16px 60px;
    }

    /* ── Header / Masthead ── */
    .masthead {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 24px;
      border-bottom: 1px solid #2e2b26;
      margin-bottom: 40px;
    }

    .masthead-brand {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 22px;
      font-weight: 700;
      color: #f0ece4;
      text-decoration: none;
      letter-spacing: -0.3px;
    }

    .masthead-label {
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      color: #c8a96e;
    }

    /* ── Category pill ── */
    .category-pill {
      display: inline-block;
      background: #c8a96e;
      color: #0f0e0c;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      padding: 5px 14px;
      border-radius: 100px;
      margin-bottom: 24px;
    }

    /* ── Hero image ── */
    .hero-wrap {
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 36px;
      border: 1px solid #2e2b26;
    }

    /* ── Title block ── */
    .title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 36px;
      line-height: 1.18;
      font-weight: 700;
      color: #f0ece4;
      margin-bottom: 14px;
      letter-spacing: -0.5px;
    }

    .subtitle {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 20px;
      line-height: 1.4;
      font-style: italic;
      color: #9e9484;
      margin-bottom: 28px;
    }

    /* ── Divider ── */
    .divider {
      width: 48px;
      height: 2px;
      background: #c8a96e;
      margin-bottom: 28px;
    }

    /* ── Excerpt ── */
    .excerpt {
      font-size: 16px;
      line-height: 1.75;
      color: #c9c0b2;
      margin-bottom: 36px;
    }

    /* ── CTA button ── */
    .cta-wrap {
      margin-bottom: 48px;
    }

    .cta-button {
      display: inline-block;
      background: #c8a96e;
      color: #0f0e0c !important;
      text-decoration: none;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      padding: 16px 36px;
      border-radius: 3px;
    }

    /* ── Decorative quote / pull ── */
    .pull-quote {
      border-left: 3px solid #c8a96e;
      padding: 16px 24px;
      margin-bottom: 48px;
      background: #1a1813;
      border-radius: 0 4px 4px 0;
    }

    .pull-quote p {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 17px;
      font-style: italic;
      line-height: 1.6;
      color: #d9cebc;
    }

    /* ── Footer ── */
    .footer {
      border-top: 1px solid #2e2b26;
      padding-top: 32px;
      text-align: center;
    }

    .footer p {
      font-size: 12px;
      line-height: 1.8;
      color: #5a5346;
    }

    .footer a {
      color: #7d7061;
      text-decoration: underline;
    }

    /* ── Responsive ── */
    @media (max-width: 480px) {
      .title { font-size: 28px; }
      .subtitle { font-size: 17px; }
      .masthead-brand { font-size: 18px; }
    }
  </style>
</head>
<body>
  <div class="wrapper">

    <!-- Masthead -->
    <div class="masthead">
      <a href="${appUrl}" class="masthead-brand">Knights of Columbus - Council 5264</a>
      <span class="masthead-label">New Issue</span>
    </div>

    <!-- Category -->
    <div>
      <span class="category-pill">${category}</span>
    </div>

    <!-- Hero image -->
    ${heroBlock ? `<div class="hero-wrap">${heroBlock}</div>` : ''}

    <!-- Title -->
    <h1 class="title">${newsletter.title}</h1>

    ${newsletter.subtitle ? `<p class="subtitle">${newsletter.subtitle}</p>` : ''}

    <div class="divider"></div>

    <!-- Excerpt -->
    <p class="excerpt">${excerpt}</p>

    <!-- Pull quote (description as a pull-quote if provided) -->
    ${newsletter.description
            ? `<div class="pull-quote"><p>${newsletter.description}</p></div>`
            : ''
        }

    <!-- CTA -->
    <div class="cta-wrap">
      <a href="${readMoreUrl}" class="cta-button">Read the full issue →</a>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>
        You're receiving this because you subscribed to <strong>Knights of Columbus - Council 5264</strong>.<br />
        <a href="${unsubscribeUrl}">Unsubscribe</a> &nbsp;·&nbsp;
        <a href="${appUrl}/privacy">Privacy Policy</a> &nbsp;·&nbsp;
        <a href="${appUrl}">Visit the site</a>
      </p>
      <p style="margin-top:16px;">© ${new Date().getFullYear()} Knights of Columbus - Council 5264. All rights reserved.</p>
    </div>

  </div>
</body>
</html>
  `;
}

// ---------------------------------------------------------------------------
// Plain-text fallback
// ---------------------------------------------------------------------------
function buildPlainText(newsletter: NewsletterPayload, unsubscribeUrl: string): string {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://yourapp.com';
    const readMoreUrl = `${appUrl}/newsletters/${newsletter.id}`;
    const plainContent = newsletter.content.replaceAll(/<[^>]*>/g, '');
    const excerpt =
        plainContent.length > 220 ? plainContent.slice(0, 220).trimEnd() + '…' : plainContent;

    return [
        `Knights of Columbus - Council 5264 — ${(newsletter.category ?? 'Newsletter').toUpperCase()}`,
        '',
        newsletter.title,
        newsletter.subtitle ?? '',
        '',
        '---',
        '',
        excerpt,
        '',
        newsletter.description ? `"${newsletter.description}"` : '',
        '',
        `Read the full issue: ${readMoreUrl}`,
        '',
        '---',
        `Unsubscribe: ${unsubscribeUrl}`,
        `© ${new Date().getFullYear()} Knights of Columbus - Council 5264`,
    ]
        .filter((l) => l !== null)
        .join('\n');
}

// ---------------------------------------------------------------------------
// Core send function
// ---------------------------------------------------------------------------
export async function sendNewsletterToSubscribers(newsletter: NewsletterPayload): Promise<void> {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://yourapp.com';

    // Fetch all active subscribers
    const subscribers = await prisma.newsletterSubscriber.findMany({
        where: { isActive: true },
        select: { email: true, id: true },
    });

    if (subscribers.length === 0) {
        console.log('[email] No active subscribers — skipping send.');
        return;
    }

    // Send to each subscriber (batched with Promise.allSettled for resilience)
    const results = await Promise.allSettled(
        subscribers.map(async (sub: { email: string; id: number }) => {
            const unsubscribeUrl = `${appUrl}/unsubscribe?id=${sub.id}`;

            await transporter.sendMail({
                from: `"Knights of Columbus - Council 5264" <${process.env.SMTP_FROM ?? process.env.SMTP_USER}>`,
                to: sub.email,
                subject: newsletter.subtitle
                    ? `${newsletter.title} — ${newsletter.subtitle}`
                    : newsletter.title,
                text: buildPlainText(newsletter, unsubscribeUrl),
                html: buildEmailTemplate(newsletter, unsubscribeUrl),
            });
        }),
    );

    const failed = results.filter(
        (r): r is PromiseRejectedResult => r.status === 'rejected',
    );
    if (failed.length) {
        console.error(`[email] ${failed.length} of ${subscribers.length} emails failed.`);
        failed.forEach((f) => console.error(f.reason));
    } else {
        console.log(`[email] Successfully sent to ${subscribers.length} subscribers.`);
    }
}

// ---------------------------------------------------------------------------
// Scheduler — used when publishedDate is in the future
// ---------------------------------------------------------------------------
export function scheduleNewsletterEmail(
    newsletter: NewsletterPayload,
    publishedDate: Date,
): void {
    const delay = publishedDate.getTime() - Date.now();

    if (delay <= 0) {
        // Date is in the past or now — send immediately
        sendNewsletterToSubscribers(newsletter).catch(console.error);
        return;
    }

    // Node's setTimeout supports up to ~24.8 days safely.
    // For longer delays you should use a proper job queue (BullMQ, etc.).
    const MAX_TIMEOUT = 2_147_483_647; // ~24.8 days in ms
    if (delay > MAX_TIMEOUT) {
        console.warn(
            '[email] Scheduled date is too far in the future for in-process setTimeout. ' +
            'Consider using a persistent job queue (e.g. BullMQ).',
        );
    }

    console.log(
        `[email] Newsletter "${newsletter.title}" scheduled for ${publishedDate.toISOString()}`,
    );

    setTimeout(() => {
        sendNewsletterToSubscribers(newsletter).catch(console.error);
    }, Math.min(delay, MAX_TIMEOUT));
}