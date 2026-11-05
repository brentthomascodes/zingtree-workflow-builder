/* -- Italy EU-location compliance -> agent note card ------------------
   Node 5 "Classify & Render Disclosure" (formerly "Handle response").
   2026-09-01: merged in the classification logic that used to live in
   AI Action #14 (node 4, gemini-2.5-flash). The three rules it evaluated
   (phone/billing "is this an Italian customer" check, static EU-country-
   list membership, order-number "40-" prefix) are pure deterministic
   boolean/string logic -- no judgment call for a model to make -- and
   routing them through an LLM meant the same inputs could occasionally
   classify differently between runs. Node 4 is deleted; this script now
   computes applies/isItalian/agentInEU/isBcom/orderSource/scriptKey
   itself from the same four form vars node 8 already sets, then builds
   the note card exactly as before.
   Inputs:  customer_phone, billing_country, order_number, agent_country
            (form vars, set by node 8 "Map Edvin Data").
   Output:  transforms.italy_note (HTML card, rendered on node 1 via
            ${transforms.italy_note}); italy_applies / italy_isItalian /
            italy_agentInEU / italy_isBcom / italy_orderSource /
            italy_scriptKey (form vars, for node 1's debug echo -- these
            replace the old ${actions.italy_region_compliance.*} merge
            fields, which no longer exist now that there is no AI Action
            output namespace to read from).
   The approved script text still lives ONLY in the SCRIPTS lookup below,
   entirely in code -- never in an editor textarea that can strip
   characters or reject unicode.
   Non-ASCII Italian characters are written as \u escapes so the script's
   SOURCE stays pure ASCII (the Zingtree script engine rejects unicode/
   curly quotes in source text) while the runtime STRING still contains
   the real character (the letter o-with-grave, escaped as \u00F2 below).  */

// 1) Deterministic classification (was AI Action #14) -------------------
// Confirmed with Brent 2026-09-01: a missing/unrecognized agent_country
// must never fall back to "not applicable." applies/isItalian are decided
// from the customer's data alone (phone + billing country) and never look
// at agent_country at all. agent_country is evaluated only when present,
// and only to pick eu_* vs noneu_* for an already-applicable ticket: when
// it's blank or not on the EU list, agentInEU is false (the disclosure-
// COMPLETE branch -- it adds the "you may request an EU agent" line
// rather than omitting it). agentKnown is carried separately so the card
// can still warn the agent when the location was never actually
// confirmed.
// 2026-09-01 (bugfix): Edvin's phoneNumber comes back in several dial-code
// shapes for the same country -- "+39 ...", "0039 ...", or (seen in
// production) a bare "39 3397874018" with no + and no 00 trunk prefix at
// all. The original +39/0039-only prefix check missed that third shape
// entirely, so a real Italian customer classified as not Italian -- this
// was very likely the actual source of the old AI Action's "same input,
// different result" symptom too: a bare "39 ..." number doesn't cleanly
// satisfy a literal "+39/0039" instruction, so the model was left to use
// judgment on exactly this kind of input, and judgment calls are where
// sampling variance shows up. isItalianPhone() strips every non-digit
// character (space, dash, dot, parens, plus sign) before checking, so all
// three shapes normalize to the same digit string. No other ITU calling
// code is "39", so a leading "39" is unambiguously Italy for a field that
// is always country-code-first the way Edvin's is.
const EU_COUNTRIES = ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE',
  'GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE'];

function normalizedDigits(raw) {
  return String(raw || '').replace(/\D/g, '');
}
function isItalianPhone(raw) {
  const d = normalizedDigits(raw);
  return d.indexOf('39') === 0 || d.indexOf('0039') === 0;
}

function classify(phone, billingCountry, orderNumber, agentCountry) {
  const b = String(billingCountry || '').trim().toLowerCase();
  const o = String(orderNumber || '').trim();
  const a = String(agentCountry || '').trim().toUpperCase();

  const isItalian = isItalianPhone(phone) || b === 'it' || b === 'italy';

  const agentKnown = a !== '';
  const agentInEU = agentKnown && EU_COUNTRIES.indexOf(a) !== -1;

  const isBcom = o.indexOf('40-') === 0;
  const orderSource = isBcom ? 'bcom' : 'own_brand';

  const applies = isItalian;
  let scriptKey = '';
  if (applies) {
    scriptKey = agentInEU
      ? (isBcom ? 'eu_bcom' : 'eu_own')
      : (isBcom ? 'noneu_bcom' : 'noneu_own');
  }

  return { applies, isItalian, agentInEU, agentKnown, isBcom, orderSource, scriptKey };
}

