import { EventParticipationPayload } from '@/lib/constants';
import { appUrl, wrapInShell } from '../utils';

export function buildEventParticipationHtml(payload: EventParticipationPayload): string {
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
          <td class="value"><a href="mailto:${member.email}" style="color:#e6b121;">${member.email}</a></td>
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

export function buildEventParticipationPlain(payload: EventParticipationPayload): string {
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