import nodemailer from 'nodemailer';
import { prisma } from '@/lib/db';

// ---------------------------------------------------------------------------
// Transporter (shared — mirrors newsletter config)
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
        rejectUnauthorized: false,
    },
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type DateInput = Date | string | null;

export interface NewMemberPayload {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
    registeredAt?: DateInput;
    /** Any additional notes or fields from the registration form */
    notes?: string | null;
}

export type EventParticipationType = 'registered' | 'volunteered';

export interface EventParticipationPayload {
    /** The email address to notify (event coordinator, GK, etc.) */
    notifyEmail: string;
    participationType: EventParticipationType;
    event: {
        id: string;
        title: string;
        date?: DateInput;
        location?: string | null;
        description?: string | null;
    };
    member: {
        firstName: string;
        lastName: string;
        email: string;
        phone?: string | null;
    };
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------
const appUrl = () => process.env.NEXT_PUBLIC_APP_URL ?? 'https://yourapp.com';

function formatDate(d?: DateInput): string {
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

/** Shared header/footer chrome so both emails look consistent */
function wrapInShell(bodyContent: string): string {
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

    /* ── Masthead ── */
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

    /* ── Title ── */
    .title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 32px;
      line-height: 1.18;
      font-weight: 700;
      color: #f0ece4;
      margin-bottom: 28px;
      letter-spacing: -0.5px;
    }

    /* ── Divider ── */
    .divider {
      width: 48px;
      height: 2px;
      background: #c8a96e;
      margin-bottom: 28px;
    }

    /* ── Detail table ── */
    .detail-card {
      background: #1a1813;
      border: 1px solid #2e2b26;
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
      border-bottom: 1px solid #2e2b26;
    }
    .detail-card tr:last-child td {
      border-bottom: none;
    }
    .detail-card td.label {
      color: #7d7061;
      font-weight: 500;
      letter-spacing: 0.5px;
      width: 38%;
      padding-right: 16px;
    }
    .detail-card td.value {
      color: #d9cebc;
    }

    /* ── Section label ── */
    .section-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      color: #c8a96e;
      margin-bottom: 14px;
    }

    /* ── Notes block ── */
    .notes-block {
      border-left: 3px solid #c8a96e;
      padding: 16px 24px;
      margin-bottom: 36px;
      background: #1a1813;
      border-radius: 0 4px 4px 0;
    }
    .notes-block p {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 15px;
      font-style: italic;
      line-height: 1.6;
      color: #d9cebc;
    }

