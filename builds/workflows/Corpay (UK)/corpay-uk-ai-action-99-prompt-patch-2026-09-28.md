# AI Action 99 (Homecharge generation) — prompt patch, 2026-09-28

These three tracker items live in the generation AI Action's prompt, not in the tree JSON. Apply them in sandbox AI Action **99** (`automate_hc_email_generation_int`), test, then carry them to UK AI Action **18** with the INT promote.

Add to **Constraints**:

## Tracker 16: Update Charger Information formatting (bullets, paragraph spacing)

> Write the reply as HTML. Put each paragraph in its own `<p>` so paragraphs are visibly separated. Use a bulleted list (`<ul><li>`) only where the approved template itself is a list. Never turn a sentence of the template into a bullet, never add a bullet the template does not have, and never put a bullet character (•, -, *) at the start of a `<p>`.

## Tracker 23: Payment Query, "Below is an email template you may use…"

> In the Payment Query reply, the example email that follows "Below is an email template you may use" must be in the same font, size and style as the rest of the reply. Show it as normal `<p>` paragraphs wrapped in double quotation marks: an opening " before its first line and a closing " after its last line. Do not use `<blockquote>`, headings, `<big>`, `font-size` or any other styling for it.

## Tracker 24: Payment Query video link text

> Where the Payment Query reply links to a video, use these link texts exactly, and never "Payment Video 1" / "Payment Video 2":
> - `https://premiercxvideo.wistia.com/medias/a1lzdtoahn` → **Viewing your Homecharge payments**
> - `https://premiercxvideo.wistia.com/medias/i5kc5vzc0l` → **Missing payments**

Also update the two links inside the approved Payment Query template text in the same prompt, so the source copy matches.

## Test after applying

Run these Test Mode scenarios: `test_hc_update_charger_details`, `test_hc_payment_query_dd_increase`, `test_hc_payment_query_underpayment`.
