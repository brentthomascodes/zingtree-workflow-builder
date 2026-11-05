// ORACLE - the expected outcome, written from the BUSINESS rules, independently of
// the tree's code. Sources: the claude.md node's grouping contract + the ETG/ZT errand
// tracker "Testing" matrix (Tests 1-8) + Olga's 2026-08-04 call notes.
//
// Rules, stated once, in plain terms:
//
//  R1  Every selected PNR must resolve to a real Edvin action. If any PNR's action
//      cannot be resolved, the run is INVALID: the agent has to re-run it. An
//      unresolved PNR must NOT be quietly converted into a do-not-proceed outcome,
//      because "we could not read your selection" and "the customer declined" are
//      different facts and only one of them is safe to record against the order.
//
//  R2  A bucket must be one of the four known routing keys. Anything else (blank,
//      an unrecognized object shape, a typo) is the same class of failure as R1.
//
//  R3  PROCEED PNRs -> exactly ONE active child ticket, no matter how many PNRs.
//      Grandchildren = one per distinct (type + customer action) pair, and only when
//      there are 2 or more distinct pairs. A single pair is fully described by the
//      child ticket itself, so it gets none.
//
//  R4  NON-PROCEED PNRs (no_action | escalate | different_request) -> ONE silent
//      ticket per distinct (type + customer action) pair among them, each covering
//      every PNR that shares that pair, and never any grandchildren. Scales to N:
//      three non-proceed PNRs spanning three distinct pairs produce three silent
//      tickets; spanning one pair, one.
//      CHANGED 2026-08-05 (Brent, tracker "Testing 3"): this used to be ONE silent
//      ticket covering ALL non-proceed PNRs (the v18 consolidation), which is what
//      the earlier "Testing 2" matrix recorded. The tracker now expects 2 silent for
//      Test 5 (diff type, diff action), Test 6a (same type, diff action) and Test 8
//      (Different request + Do not proceed), and 1 for Test 6b (same type, same
//      action) - i.e. exactly the (type + action) key already used for grandchildren
//      and Edvin errands. Silent tickets now group by the same rule as everything
//      else in this tree.
//
//  R5  Edvin errands = one per distinct (type + customer action) pair across ALL
//      PNRs, proceed or not.

const KNOWN_BUCKETS = ["proceed", "no_action", "escalate", "different_request"];

const normalize = b => String(b == null ? "" : b).trim().toLowerCase();
const pairKey = p => `${p.type || ""}|${p.action || ""}`;

// `pnrs` here are the INTENDED inputs: what the agent actually picked on screen,
// before any of the tree's reading/normalizing happens.
function expected(pnrs) {
  const distinctPairs = new Set(pnrs.map(pairKey)).size;

  const unresolved = pnrs.filter(p => !p.resolvable);
  const badBucket = pnrs.filter(p => p.resolvable && !KNOWN_BUCKETS.includes(normalize(p.bucket)));

  if (unresolved.length || badBucket.length) {
    return {
      valid: false,
      reason: unresolved.length
        ? `${unresolved.length} action selection(s) unreadable - run is invalid, agent must re-run`
        : `${badBucket.length} PNR(s) carry an unrecognized bucket - run is invalid`,
      // Nothing should be recorded against the order on an invalid run.
      child: 0, grandchild: 0, silent: 0, errands: 0
    };
  }

  const proceed = pnrs.filter(p => normalize(p.bucket) === "proceed");
  const nonProceed = pnrs.filter(p => normalize(p.bucket) !== "proceed");

  const proceedPairs = new Set(proceed.map(pairKey)).size;
  const nonProceedPairs = new Set(nonProceed.map(pairKey)).size;

  return {
    valid: true,
    reason: "",
    child: proceed.length ? 1 : 0,
    grandchild: proceed.length && proceedPairs > 1 ? proceedPairs : 0,
    silent: nonProceedPairs,
    errands: distinctPairs
  };
}

module.exports = { expected, KNOWN_BUCKETS, normalize, pairKey };
