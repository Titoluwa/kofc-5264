import { prisma } from '@/lib/db';
import { transporter } from '../transporter';
import { NewsletterPayload } from '@/lib/constants';
import { appUrl } from '../utils';
import { buildNewsletterHtml, buildNewsletterPlain } from '../templates/newsletter';

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
                text: buildNewsletterPlain(newsletter, unsubscribeUrl),
                html: buildNewsletterHtml(newsletter, unsubscribeUrl),
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