import { transporter } from '../transporter';
import { EventParticipationPayload } from '@/lib/constants';
import { buildEventParticipationHtml, buildEventParticipationPlain } from '../templates/event';

export async function sendEventParticipationNotification(
    payload: EventParticipationPayload,
): Promise<boolean> {
    const { member, event, participationType, notifyEmail } = payload;
    const isVolunteer = participationType === 'volunteered';
    const subjectVerb = isVolunteer ? 'Volunteered' : 'Registered';

    await transporter.sendMail({
        from: `"KofC Council 5264" <${process.env.SMTP_FROM ?? process.env.SMTP_USER}>`,
        to: notifyEmail,
        subject: `${subjectVerb}: ${member.firstName} ${member.lastName} — ${event.title}`,
        text: buildEventParticipationPlain(payload),
        html: buildEventParticipationHtml(payload),
    });

    console.log(
        `[email] Event ${participationType} notification sent to ${notifyEmail} ` +
        `(${member.email} → "${event.title}")`,
    );
    return true;
}