import { transporter } from '../transporter';
import { NewMemberPayload } from '@/lib/constants';
import { buildNewMemberHtml, buildNewMemberPlain } from '../templates/new-member';

export async function sendNewMemberNotification(member: NewMemberPayload): Promise<boolean> {
    const to = process.env.GK_EMAIL ?? 'gk@kofc5264.ca';

    await transporter.sendMail({
        from: `"KofC Council 5264" <${process.env.SMTP_FROM ?? process.env.SMTP_USER}>`,
        to,
        subject: `New Member Registration — ${member.firstName} ${member.lastName}`,
        text: buildNewMemberPlain(member),
        html: buildNewMemberHtml(member),
    });

    console.log(`[email] New member notification sent to ${to} for ${member.email}`);
    return true;
}