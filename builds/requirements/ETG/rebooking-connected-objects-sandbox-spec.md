# ETG Rebooking — Connected Objects & Dynamic Views (Sandbox build spec)

For rebuilding the CX Actions this tree depends on, in the Zingtree **Sandbox**.
Source of truth: the tree JSON references + the script bodies that read/write each object.

> **What IS in the export vs. what is NOT.** The tree only stores each Connected Object's **ID,
> alias, and the variables the tree passes/reads**. The **endpoint URL, auth, headers, and exact
> request-body JSON live on the production Data Source (org 113)** and are NOT in the export. Below,
> "Tree contract" = certain (from the JSON/scripts). "Endpoint / Auth / Body" = recreate from the
> production Data Source config or the Edvin/Zendesk API docs — the values given are the best-known
> from the ETG Edvin handoff, to be confirmed against production before Sandbox testing.

---

## 1. `findorder` — Edvin order lookup  (Data Source + Dynamic Views)  ★ the important one

**Tree contract (certain):**
- Connected Object: `dcoId 23`, type `http`, **alias `findorder`**. (Aliases are immutable once set —
  create it as exactly `findorder` or every `actions.findorder` / `views.findorder` reference breaks.)
- Surfaced as **two Dynamic View grid widgets** embedded in the root node "Display PNR":
  - `widgetId 26`, `widgetType grid` — main PNR picker. Columns: **Pnr, Post Sale Handle Type,
    Provider System, Id**. Agent multi-selects the PNR(s) to work.
  - `widgetId 15`, `widgetType grid` — **Linked PNR(s)** grid. Column: linked PNR / `providerReference`.
- Read back in scripts via:
  - `views.findorder` → array of selected PNR rows (node "Set Selected PNR's":
    `ZT.setTransformData("selected_pnrs", views.findorder)`).
  - `views.findorder[0].providerReference` → drives `is_linked_pnr_selected`.
  - `actions.findorder.hasChargeback` → used in the GDS "CC2C / Not issued" policy router.
  - `actions.findorder.firstDepartureDate`, `actions.findorder.lastSegmentArrivalDate`.
- **Fields the tree consumes from each row** (define these in the Dynamic View field mapping):
  `pnr`, `postSaleHandleType` (GDS | LCC | EXTERNAL_PORTAL | EXCEPTION_LCC …), `providerSystem`,
  `id`, `providerReference`, `hasChargeback`, `firstDepartureDate`, `lastSegmentArrivalDate`,
  and a `passengers[]` array of `{ passengerFirstName, passengerLastName }`.

**Endpoint / Auth / Body (recreate — from Edvin handoff, confirm against prod):**
- Edvin **findOrder**: `edvin-api.etraveli.com/edvinapi` → `v1/findOrder` (docs:
  `edvin-api.etraveli.com/edvinapi/docs/v1/index.html#operation/findOrder`). GET/POST keyed by order
  reference. Auth = Edvin's scheme (Keycloak/bearer) — get from Elis Taraj / the prod Data Source.
- Configure **two Dynamic Views** on this Data Source: the PNR-picker grid (multi-select) and the
  Linked-PNR grid, matching widgetIds 26 and 15 above (or re-embed fresh widgets and update the node).

---

## 2. `Create Child Ticket`  (Zendesk write)

**Tree contract (certain):**
- Connected Object `dcoId 20`, type `http`. Called once per PNR in the unified child-ticket loop.
- Payload staged by the cursor script as transform `child_ticket`:
  `{ subject: "Child <pnr> - Rebooking", body: "<proceedHandling>" }`.
  Also in session: `zd_ticket_id` (parent), the merged PNR object fields, `isCreateChildTicket` gate.
- Auto-passed vars available by name: `child_ticket`, `zd_ticket_id`, plus all form scalars.

**Endpoint / Auth / Body (recreate):** Zendesk **Create Ticket** (`POST /api/v2/tickets.json`) on the
ETG Zendesk subdomain, child of `zd_ticket_id`. Auth = Zendesk API token / OAuth (from prod Data
Source). Map `subject` ← `child_ticket.subject`, `comment.body` ← `child_ticket.body`, parent linkage
← `zd_ticket_id`.

---

## 3. `Add Tags` / `Update Flow Tags`  (Zendesk write)

**Tree contract (certain):**
- Connected Object `dcoId 54`, type `http`. Used **twice**: hub "Update Flow Tags" and the
  Persistent-Buttons "Add Tags".
- Consumes `update_ticket_tag` (set by the persistent-button screens) and `zd_ticket_id`.

**Endpoint / Auth / Body (recreate):** Zendesk **add tags** (`PUT /api/v2/tickets/{id}/tags.json`)
or ticket update. Map tags ← `update_ticket_tag`, ticket ← `zd_ticket_id`. Auth as #2.

---

## 4. `Create Internal Note - No Group ID`  (Zendesk write)

**Tree contract (certain):**
- Connected Object `dcoId 57`, type `http`. Called once at the end (node "Create Internal Note").
- Consumes transform `internal_note_details` (the full formatted per-PNR summary built by "Format
  Internal Note"), plus `zd_ticket_id`, `total_cost_pax_all`, and Genesys id
  `custom_field_30866832265234`.

**Endpoint / Auth / Body (recreate):** Zendesk **add internal comment**
(`PUT /api/v2/tickets/{id}.json` with `comment.public=false`). Map `comment.body` ←
`internal_note_details`, ticket ← `zd_ticket_id`. Auth as #2.

---

## Summary table

| # | Alias / name | dcoId | Type | Direction | Tree reads / writes | Define in Sandbox |
|---|---|---|---|---|---|---|
| 1 | `findorder` | 23 | http | read (Views + action) | `views.findorder[]`, `actions.findorder.*` | Edvin findOrder + **2 Dynamic Views** (grid 26 picker, grid 15 linked) |
| 2 | Create Child Ticket | 20 | http | write | `child_ticket{subject,body}`, `zd_ticket_id` | Zendesk create child ticket |
| 3 | Add Tags / Update Flow Tags | 54 | http | write | `update_ticket_tag`, `zd_ticket_id` | Zendesk add tags |
| 4 | Create Internal Note | 57 | http | write | `internal_note_details`, `zd_ticket_id` | Zendesk internal comment |

## Dynamic Views to create
Both live on Data Source **#1 (`findorder`)**:
1. **PNR picker** — multi-select grid, columns Pnr / Post Sale Handle Type / Provider System / Id;
   selection read via `views.findorder`. (widgetId 26 in the current export.)
2. **Linked PNR(s)** — grid on `providerReference`. (widgetId 15.)

## Session / query-param inputs the tree expects at launch
`zd_ticket_id`, `custom_field_30866832265234` (Genesys interaction id), and predefined flags
`hasFlexibleTicket`, `isShowFlexibleTicket`, `isWenrix`, `isSpecialCarrier`. Seed these from the
embedding app (Zendesk) on the session URL so routing works from the first render.

## Before Sandbox testing — confirm from production (not in export)
Base URLs, auth type/credentials for Edvin and Zendesk, and the exact request-body field mapping for
each of #1–#4. Pull from the production Data Sources (org 113) or the Edvin handoff owner (Elis Taraj).