const ai = classify(
  ZT.getVariableValue('customer_phone', ''),
  ZT.getVariableValue('billing_country', ''),
  ZT.getVariableValue('order_number', ''),
  ZT.getVariableValue('agent_country', '')
);

// Publish the classification as form vars (scalars -> setFormData, per the
// canonical data-setting rule) so node 1's debug echo -- and anything else
// downstream -- can read them by plain merge field, the same way
// ${actions.italy_region_compliance.*} used to work.
ZT.setFormData('italy_applies', ai.applies);
ZT.setFormData('italy_isItalian', ai.isItalian);
ZT.setFormData('italy_agentInEU', ai.agentInEU);
ZT.setFormData('italy_isBcom', ai.isBcom);
ZT.setFormData('italy_orderSource', ai.orderSource);
ZT.setFormData('italy_scriptKey', ai.scriptKey);

// Approved scripts, verbatim, keyed by scriptKey.
// EN + IT lines in one string, separated by \n, each prefixed EN:/IT:.
const SCRIPTS = {
  eu_bcom:
    'EN: Thank you for calling ${brand} Support, in partnership with Booking.com. ${agent_first_name} speaking from ${city}. May I have your name please?\n' +
    'IT: Grazie per aver chiamato l\'Assistenza Clienti di ${brand}, in partnership con Booking.com. Sono ${agent_first_name} e rispondo da ${city}. Posso chiderle il suo nome?',
  eu_own:
    'EN: Thank you for calling ${brand} Support, ${agent_first_name} speaking from ${city}. May I have your name please?\n' +
    'IT: Grazie per aver chiamato l\'Assistenza Clienti di ${brand}. Sono ${agent_first_name} e rispondo da ${city}. Posso chiderle il suo nome?',
  noneu_bcom:
    'EN: Thank you for calling ${brand} Support, in partnership with Booking.com. ${agent_first_name} speaking from ${city}. For your information, you can request to speak with an agent located within the EU, if you prefer. May I have your name please?\n' +
    'IT: Grazie per aver chiamato l\'Assistenza Clienti di ${brand}, in partnership con Booking.com. Sono ${agent_first_name} e rispondo da ${city}. Per sua informazione, pu\u00F2 richiedere che la chiamata venga trasferita un agente in Europa, se preferisce. Posso chiderle il suo nome?',
  noneu_own:
    'EN: Thank you for calling ${brand} Support, ${agent_first_name} speaking from ${city}. For your information, you can request to speak with an agent located within the EU, if you prefer. May I have your name please?\n' +
    'IT: Grazie per aver chiamato l\'Assistenza Clienti di ${brand}. Sono ${agent_first_name} e rispondo da ${city}. Per sua informazione, pu\u00F2 richiedere che la chiamata venga trasferita un agente in Europa, se preferisce. Posso chiderle il suo nome?'
};

const esc = s => { s = s == null ? '' : String(s);
  try { return ZT.htmlEncode(s); }
  catch (e) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
};

const isItalian = ai.isItalian;
const applies   = ai.applies;
const isBcom    = ai.isBcom;
const agentInEU  = ai.agentInEU;
const agentKnown = ai.agentKnown;
const sourceLabel = ai.orderSource === 'bcom' ? 'Booking.com' : 'Own brand';

// The scriptKey this ticket classified into. Validate it against the known
// keys -- an unrecognized value would mean a bug in classify() above, not
// model drift anymore, but the fail-closed warning branch stays as a
// defensive backstop.
const scriptKeyRaw = ai.scriptKey;
const approvedScript = applies && Object.prototype.hasOwnProperty.call(SCRIPTS, scriptKeyRaw)
  ? SCRIPTS[scriptKeyRaw]
  : '';

// 2) Palette (Adyen playbook tokens)
const P = {
  green:'#1f9d6b', greenInk:'#137a52', greenSoft:'#eaf7f1', greenBorder:'#cbe9dc',
  ink:'#1a1c1e', ink2:'#585f66', ink3:'#8b929a', line:'#e8eaed', bg:'#ffffff',
  amberBg:'#fff8e6', amberInk:'#8a6d1a', amberBorder:'#f2e4b8',
  radius:'14px', shadow:'0 1px 2px rgba(16,24,40,.04), 0 8px 24px rgba(16,24,40,.06)'
};

// 3) State
const state = !isItalian ? 'na' : applies ? 'action' : 'noaction';

