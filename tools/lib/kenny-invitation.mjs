// Example for tools/lib/kenny-invitation.mjs in the site source generator.
// This is static markup, not inlined JavaScript or CSS.
export const kennyInvitationHtml = `<!-- Include once in the shared layout, outside the page's main content. -->
<aside class="sts-kenny hidden" id="stsKennyRoot" role="region" aria-label="Kenny, your Cyber Guide">
  <div class="kenny-pop">
    <button type="button" id="inviteClose" class="kenny-pop-close" aria-label="Dismiss Kenny">×</button>
    <div class="kenny-pop-copy">
      <p id="kennyGreeting" class="kenny-hello" aria-hidden="true">Hello!</p>
      <div id="kennyScript" class="kenny-script hidden"></div>
      <div id="kennyActions" class="kenny-pop-actions hidden">
        <button type="button" class="button button-primary button-small" id="invitePlay">Play now <span aria-hidden="true">↗</span></button>
        <button type="button" class="button button-quiet button-small" id="inviteNotNow">Not now</button>
      </div>
    </div>
    <div id="kennyAnnouncement" class="sr-only" role="status" aria-live="polite" aria-atomic="true"></div>
    <div class="kenny-pop-robot" aria-hidden="true"><span class="kenny-pop-aura"></span><div id="inviteRobot" class="kenny-pop-avatar"></div><span class="kenny-pop-floor"></span></div>
  </div>
</aside>
`;