    /* ── CTA button ── */
    .cta-wrap { margin-bottom: 48px; }
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
    .footer a { color: #7d7061; text-decoration: underline; }

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
      <span class="masthead-label">Admin Alert</span>
    </div>

    ${bodyContent}

    <!-- Footer -->
    <div class="footer">
      <p>
        This is an automated notification from <strong>Knights of Columbus — Council 5264</strong>.<br />
        <a href="${appUrl()}">Visit the site</a> &nbsp;·&nbsp;
        <a href="${appUrl()}/edit">Admin panel</a> &nbsp;·&nbsp;
      </p>
      <p style="margin-top:16px;">© ${new Date().getFullYear()} Knights of Columbus — Council 5264. All rights reserved.</p>
    </div>

  </div>
</body>
</html>
  `;
}

// ---------------------------------------------------------------------------
// 1. NEW MEMBER REGISTRATION
// ---------------------------------------------------------------------------

// ── HTML template ──
function buildNewMemberHtml(member: NewMemberPayload): string {
    const adminUrl = `${appUrl()}/edit/members`;

    const body = /* html */ `
    <!-- Pill -->
    <div><span class="category-pill">New Member</span></div>

    <!-- Title -->
    <h1 class="title">A new member has registered.</h1>
    <div class="divider"></div>

    <!-- Member detail card -->
    <p class="section-label">Member Details</p>
    <div class="detail-card">
      <table>
        <tr>
          <td class="label">Full Name</td>
          <td class="value">${member.firstName} ${member.lastName}</td>
        </tr>
        <tr>
          <td class="label">Email</td>
          <td class="value"><a href="mailto:${member.email}" style="color:#c8a96e;">${member.email}</a></td>
        </tr>
        <tr>
          <td class="label">Phone</td>
          <td class="value">${member.phone ?? '—'}</td>
        </tr>
        <tr>
          <td class="label">Registered At</td>
          <td class="value">${formatDate(member.registeredAt)}</td>
        </tr>
      </table>
    </div>
    <!-- CTA -->
    <div class="cta-wrap">
      <a href="${adminUrl}" class="cta-button">View in Admin Panel →</a>
    </div>
  `;

    return wrapInShell(body);
}

// ── Plain-text fallback ──
function buildNewMemberPlain(member: NewMemberPayload): string {
    return [
        'Knights of Columbus — Council 5264 | NEW MEMBER REGISTRATION',
        '',
        `A new member has registered.`,
        '',
        '--- Member Details ---',
        `Name:         ${member.firstName} ${member.lastName}`,
        `Email:        ${member.email}`,
        `Phone:        ${member.phone ?? 'N/A'}`,
        `Registered:   ${formatDate(member.registeredAt)}`,
        '',
        member.notes ? `Notes: ${member.notes}` : '',
        '',
        `Admin Panel: ${appUrl()}/edit/members`,
        '',
        `© ${new Date().getFullYear()} Knights of Columbus — Council 5264`,
    ]
        .filter((l) => l !== null)
        .join('\n');
}

// ── Send function ──
export async function sendNewMemberNotification(member: NewMemberPayload): Promise<void> {
    const to = process.env.GK_EMAIL ?? 'gk@kofc5264.ca';

    await transporter.sendMail({
        from: `"KC Council 5264 — System" <${process.env.SMTP_FROM ?? process.env.SMTP_USER}>`,
        to,
        subject: `New Member Registration — ${member.firstName} ${member.lastName}`,
        text: buildNewMemberPlain(member),
        html: buildNewMemberHtml(member),
    });

    console.log(`[email] New member notification sent to ${to} for ${member.email}`);
}

// ---------------------------------------------------------------------------
// 2. EVENT REGISTRATION / VOLUNTEERING
// ---------------------------------------------------------------------------

// ── HTML template ──
function buildEventParticipationHtml(payload: EventParticipationPayload): string {
    const { event, member, participationType } = payload;

    const isVolunteer = participationType === 'volunteered';
    const pill = isVolunteer ? 'Volunteer' : 'Registration';
    const titleVerb = isVolunteer ? 'volunteered for' : 'registered for';
    const eventAdminUrl = `${appUrl()}/edit/events/${event.id}`;

    const body = /* html */ `
    <!-- Pill -->
    <div><span class="category-pill">${pill}</span></div>

    <!-- Title -->
    <h1 class="title">
      ${member.firstName} ${member.lastName} has ${titleVerb}<br />${event.title}.
    </h1>
    <div class="divider"></div>

    <!-- Member detail card -->
    <p class="section-label">Personnel Details</p>
    <div class="detail-card">
      <table>
        <tr>
          <td class="label">Full Name</td>
          <td class="value">${member.firstName} ${member.lastName}</td>
        </tr>
        <tr>
          <td class="label">Email</td>
          <td class="value"><a href="mailto:${member.email}" style="color:#c8a96e;">${member.email}</a></td>
        </tr>
        <tr>
          <td class="label">Phone</td>
          <td class="value">${member.phone ?? '—'}</td>
        </tr>
        <tr>
          <td class="label">Participation</td>
          <td class="value" style="text-transform:capitalize;">${participationType}</td>
        </tr>
      </table>
    </div>

    <!-- CTA -->
    <div class="cta-wrap">
      <a href="${eventAdminUrl}" class="cta-button">View Event in Admin →</a>
    </div>
  `;

    return wrapInShell(body);
}

// ── Plain-text fallback ──
function buildEventParticipationPlain(payload: EventParticipationPayload): string {
    const { event, member, participationType } = payload;
    const isVolunteer = participationType === 'volunteered';
    const titleVerb = isVolunteer ? 'volunteered for' : 'registered for';

    return [
        `Knights of Columbus — Council 5264 | EVENT ${participationType.toUpperCase()}`,
        '',
        `${member.firstName} ${member.lastName} has ${titleVerb}: ${event.title}`,
        '',
        '--- Event Details ---',
        `Event:       ${event.title}`,
        // `Date:        ${formatDate(event.date)}`,
        // `Location:    ${event.location ?? 'N/A'}`,
        // event.description ? `Description: ${event.description}` : '',
        '',
        '--- Personnel Details ---',
        `Name:        ${member.firstName} ${member.lastName}`,
        `Email:       ${member.email}`,
        `Phone:       ${member.phone ?? 'N/A'}`,
        `Type:        ${participationType}`,
        '',
        `Admin Panel: ${appUrl()}/edit/events/${event.id}`,
        '',
        `© ${new Date().getFullYear()} Knights of Columbus — Council 5264`,
    ]
        .filter((l) => l !== null)
        .join('\n');
}

// ── Send function ──
export async function sendEventParticipationNotification(
    payload: EventParticipationPayload,
): Promise<void> {
    const { member, event, participationType, notifyEmail } = payload;
    const isVolunteer = participationType === 'volunteered';
    const subjectVerb = isVolunteer ? 'Volunteered' : 'Registered';

    await transporter.sendMail({
        from: `"KC Council 5264 — System" <${process.env.SMTP_FROM ?? process.env.SMTP_USER}>`,
        to: notifyEmail,
        subject: `${subjectVerb}: ${member.firstName} ${member.lastName} — ${event.title}`,
        text: buildEventParticipationPlain(payload),
        html: buildEventParticipationHtml(payload),
    });

    console.log(
        `[email] Event ${participationType} notification sent to ${notifyEmail} ` +
        `(${member.email} → "${event.title}")`,
    );
}

// ---------------------------------------------------------------------------
// Newsletter
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

function buildEmailTemplate(newsletter: NewsletterPayload, unsubscribeUrl: string): string {
    const url = appUrl();
    const readMoreUrl = `${url}/newsletters/${newsletter.id}`;

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

    .hero-wrap {
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 36px;
      border: 1px solid #2e2b26;
    }

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

    .divider {
      width: 48px;
      height: 2px;
      background: #c8a96e;
      margin-bottom: 28px;
    }

    .excerpt {
      font-size: 16px;
      line-height: 1.75;
      color: #c9c0b2;
      margin-bottom: 36px;
    }

    .cta-wrap { margin-bottom: 48px; }
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

    .footer {
      border-top: 1px solid #2e2b26;
      padding-top: 32px;
      text-align: center;
    }
    .footer p { font-size: 12px; line-height: 1.8; color: #5a5346; }
    .footer a { color: #7d7061; text-decoration: underline; }

    @media (max-width: 480px) {
      .title { font-size: 28px; }
      .subtitle { font-size: 17px; }
      .masthead-brand { font-size: 18px; }
    }
  </style>
</head>
<body>
  <div class="wrapper">

    <div class="masthead">
      <a href="${url}" class="masthead-brand">Knights of Columbus - Council 5264</a>
      <span class="masthead-label">New Issue</span>
    </div>

    <div>
      <span class="category-pill">${category}</span>
    </div>

    ${heroBlock ? `<div class="hero-wrap">${heroBlock}</div>` : ''}

    <h1 class="title">${newsletter.title}</h1>

    ${newsletter.subtitle ? `<p class="subtitle">${newsletter.subtitle}</p>` : ''}

    <div class="divider"></div>

    <p class="excerpt">${excerpt}</p>

    ${newsletter.description
        ? `<div class="pull-quote"><p>${newsletter.description}</p></div>`
        : ''
    }

    <div class="cta-wrap">
      <a href="${readMoreUrl}" class="cta-button">Read the full issue →</a>
    </div>

    <div class="footer">
      <p>
        You're receiving this because you subscribed to <strong>Knights of Columbus - Council 5264</strong>.<br />
        <a href="${unsubscribeUrl}">Unsubscribe</a> &nbsp;·&nbsp;
        <a href="${url}">Visit the site</a>
      </p>
      <p style="margin-top:16px;">© ${new Date().getFullYear()} Knights of Columbus - Council 5264. All rights reserved.</p>
    </div>

  </div>
</body>
</html>
  `;
}

function buildPlainText(newsletter: NewsletterPayload, unsubscribeUrl: string): string {
    const url = appUrl();
    const readMoreUrl = `${url}/newsletters/${newsletter.id}`;
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

export async function sendNewsletterToSubscribers(newsletter: NewsletterPayload): Promise<void> {
    const url = appUrl();

    const subscribers = await prisma.newsletterSubscriber.findMany({
        where: { isActive: true },
        select: { email: true, id: true },
    });

    if (subscribers.length === 0) {
        console.log('[email] No active subscribers — skipping send.');
        return;
    }

    const results = await Promise.allSettled(
        subscribers.map(async (sub: { email: string; id: number }) => {
            const unsubscribeUrl = `${url}/unsubscribe?id=${sub.id}`;

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

export function scheduleNewsletterEmail(
    newsletter: NewsletterPayload,
    publishedDate: Date,
): void {
    const delay = publishedDate.getTime() - Date.now();

    if (delay <= 0) {
        sendNewsletterToSubscribers(newsletter).catch(console.error);
        return;
    }

    // Node's setTimeout supports up to ~24.8 days safely.
    // For longer delays use a persistent job queue (BullMQ, etc.).
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