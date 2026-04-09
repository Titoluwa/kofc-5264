import { NewsletterPayload } from '@/lib/constants';
import { appUrl } from '../utils';

export function buildNewsletterHtml(newsletter: NewsletterPayload, unsubscribeUrl: string): string {
    const url = appUrl();
    const readMoreUrl = `${url}/newsletters/${newsletter.id}`;

    const category  = newsletter.category ?? 'Newsletter';
    const hasContent = !!newsletter.content;
    const hasFile    = !!newsletter.file;

    // Excerpt only needed when there is text content
    const excerpt = (() => {
        if (!hasContent) return '';
        const plain = (newsletter.content || '').replaceAll(/<[^>]*>/g, '');
        return plain.length > 220 ? plain.slice(0, 220).trimEnd() + '…' : plain;
    })();

    const previewName = newsletter.file?.split('/').pop() ?? 'Newsletter File';

    const heroBlock = newsletter.heroImage
        ? `<img src="${newsletter.heroImage}" alt="${newsletter.title}" style="width:100%;max-height:360px;object-fit:cover;display:block;border-radius:0 0 2px 2px;" />`
        : '';

    // CTA block — differs based on content vs file
    let ctaBlock;
    if (hasContent) {
        // Read full issue
        ctaBlock = `
    <div class="cta-wrap">
      <a href="${readMoreUrl}" class="cta-button">Read the full issue →</a>
    </div>`;
    } else if (hasFile) {
        // File view + download
        ctaBlock = `
    <div class="file-card">
      <div class="file-icon">&#128196;</div>
      <div class="file-info">
        <p class="file-name">${previewName}</p>
        <p class="file-label">Newsletter Attachment</p>
      </div>
      <div class="file-actions">
        <a href="${newsletter.file}" target="_blank" class="file-btn file-btn-primary">View</a>
        <a href="${newsletter.file}" download class="file-btn file-btn-outline">Download</a>
      </div>
    </div>
    <div class="cta-wrap" style="margin-top:24px;">
      <a href="${readMoreUrl}" class="cta-button">View on site →</a>
    </div>`;
    } else {
        // No content or file — just link to site
        ctaBlock = `
    <div class="cta-wrap">
      <a href="${readMoreUrl}" class="cta-button">View on site →</a>
    </div>`;
    }

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

        .hero-wrap {
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 36px;
          border: 1px solid #2c3f6a;
        }

        .title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 36px;
          line-height: 1.18;
          font-weight: 700;
          color: #e6b121;
          margin-bottom: 14px;
          letter-spacing: -0.5px;
        }

        .subtitle {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 20px;
          line-height: 1.4;
          font-style: italic;
          color: #8a9bbf;
          margin-bottom: 28px;
        }

        .divider {
          width: 48px;
          height: 2px;
          background: #e6b121;
          margin-bottom: 28px;
        }

        .excerpt {
          font-size: 16px;
          line-height: 1.75;
          color: #dde4f0;
          margin-bottom: 36px;
        }

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

        /* File attachment card */
        .file-card {
          display: flex;
          align-items: center;
          gap: 16px;
          background: #1e2f52;
          border: 1px solid #2c3f6a;
          border-radius: 6px;
          padding: 18px 20px;
          margin-bottom: 0;
        }
        .file-icon {
          font-size: 28px;
          line-height: 1;
          flex-shrink: 0;
        }
        .file-info {
          flex: 1;
          min-width: 0;
        }
        .file-name {
          font-size: 14px;
          font-weight: 500;
          color: #dde4f0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 2px;
        }
        .file-label {
          font-size: 11px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #4e607f;
        }
        .file-actions {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
          margin-left: 10px;
          margin-right: 10px;
        }
        .file-btn {
          display: inline-block;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 3px;
        }
        .file-btn-primary {
          background: #e6b121;
          color: #1a2744 !important;
        }
        .file-btn-outline {
          background: transparent;
          color: #e6b121 !important;
          border: 1px solid #e6b121;
        }

        .pull-quote {
          border-left: 3px solid #e6b121;
          padding: 16px 24px;
          margin-bottom: 48px;
          background: #1e2f52;
          border-radius: 0 4px 4px 0;
        }
        .pull-quote p {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 17px;
          font-style: italic;
          line-height: 1.6;
          color: #dde4f0;
        }

        .footer {
          border-top: 1px solid #2c3f6a;
          padding-top: 32px;
          text-align: center;
        }
        .footer p { font-size: 12px; line-height: 1.8; color: #4e607f; }
        .footer a { color: #8a9bbf; text-decoration: underline; }

        @media (max-width: 480px) {
          .title { font-size: 28px; }
          .subtitle { font-size: 17px; }
          .masthead-brand { font-size: 18px; }
          .file-card { flex-wrap: wrap; }
          .file-actions { width: 100%; justify-content: flex-start; margin-left: 10px; margin-right: 10px; }
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

        ${hasContent ? `<p class="excerpt">${excerpt}</p>` : ''}

        ${newsletter.description
            ? `<div class="pull-quote"><p>${newsletter.description}</p></div>`
            : ''
        }

        ${ctaBlock}

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

export function buildNewsletterPlain(newsletter: NewsletterPayload, unsubscribeUrl: string): string {
    const url         = appUrl();
    const readMoreUrl = `${url}/newsletters/${newsletter.id}`;
    const hasContent  = !!newsletter.content;
    const hasFile     = !!newsletter.file;
    const previewName = newsletter.file?.split('/').pop() ?? 'Newsletter File';

    const excerpt = (() => {
        if (!hasContent) return '';
        const plain = (newsletter.content || '').replaceAll(/<[^>]*>/g, '');
        return plain.length > 220 ? plain.slice(0, 220).trimEnd() + '…' : plain;
    })();

    let contentLines: string[] = [];
    if (hasContent) {
        contentLines = [excerpt, ''];
    } else if (hasFile) {
        contentLines = [
            `This newsletter is available as a file attachment.`,
            `File: ${previewName}`,
            `View / Download: ${newsletter.file}`,
            '',
        ];
    }

    return [
        `KofC Council 5264 — ${(newsletter.category ?? 'Newsletter').toUpperCase()}`,
        '',
        newsletter.title,
        newsletter.subtitle ?? '',
        '',
        '---',
        '',
        ...contentLines,
        newsletter.description ? `"${newsletter.description}"` : '',
        '',
        `View on site: ${readMoreUrl}`,
        '',
        '---',
        `Unsubscribe: ${unsubscribeUrl}`,
        `© ${new Date().getFullYear()} Knights of Columbus - Council 5264`,
    ]
        .filter((l) => l !== null)
        .join('\n');
}