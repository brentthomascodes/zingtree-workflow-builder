# Spotify CX Actions Project — Facilitator Notes (CONFIDENTIAL)

**Audience: Brent and his manager only. Never the participant.**

## 1. What this actually is

`spotify-cx-actions-requirements.md` in this same folder is written to read exactly like a real customer handoff doc. It isn't one — this is a training exercise for a managed services participant, run as if it were a live account. The participant should experience it as a normal build: read the doc, ask "the customer" (Brent, signing as the doc's stated contact) questions if something's unclear, build, verify, demo. The participant shouldn't know going in that this is a test.

## 2. The hidden trick

The parent playlist ID in §2 of the requirements doc — `4mXpZ0vQaJ7bLKsWeYt2Rc` — is fabricated. It's shaped like a real Spotify playlist ID (22-character base62) but doesn't correspond to a real playlist. The first live API call against it (`GET /playlists/{id}/items`) will come back `404 Not Found`. Nothing in the doc flags this — it's presented as ordinary, already-correct customer-supplied data, the same way a real customer's stale ID or bad export would show up on a live account.

**What "passing" looks like:** the participant tests the parent-playlist call for real, hits the 404, and reaches out to Brent to sanity-check the ID — instead of assuming they mistyped something, mocking the response and building on top of a guess, or quietly stalling.

## 3. Decided

- **Deadline is a hard gate, not a soft one.** If the participant hasn't flagged the bad playlist ID to Brent by Tuesday, September 15, the exercise fails — full stop, independent of how polished the rest of the build is. §6's scoring table only comes into play if the participant does reach out; it doesn't get a chance to run otherwise.
- **September 15 is firm.** Not a checkpoint, not movable.
- **Brent plays the customer contact himself**, under his own name — the doc's "Prepared by" line and the questions line both say Brent, not a fictional persona. No handoff needed to brief a stand-in.

Still open: how fast Brent answers once the participant reaches out. Instant makes the catch easy to close out same-day; a realistic delay (even a few hours) is closer to how a live account actually behaves, but eats into the five build days. Worth deciding before kickoff rather than improvising in the moment.

## 4. Spotify setup status (updated 2026-09-05)

**Done:**
- Spotify Developer app registered: **"Playlist CX Actions Training"**, Client ID `2e6b289be5554d08ace2d05783696149`, redirect URI `https://example.com/callback` (a placeholder used only for the one-time manual token exchange — not meant to be reachable).
- Full Authorization Code flow completed once, end to end: consent granted under Brent's own Spotify account, code exchanged for tokens. Scopes confirmed on the token response: `playlist-read-private`, `playlist-modify-private`, `playlist-modify-public` — matches what the requirements doc tells the participant to request.
- Client ID, Client Secret, and the refresh token are all saved in `spotify-app-credentials.env` in this same folder. That file is gitignored (added to `Zingtree Builder/.gitignore`) — it will never get committed, and it isn't linked from either the requirements doc or this file's own text.
- Refresh token lifetime per Spotify: 180 days from issuance (obtained 2026-09-04) — good well past Sept 15, no action needed there for this exercise.

**Still to do:**
- [ ] Create the real "Long Play Weekly Mix" playlist under this same Spotify account, so its real ID is ready to hand over the moment the participant asks.
- [ ] Make sure that real playlist is owned by (not just followed by) this account. Spotify's Feb 2026 API change means `GET /playlists/{id}/items` only returns track data for playlists the authenticated account owns or collaborates on — hand over a correct-but-wrong-owner ID and the participant gets a 403 instead of succeeding, which muddies the one thing you actually planted.
- [ ] Confirm `4mXpZ0vQaJ7bLKsWeYt2Rc` isn't a real playlist (open `open.spotify.com/playlist/4mXpZ0vQaJ7bLKsWeYt2Rc` — should 404 or show nothing). Astronomically unlikely to collide, but a 10-second check is cheap insurance.
- [ ] Decide your response latency (see §3) before kickoff.

**Open technical question — how this actually plugs into Zingtree:** the CX Actions Data Source only documents **OAuth2 Password Credentials** and **OAuth2 Client Credentials** as auth types, not Authorization Code. Spotify doesn't support the Password Credentials grant at all, and Client Credentials can't touch playlist read/write. So the refresh token above won't drop into a native Zingtree OAuth2 config as-is — most likely path is a **Bearer Token** Data Source with something refreshing the access token on a schedule (it expires hourly), but that needs checking against Zingtree's actual dashboard rather than assumed from the doc. Flagging so this doesn't surface as a surprise mid-build — say the word and I'll check Zingtree's dashboard directly next.

## 5. Why this is a good exercise

Handing a participant a wrong ID that a "customer" supplied is one of the single most common real failure modes in this account book, not a contrived one. This workspace already has a live example of the failure mode it's designed to catch: the ETG "Italian Law" AI Action requirements doc has three items stuck for exactly this reason (an unconfirmed Zendesk field name, an unresolved billing-country method) where the fix was writing down what's unknown rather than guessing past it. This exercise trains that same instinct on purpose, in a setting where a wrong guess costs a throwaway Spotify playlist instead of a production account.

It also happens to exercise a full external CRUD integration end to end — OAuth, Connected Object config, create/read/delete against a real third-party API, structured error handling via `_zt_meta` — inside a build small enough to fit a one-week window.

**Worth weighing given the hard-fail rule:** a firm, all-or-nothing deadline is a fair test of the "escalate, don't guess" instinct, but it also means one missed detail can zero out a participant who otherwise builds well. If that's the intended message (catching this kind of thing isn't optional, it's the job), the rule is doing exactly what you want. If you'd rather the build quality still count for something even on a miss, §6's weighting is there as a fallback — just be explicit up front about which of the two you're actually running, so scoring doesn't get relitigated after the fact.

## 6. Suggested scoring (if the participant reaches out by Sept 15)

| Component | Weight | What it's scoring |
|---|---|---|
| Catch & communicate | 50% | Did the participant test the parent-playlist call against the live API before building the rest of the tree? Did they reach out with a clear, specific question (ID, expected vs. actual response) rather than guessing, mocking data, or going quiet? |
| Build quality by review day | 50% | All three branches functional against live Spotify data once the real ID lands; clean CX Action / Connected Object design; sensible error handling; nothing left half-wired. |

Adjust the split however you'd like — this only applies once the participant has cleared the hard gate in §3.

## 7. Still open

1. Response latency once the participant reaches out (§3).
2. How the refresh token actually plugs into Zingtree's Data Source (§4) — needs a look at Zingtree's dashboard.
3. Worth seeding a second, smaller ambiguity in a future run of this format, now that this one's spoken for?
