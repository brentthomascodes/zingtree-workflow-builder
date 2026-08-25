# Troubleshooting and Debugging Best Practices and Recommendations

Source: https://help.zingtree.com/hc/en-us/articles/46543705342619-Troubleshooting-and-Debugging-Best-Practices-and-Recommendations

## Purpose

Helps Zingtree authors debug, validate, and troubleshoot workflows using built-in logging, execution insights, browser tools, and session tracking.

## Logging Overview

Zingtree supports logging at multiple layers:

- **Content nodes** – quick visual checks
- **Script nodes** – targeted, message-based logging
- **Execution Insights** – session-level visibility
- **Browser Developer Tools** – raw request/response inspection

**Recommendation:** Start with content node logging for fast checks, then move to script logs and Execution Insights for deeper troubleshooting.

## Content Node Logging

Content nodes can display variables and workflow data directly in the UI — the simplest way to validate values while stepping through a workflow.

### Print a Single Variable

Use variable interpolation to display a single value:

```
// form data: ${my_variable}
// transforms data: ${transforms.my_variable}
// actions data: ${actions.alias.my_variable}
// views data: ${views.alias.my_variable}
```

**When to use:**
- Confirm user input
- Validate transform outputs
- Check conditional values before routing

### Print an Object (Stringified)

Objects must be stringified before displaying in a content node (use the `| stringify` pipe):

```
// transforms data: ${transforms.my_object | stringify}
// actions data: ${actions.alias | stringify}
// views data: ${views.alias | stringify}
```

**Useful for:**
- API responses
- Transform outputs
- Validating Dynamic Views selection

Reference: Valid Substitutions & Functions documentation.

### Print All Available Workflow Data

To display all form data available to the workflow, put this in a content node:

```
##ALL DATA##
```

**When to use:**
- You are unsure whether a variable exists
- Debugging complex workflows with many inputs

**Caution:** Remove `##ALL DATA##` before publishing — it may expose sensitive data.

## Script Node Logging

Script node logging is similar to `console.log()` in JavaScript; used to track variable values during execution.

### ZT.log() Basics

- Accepts **only one string parameter**
- Does **not** accept raw objects
- Use concatenation or `JSON.stringify()`

```
ZT.log("Sample log message: " + myVariable)
```

```
ZT.log("Sample log message for object: " +
JSON.stringify(myObjectVariable))
```

**Best Practice:** Always include a unique, descriptive prefix in your log message so it's easy to find in Execution Insights.

**Author Tip:** Treat `ZT.log()` like breadcrumbs — log before and after key decisions.

## Execution Insights

Located at: **Apps & Integrations → Execution Insights** in the Zingtree dashboard. Provides visibility into workflow execution data.

**Execution Insights tabs:**
- Connected Objects
- Transformations
- Logs

### Connected Objects tab

Connected Object logs show:
- Outbound API requests
- API responses

**Important:** Logs appear only if **Enable Logging** is turned on in the Connected Object settings.

**Use this to:**
- Validate request payloads
- Confirm response schemas
- Debug authentication or mapping issues

### Transformations tab

Transformation logs automatically capture:
- All data passed into a script
- Form data
- API data
- Transform outputs
- View data

**Errors:** Any script error that triggers an alert modal will also appear here. Opening the accordion of that log shows the cause of the script failure in the **Error** section (in pink).

**Recommendation:** Check this tab first when a script fails.

### Script Logs tab

Displays values logged manually using `ZT.log()`.

**Best uses:**
- Tracking conditional paths
- Verifying data mutations
- Confirming execution order

## Browser Developer Tools

Low-level visibility into network activity.

### Inspecting Connected Object Requests

**Steps:**
1. Open browser developer tools
2. Navigate to the **Network** tab
3. Execute the workflow
4. Look for requests named with a numeric ID (e.g., 1042)

That number corresponds to the **Connected Object ID**.

**Use this view to:**
- Validate request bodies
- Inspect response payloads
- Confirm headers and status codes

## Zingtree Session IDs

A **Session ID** uniquely identifies a single workflow execution. Critical for debugging and reporting.

### How Session IDs Are Created

- Generated automatically when a workflow loads without one
- Can be reused to reload a prior session
- Can be manually assigned via URL parameter

**Example: Existing Session**

```
https://zingtree.com/preview/123456789?
session_id=my_existing_session_id
```

**Example: Create a New Session**

```
https://zingtree.com/preview/123456789?
session_id=newly_generated_session_id
```

**Best Practice:** Use meaningful values (IDs, timestamps, primary keys) for easier troubleshooting.

### Finding the Session ID

**Option 1: Browser Developer Tools**
- Open the **Network** tab
- Find `track-async` requests
- Look for `X-Session-ID` in request headers

**Option 2: Usage Reports**
- Go to **Usage Reports**
- Open **Session Troubleshooting** from the left menu
- Locate the relevant session in the **Session List** report

The Session ID can then be used to filter **Execution Insights**.

## Temporary breakpoint nodes inside a loop (Brent's technique, Aug 2026 — ETG)

To watch a loop actually run in the live sidebar, drop a throwaway **Content node** into the loop body that prints the counter, then delete it before publishing:

```html
<p>Child Ticket LOOP: ${child_tickets_count}</p>
```

One node per loop you care about, wired inline (`Continue` → the loop's next node). It shows the cursor advancing pass by pass, in the real session, with real data — which is the one thing an offline harness cannot show you. Brent used exactly this on the ETG errand tree (temporary nodes 57/58/59 over the PNR loop, the action-table loop and the child-ticket loop) while diagnosing the grandchild race.

Two related notes:

- **These are debug scaffolding — remove them before delivering.** Only one survived on that tree, and it survived because it earned a second job: node 60 sits between the create call and the fetch and its `escalate_after` gives Zendesk time to settle.
- **A Content node inside a loop is also the wait primitive.** See `patterns.md` → "ONE REQUEST, ONE NODE" for `escalate_after`.

## "The last action triggered an invalid loop"

> Workflow execution paused — The last action triggered an invalid loop.

Zingtree counts node revisits at runtime and halts the session when the same node set is revisited too many times. Array-cursor loops don't trip it (each pass advances a counter, the array bounds the count); a **wait/poll loop that revisits the same nodes without advancing any data does.** No offline validator can catch this — it appears only on a live run after import.

The fix is never to unroll the loop into copies of the same nodes. See `patterns.md` → "ONE REQUEST, ONE NODE — never re-issue an API call to re-check something".

## Troubleshooting Checklist

- Use content nodes to inspect live values
- Use `##ALL DATA##` when unsure what exists
- Enable logging on Connected Objects
- Add descriptive `ZT.log()` messages
- Check Transformations for script errors
- Inspect API calls in Execution Insights & browser dev tools
- Capture and validate Session IDs

## Author Recommendations

- Log early, log often — and clean up before publishing
- Prefer descriptive logs over raw values
- Reproduce bugs and capture/share Session IDs
- Validate assumptions at every integration boundary
- Treat Execution Insights as your primary debugging console
