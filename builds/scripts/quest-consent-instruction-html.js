// ============================================================================
// Quest Consent - Agent Workflow (tree 208427015)
// Node 17 "Continue" -- APPEND THIS TO THE END OF THE EXISTING SCRIPT
// ----------------------------------------------------------------------------
// Why: node 11 "Verbal Consent Script" needs the consent language rendered as
//      readable HTML paragraphs so the agent can read it verbatim on the
//      unable-to-respond fallback path. The dictionary stores it as plain text
//      with \n\n paragraph breaks, which collapses to one wall of text in a
//      content node.
// Inputs : consent_instruction (already set above by the dictionary lookup)
// Outputs: transforms.consent_instruction_html  (paragraph-wrapped HTML)
//          form.has_consent_instruction         ("1" / "0" guard for logic)
// Rule   : HTML built as a stringified value -> setTransformData
// ============================================================================

function escapeHtml(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Split on blank lines first, then treat single newlines as line breaks.
function toParagraphHtml(text) {
  var blocks = String(text || "").split(/\n\s*\n/);
    var out = "";
  for (var i = 0; i < blocks.length; i++) {
    var block = blocks[i].replace(/^\s+|\s+$/g, "");
    if (!block) { continue; }
    out += '<p style="margin:0 0 12px; line-height:1.6;">' +
           escapeHtml(block).replace(/\n/g, "<br>") +
           "</p>";
  }
  return out;
}

var consent_html = toParagraphHtml(consent_instruction);

ZT.setTransformData("consent_instruction_html", consent_html);
ZT.setFormData("has_consent_instruction", consent_instruction ? "1" : "0");
