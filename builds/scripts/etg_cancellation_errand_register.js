// SOURCE: Cowork session 'ETG cancellation child tickets sorting' (local_83edd0bf)
// ACCOUNT: eTraveli Group (ETG) - Cancellation Errand Register
// PURPOSE: Zingtree Script Node. Stitches selected customer_action per PNR (indexed variables customer_action_${pnr}_${index} via ZT.getVariableValue), groups PNRs by bucket, builds child/grandchild/silent Zendesk tickets (proceed sorted last), and generates a stringified child_tickets_note transform for the Zendesk ticket update.

let customer_action_pnrs = transforms.customer_action_pnrs || [];
let final_pnrs = transforms.final_pnrs || [];

function findActionForSelection(item, selectedActionName) {
  if (!selectedActionName) {
    return {
      bucket: "",
      edvin_actions: {},
      actionId: null
    };
  }

  const actionsArray = Array.isArray(item.actions_array) ? item.actions_array : [];
  const match = actionsArray.find(action => action && action.name === selectedActionName);

  return {
    bucket: match && match.bucket ? match.bucket : "",
    edvin_actions: match && match.edvin_actions ? match.edvin_actions : {},
    actionId: match && (match.actionId != null) ? match.actionId : null
  };
}

let bucket_stitch = customer_action_pnrs.map((item, index) => {
  const variableName = `customer_action_${item.pnr}_${index}`;
  const customer_action = ZT.getVariableValue(variableName, "");

  const selectedAction = findActionForSelection(item, customer_action);

  // remove actions_array via destructuring
  const { actions_array, ...rest } = item;

  return {
    ...rest,
    customer_action,
    actionId: selectedAction.actionId,
    bucket: selectedAction.bucket,
    edvin_actions: selectedAction.edvin_actions
  };
});

ZT.setTransformData("customer_action_pnrs", bucket_stitch);
ZT.log("bucket_stitch: " + JSON.stringify(bucket_stitch));

// GROUP //

function groupByBucket(pnrs) {
  const result = {
    proceed: [],
    no_action: [],
    escalate: [],
    different_request: [],
    default: []
  };

  pnrs.forEach(item => {

    // Prepare for Internal Note
    final_pnrs.push(item);
    ZT.setTransformData("final_pnrs", final_pnrs)

    const bucket = (item.bucket || "default").trim().toLowerCase();

    switch (bucket) {
      case "proceed":
        result.proceed.push(item);
        break;

      case "no_action":
        result.no_action.push(item);
        break;

      case "escalate":
        result.escalate.push(item);
        break;

      case "different_request":
        result.different_request.push(item);
        break;

      default:
        result.default.push(item);
        break;
    }
  });

  return result;
}

let pnr_buckets = groupByBucket(bucket_stitch);

ZT.setTransformData("pnr_buckets", pnr_buckets);
ZT.setFormData("update_ticket_tag", "customer_action_table_completed");

//// Child Ticket Logic
function buildChildTickets(pnrBuckets) {
    const childTickets = [];

    const joinPnrs = (items) =>
        [...new Set(items.map(i => i.pnr).filter(Boolean))].join(", ");

    const toGrandchild = (item) => ({
        title: `Grandchild Ticket: ${item.pnr}`,
        pnr: item.pnr,
        bucket: item.bucket,
        category: item.category,
        customer_action: item.customer_action || "",
        type: item.type || "",
        channel: item.channel || "",
        contact_reason: item.category || "",
        genesys_interaction_type: item.genesys_interaction_type || "N/A",
        formatted_passengers: item.formatted_passengers || ""
    });

    for (const [bucketName, items] of Object.entries(pnrBuckets)) {
        if (!Array.isArray(items) || items.length === 0) continue;

        const pnrList = joinPnrs(items);
        const isProceed = bucketName === "proceed";

        const child_ticket = {
            title: isProceed ? `Child Ticket: ${pnrList}` : `Silent Ticket: ${pnrList}`,
            pnr: pnrList,
            bucket: items[0].bucket,
            category: items[0].category,
            customer_action: items[0].customer_action || "",
            type: items[0].type || "",
            formatted_passengers: items.map(i => i.formatted_passengers || "").join(""),
            grandchild_tickets: []
        };

        // Grandchildren: proceed only, one per distinct customer_action
        if (isProceed) {
            const seen = {};
            const order = [];
            for (const item of items) {
                const key = item.customer_action || "__none__";
                if (!seen[key]) { seen[key] = []; order.push(key); }
                seen[key].push(item);
            }
            if (order.length > 1) {
                // one grandchild per distinct action (collapse PNRs that share an action)
                child_ticket.grandchild_tickets = order.map(key => {
                    const group = seen[key];
                    const gc = toGrandchild(group[0]);
                    gc.pnr = joinPnrs(group);
                    gc.title = `Grandchild Ticket: ${gc.pnr}`;
                    gc.formatted_passengers = group.map(i => i.formatted_passengers || "").join("");
                    return gc;
                });
            }
        }

        childTickets.push({ child_ticket });
    }

    // Sort so actual child tickets (bucket = proceed) are always last
    const isProceedTicket = (ct) =>
        (ct.child_ticket.bucket || "").trim().toLowerCase() === "proceed";
    childTickets.sort((a, b) => Number(isProceedTicket(a)) - Number(isProceedTicket(b)));

    return childTickets;
}

let child_tickets = buildChildTickets(pnr_buckets);
ZT.setTransformData("child_tickets", child_tickets);

//// Child Tickets Summary Note (Zendesk ticket update)
function buildChildTicketsNote(childTickets) {
    const isProceed = (ct) =>
        (ct.child_ticket.bucket || "").trim().toLowerCase() === "proceed";

    const childCount = childTickets.filter(isProceed).length;
    const silentCount = childTickets.filter(ct => !isProceed(ct)).length;
    const grandchildCount = childTickets.reduce((sum, ct) => {
        const gcs = ct.child_ticket.grandchild_tickets;
        return sum + (Array.isArray(gcs) ? gcs.length : 0);
    }, 0);

    let note = `(Child Tickets: ${childCount}, Grand Child Tickets: ${grandchildCount}, Silent Tickets: ${silentCount})\n\n`;

    childTickets.forEach(ct => {
        const t = ct.child_ticket;
        const label = isProceed(ct) ? "Child Ticket" : "Silent Ticket";

        note += `**${label}**: ${t.pnr},
  **Contact Reason**: ${t.category || ""},
  **Customer Action**: ${t.customer_action || ""},
  **Bucket**: ${t.bucket || ""}
`;

        const gcs = Array.isArray(t.grandchild_tickets) ? t.grandchild_tickets : [];
        gcs.forEach(gc => {
            note += `  - **Grandchild Ticket**: ${gc.pnr}, Action: ${gc.customer_action || ""}, Contact Reason: ${gc.contact_reason || ""}, Genesys Interaction Type: ${gc.genesys_interaction_type || "N/A"}\n`;
        });

        note += `\n`;
    });

    return note.trim();
}

let child_tickets_note = buildChildTicketsNote(child_tickets);
ZT.setTransformData("child_tickets_note", child_tickets_note);
ZT.log("child_tickets_note: " + child_tickets_note);