const badge = (text, tone) => {
  const m = { action:{bg:P.amberBg,fg:P.amberInk,bd:P.amberBorder},
              good:{bg:P.greenSoft,fg:P.greenInk,bd:P.greenBorder},
              neutral:{bg:'#f0f1f3',fg:P.ink3,bd:P.line} }[tone];
  return `<span style="font-size:11.5px;font-weight:700;letter-spacing:.02em;text-transform:uppercase;color:${m.fg};background:${m.bg};border:1px solid ${m.bd};padding:4px 10px;border-radius:999px;white-space:nowrap;">${text}</span>`;
};
const chip = (label, val, tone) => {
  const c = tone==='good' ? {bg:P.greenSoft,bd:P.greenBorder,fg:P.greenInk}
    : tone==='warn' ? {bg:P.amberBg,bd:P.amberBorder,fg:P.amberInk}
    : {bg:'#f6f7f8',bd:P.line,fg:P.ink2};
  return `<span style="display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:600;color:${c.fg};background:${c.bg};border:1px solid ${c.bd};padding:5px 11px;border-radius:999px;">${label} <b style="font-weight:700;">${esc(val)}</b></span>`;
};

const accent = state==='action' ? '#e0a92a' : state==='noaction' ? P.green : '#c8cdd2';
const title = { action:'Italian EU-location disclosure required',
                noaction:'No disclosure action required',
                na:'No Italian compliance flag' }[state];
const badgeHtml = { action:badge('Action required','action'),
                    noaction:badge('No action needed','good'),
                    na:badge('Not applicable','neutral') }[state];

// Chips
let chips = '';
if (state !== 'na') {
  chips += chip('Customer', 'Italy', 'neutral');
  chips += agentKnown
    ? chip('Agent', agentInEU ? 'In EU' : 'Outside EU', agentInEU ? 'good' : 'warn')
    : chip('Agent', 'Location unknown', 'warn');
  chips += chip('Order', sourceLabel, 'neutral');
}

// Renders the verbatim approved script. Splits the combined payload into
// its EN / IT lines and labels each; placeholders like ${brand} and
// ${city} are Zingtree merge fields, resolved before this string is
// ever seen here (or left literal if the underlying var is empty).
const renderApprovedScript = raw => {
  let lines = raw.split(/\r?\n+/).map(l => l.trim()).filter(Boolean);
  if (lines.length === 1 && /\sIT:\s/.test(lines[0])) {
    const i = lines[0].search(/\bIT:\s/);
    lines = [lines[0].slice(0, i).trim(), lines[0].slice(i).trim()];
  }
  return lines.map(l => {
    const m = l.match(/^(EN|IT)\s*:\s*(.*)$/);
    const label = m ? (m[1] === 'EN' ? 'English' : 'Italian') : '';
    const text = m ? m[2] : l;
    const labelHtml = label
      ? `<span style="font-size:10.5px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:${P.greenInk};margin-right:7px;">${label}</span>`
      : '';
    return `<div style="font-size:14.5px;color:${P.ink};font-style:italic;margin-top:6px;">${labelHtml}&ldquo;${esc(text)}&rdquo;</div>`;
  }).join('');
};

// Body
let body = '';
if (state === 'action') {
  const scriptHtml = approvedScript
    ? renderApprovedScript(approvedScript)
    : `<div style="font-size:14.5px;color:${P.amberInk};">No approved script matched (scriptKey "${esc(scriptKeyRaw)}" not recognized) &mdash; do not improvise the disclosure. Check Execution Insights and re-run, or escalate.</div>`;
  const foot = !agentInEU
    ? `<div style="font-size:12.5px;color:${P.ink2};margin-top:9px;">If the customer asks to speak with an EU-based agent, transfer to an EU-based operator.</div>`
    : '';
  const caution = !agentKnown
    ? `<div style="font-size:12.5px;color:${P.amberInk};margin-top:9px;">Agent location could not be confirmed &mdash; verify before proceeding and do not skip the disclosure.</div>`
    : '';
  body = `<div style="background:${P.greenSoft};border:1px solid ${P.greenBorder};border-radius:12px;padding:13px 15px;">
      <div style="font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:${P.greenInk};margin-bottom:4px;">Read to the customer &mdash; verbatim</div>
      ${scriptHtml}${foot}${caution}
    </div>`;
} else if (state === 'noaction') {
  const reason = isBcom
    ? `This is a ${esc(sourceLabel)} booking, so the Italian EU-location disclosure is handled by the booking channel &mdash; no action needed from you on this contact.`
    : agentInEU
      ? `You are answering from within the EU, so no out-of-EU disclosure or transfer offer is required.`
      : `No Italian EU-location disclosure is required for this contact.`;
  body = `<div style="font-size:14px;color:${P.ink2};">${reason}</div>`;
} else {
  body = `<div style="font-size:14px;color:${P.ink3};">No Italian EU-location disclosure applies to this contact.</div>`;
}

