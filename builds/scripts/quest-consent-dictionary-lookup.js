// Source session: "Quest consent form requirements" (local_7961496f-4bbe-4a00-9aab-20a3a71a4808)
// Account/customer: Quest Diagnostics (WHS Service Center consent/attestation flow)
// Purpose: Script Node that maps a consent name to its full consent/HIPAA
//          instruction text and exposes it as consent_instruction for a
//          Content Node.
//
// IMPORTANT NOTES CAPTURED FROM THE SESSION:
// - Zingtree's script engine is ES5: `let` throws "let is undefined" — use `var`.
// - Values must be ASCII-normalized: curly quotes, em/en-dashes, ellipses,
//   bullets, non-breaking/zero-width spaces break the script; remaining
//   non-ASCII chars should be \uXXXX-escaped; Excel `_x000D_` artifacts become
//   real newlines.
// - Keys must EXACTLY match the spreadsheet's Consent Name column, including
//   quirks like the double space in the Rock and Roll Hall of FAme entry.
// - Add `|| ""` fallback so an unmatched name sets empty string, not undefined.
// - The finished file (all 18 entries, values reflowed into clean prose) is
//   saved alongside this one as zt-scripts/quest_consent_dictionary.js — use
//   that for the full dictionary. This file documents the session-derived
//   requirements and the exact lookup logic.
//
// The exact 18 active dictionary keys:
//   "AutoNation Consent"
//   "Honeywell International Inc"
//   "BCBS of Alabama Custom Consent"
//   "ParTNers For Health Consent"
//   "Solutions Program Authorization for Release of Health Screening Results  Rock and Roll Hall of FAme"
//   "ShareCare 1272020"
//   "SHBP 2020"
//   "Cigna Consent English 2024"
//   "Cigna Consent Spanish 2020"
//   "Choose Healthy Life HIPAA Authorization"
//   "Crown 2023 Custom Consent"
//   "Occ Health"
//   "Qual Med"
//   "Occ Health Custom Consent"
//   "Asarco Consent"
//   "HealthyQuest BFW HIPAA Authorization 08292025"
//   "Quad med"
//   "Honeywell Aerospace Custom Consent"
//
// Separate finding: the Healthy Quest 2026 "attestation" (Blueprint for Wellness
// Research Informed Consent) is NOT one of these 18 — it is a multi-step
// questionnaire (acknowledgment sections + 2 yes/no decisions) that belongs in
// its own Zingtree branch, not in this dictionary lookup.

var dictionary = {
    // ... 18 entries: "Consent Name": "full ASCII-normalized instruction text", e.g.:
    "Sample Consent": "This is a custom consent sample. This is where clients can provide additional information, as legally required, about what the information obtained in this program may be used for at an individual level (eg, incentives) or aggregate level."
    // (full values live in quest_consent_dictionary.js in the source session's outputs)
};

// Verbatim lookup logic from the session (original pasted version used `let`,
// which fails in Zingtree; final version uses `var` + fallback):
var consent_instruction = dictionary[ZT.getVariableValue("company", "")] || "";
ZT.setFormData("consent_instruction", consent_instruction);
