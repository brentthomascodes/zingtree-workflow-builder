# Spotify Playlist Assistant — Requirements & Handoff

**Prepared by:** Brent, Head of Product — Long Play Media
**Prepared for:** Zingtree Managed Services
**Date:** September 2, 2026
**Status:** Ready for build

## 1. Background

Long Play Media curates a set of flagship Spotify playlists for our listener community, and we get a steady stream of support requests asking us to tweak them: pull a song, spin up a new playlist from a favorite, or put something together that matches a mood. Right now our support team does this by hand in the Spotify app, which doesn't scale and doesn't leave us a record of what changed.

We'd like to move this into a self-serve flow inside Zingtree that our support agents (and eventually end listeners) can run directly against our Spotify catalog.

## 2. The default playlist

Everything in this project reads from and writes against one seed playlist:

| Field | Value |
|---|---|
| Playlist name | Long Play Weekly Mix |
| Spotify Playlist ID | `4mXpZ0vQaJ7bLKsWeYt2Rc` |
| Spotify link | https://open.spotify.com/playlist/4mXpZ0vQaJ7bLKsWeYt2Rc |
| Owner | Long Play Media's connected Spotify account |

This is the "parent" playlist referenced throughout — every option below reads its tracks from here first.

## 3. What we need

When someone starts the flow, they should land on a simple menu with three options (think the click-wheel menu on an old iPod — pick one thing, then act on it):

1. **Create a new playlist** — from a subset of the parent playlist's songs
2. **Create a new AI playlist** — describe a vibe, get a playlist pulled from the parent playlist that matches it
3. **Delete a song from the playlist** — remove one or more tracks from the parent playlist directly

We don't need an "add a song" option for this phase — dropped that from scope.

### 3.1 Create a new playlist

- Show the parent playlist's current tracks (title + artist) as a checklist.
- User selects one or more.
- System creates a new Spotify playlist and adds exactly the selected tracks to it.
- Confirm back to the user with the new playlist's name and link.

### 3.2 Create a new AI playlist

- User describes what they're in the mood for, in their own words — e.g. "upbeat songs for a road trip" or "mellow acoustic stuff for studying." A couple of sentences is enough; it doesn't need to be structured.
- The system matches that description against the parent playlist's tracks and builds a new playlist from whichever ones fit best. Since Zingtree has AI capabilities built in, we'd like this matching to be AI-assisted rather than a fixed keyword filter, but how you implement it is up to you.
- Confirm back to the user with the new playlist's name, link, and which tracks got included.

### 3.3 Delete a song from the playlist

- Show the parent playlist's current tracks (title + artist) as a checklist.
- User selects one or more to remove.
- System removes exactly those tracks from the parent playlist.
- Confirm back to the user with the updated track count.

## 4. Functional requirements

| # | Requirement |
|---|---|
| R1 | On load, pull the parent playlist's current track list (title, artist, Spotify track URI) from Spotify. |
| R2 | Present the three options above as a single-select menu; no option should be reachable without going through this menu first. |
| R3 | "Create a new playlist" — multi-select from the parent playlist's tracks, create a new Spotify playlist, add the selected tracks, confirm with name + link. |
| R4 | "Create a new AI playlist" — free-text mood/genre input, AI-assisted matching against the parent playlist's tracks, create a new Spotify playlist from the matched tracks, confirm with name + link + track list. |
| R5 | "Delete a song from the playlist" — multi-select from the parent playlist's tracks, remove the selected tracks from the parent playlist, confirm with updated count. |
| R6 | Every branch should end back at a confirmation screen — no dead ends, no branch that exits without telling the user what happened. |
| R7 | If any Spotify call fails, show the user something more useful than a blank screen or a raw error — plain language is fine ("we couldn't load the playlist," "that didn't go through"). |

## 5. Accessing Spotify — for your build

Reference docs:

- [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) (app registration)
- [Authorization guide](https://developer.spotify.com/documentation/web-api/concepts/authorization) — Authorization Code flow
- [Scopes](https://developer.spotify.com/documentation/web-api/concepts/scopes) — need `playlist-read-private`, `playlist-modify-public`, `playlist-modify-private`
- [Web API changelog, Feb 2026](https://developer.spotify.com/documentation/web-api/references/changes/february-2026) — playlist endpoints moved since some tutorials were written

Endpoints (base `https://api.spotify.com/v1`):

| Action | Method & path | Docs |
|---|---|---|
| Get parent playlist's tracks | `GET /playlists/{playlist_id}/items` | [docs](https://developer.spotify.com/documentation/web-api/reference/get-playlists-items) |
| Create playlist | `POST /me/playlists` | [docs](https://developer.spotify.com/documentation/web-api/reference/create-playlist) |
| Add tracks | `POST /playlists/{playlist_id}/items` | [docs](https://developer.spotify.com/documentation/web-api/reference/add-items-to-playlist) |
| Remove tracks | `DELETE /playlists/{playlist_id}/items` | [docs](https://developer.spotify.com/documentation/web-api/reference/remove-playlist-items) |

## 6. Timeline

- **Tuesday, September 8:** kickoff — happy to walk through this doc live if useful.
- **Tuesday, September 15:** review — we'd like to see the finished build and try it ourselves.

## 7. Questions

Send questions on scope, access, or anything that doesn't look right to Brent. Please reach out rather than guessing — we'd rather answer a quick question than get a build against the wrong assumption.