// 4) Assemble + store
const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,system-ui,sans-serif;width:100%;max-width:640px;background:${P.bg};border:1px solid ${P.line};border-left:4px solid ${accent};border-radius:${P.radius};box-shadow:${P.shadow};overflow:hidden;color:${P.ink};line-height:1.5;">
  <div style="padding:16px 18px 18px;">
    <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px;">
      <span style="font-size:11.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:${P.ink3};">Italy &middot; EU-location compliance</span>
      ${badgeHtml}
    </div>
    <div style="font-size:16px;font-weight:650;letter-spacing:-.01em;margin:0 0 14px;">${title}</div>
    ${chips ? `<div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:${state==='action'?'16px':'4px'};">${chips}</div>` : ''}
    ${body}
  </div>
</div>`;

ZT.setTransformData('italy_note', html);

///

// 5) Internal note (Zendesk, agent-invisible) -- audit trail of the
//    compliance determination and whether the disclosure was actually
//    read. Posted through the same Connected Object 57 ("Zendesk - Add
//    Internal Note") as the ETG "Register Errands - Dynamic" tree's node
//    21 "Format Internal Note" -- matching that node's exact formatting
//    convention here (2026-09-02, per Brent) rather than the HTML/<b>
//    guess from the previous pass, since CO 57 is proven in production to
//    render **markdown bold**, not raw HTML tags: **Label** for bold,
//    \n\n between blocks for a blank line, \n within a block for a plain
//    line break, and JSON.stringify(...).slice(1, -1) to escape the whole
//    string for the Connected Object's JSON body -- not a hand-rolled
//    replace() chain, which is what node 21 does too.

const g = (k, def = '') => ZT.getVariableValue(k, def);

// approvedScript still has its ${brand}/${agent_first_name}/${city} tokens
// literal -- those only get resolved by Zingtree's merge-field engine when
// a string is rendered through a content node's ${transforms.italy_note}.
// This note is posted straight to a Connected Object body instead, so it
// never passes through that engine -- resolve the tokens by hand here or
// the ticket would get the literal "${city}" text instead of the agent's
// city. No escaping needed on the substituted values (node 21 doesn't
// escape its PNR/contact-reason values either) since this is markdown
// text, not HTML.
const resolveMergeFields = raw => String(raw || '')
  .replace(/\$\{brand\}/g, g('brand'))
  .replace(/\$\{agent_first_name\}/g, g('agent_first_name'))
  .replace(/\$\{city\}/g, g('city'));

// Per Brent 2026-09-01: the internal note exists to record the EN/IT
// disclosure the agent actually read -- everything else (agent name,
// EU status, order source, matched key) is noise for this note now that
// classify() is deterministic and auditable from the tree itself.
const noteBlocks = ['Italy EU-location compliance check'];

if (!isItalian) {
  noteBlocks.push('_Not an Italian contact -- compliance check not applicable._');
} else if (approvedScript) {
  const resolvedScript = resolveMergeFields(approvedScript);
  const scriptLines = resolvedScript.split(/\r?\n+/).map(l => l.trim()).filter(Boolean);
  const labeledLines = scriptLines.map(l => {
    const m = l.match(/^(EN|IT)\s*:\s*(.*)$/);
    const label = m ? (m[1] === 'EN' ? 'English' : 'Italian') : '';
    const text = m ? m[2] : l;
    return label ? `**${label}:** ${text}` : text;
  });
  noteBlocks.push('Disclosure read to customer:');
  noteBlocks.push(labeledLines.join('\n\n')); // blank line between English and Italian
} else {
  // Defensive backstop only -- classify() always returns one of the four
  // known scriptKeys when applies is true, so SCRIPTS[scriptKeyRaw] should
  // never actually miss.
  noteBlocks.push(`_DISCLOSURE NOT READ -- no approved script matched scriptKey "${scriptKeyRaw}", escalated._`);
}

const internal_note_details = noteBlocks.join('\n\n');
const stringified_note_details = JSON.stringify(internal_note_details).slice(1, -1);
ZT.setTransformData('internal_note_details', stringified_note_details);
