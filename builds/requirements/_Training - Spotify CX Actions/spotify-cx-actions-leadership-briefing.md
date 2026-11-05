# Spotify CX Actions Training Exercise — Briefing for Danna & Debbie

**From:** Brent Thomas
**Audience:** Danna Leahy, Debbie McCormick
**Confidential — do not share with the participant before this concludes.**

## What this is

A live-fire training exercise for a managed services participant, run to look exactly like a real customer project. The "customer" is fictional (Long Play Media, a playlist-curation company); the build is real — a Zingtree CX Actions workflow that lets a support agent create a new Spotify playlist from an existing one, generate one with AI assistance, or delete a song, all against the live Spotify Web API. The participant gets a standard-looking requirements doc and builds it the way they'd build any account.

## Why

One thing quietly breaks more builds in this account book than anything else: someone builds ahead of a piece of customer-supplied data that's wrong, instead of testing it early and asking. It's not hypothetical — this workspace has a live example right now in the ETG "Italian Law" AI Action requirements doc, where three items are stuck because a field name or method was never confirmed and nobody wanted to guess past it. This exercise trains the opposite habit directly, in a setting where getting it wrong costs a throwaway Spotify playlist instead of a customer relationship. It's also a direct test of the standard you've asked for in project handovers, Danna — reliable, trustworthy, streamlined — since the whole point is whether the participant treats an unverified customer input as something to confirm before building on it.

## How it's framed to the participant

They receive `spotify-cx-actions-requirements.md` (this folder) with no indication it's anything other than a normal account. It reads like a real customer wrote it — named contact, background, scope, a technical appendix on accessing the Spotify API. Nothing marks it as an exercise.

## The mechanism

The doc's "default playlist" — the one every build branch reads from — is given a Spotify Playlist ID that looks correctly formatted but doesn't correspond to a real playlist. The first live API call against it returns a 404. Nothing flags this; it sits among otherwise-accurate technical detail.

Brent plays the customer contact himself, under his own name, exactly as listed in the doc. The real, working playlist ID is only handed over once the participant reaches out to flag that the one they were given doesn't resolve.

## Grading

**Hard gate:** if the participant hasn't flagged the mismatch to Brent by Tuesday, September 15, they fail the exercise — independent of how good the rest of the build is. This isn't a partial-credit situation; the entire point is whether they catch and escalate it at all.

If the participant does clear that gate, we're scoring two things roughly evenly: whether they tested against the live API early and asked a clear, specific question rather than guessing or building around it silently, and whether the three build branches work cleanly against real Spotify data by review day.

## Timeline

- **Tuesday, September 8** — kickoff, doc goes out.
- **Tuesday, September 15** — review. Firm date, not a checkpoint.

## Where your input would help

- **If the participant fails the hard gate, how should that land?** Want to align on how (or whether) it factors into anything beyond the exercise itself before Sept 15 arrives.
- **Debbie** — want to be looped in the moment the participant reaches out to Brent about the ID, or hear about it after the fact?
- Flag now if either of you sees a reason not to run this in this window — happy to adjust before the 8th, not after.
