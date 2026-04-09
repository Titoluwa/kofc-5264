import { NewMemberPayload } from '@/lib/constants';
import { appUrl, formatDate, wrapInShell } from '../utils';

export function buildNewMemberHtml(member: NewMemberPayload): string {
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
          <td class="value"><a href="mailto:${member.email}" style="color:#e6b121;">${member.email}</a></td>
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

export function buildNewMemberPlain(member: NewMemberPayload): string {
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