// ETG Rebooking (single tree) - node 15 "Build the customer decision table for all PNRs"
// One row per determined PNR with a Proceed / Do not proceed / Different request
// radio group. This is the one place dynamic-HTML inputs are correct: the number
// of rows is only known at runtime.
// Input:  transforms.selected_pnrs_customer_action
// Output: transforms.customer_action_table_html, one zt-data radio group per PNR
//         named customer_action_<pnr>

const rows = transforms.selected_pnrs_customer_action || [];

const esc = s => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const STYLE = `<style>
.pnr-wrapper { width: 100%; overflow-x: auto; }
table.pnr-table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;
  font-size: 14px; table-layout: fixed; word-wrap: break-word; }
.pnr-table th, .pnr-table td { border: 1px solid #ccc; padding: 8px 12px; text-align: left;
  vertical-align: top; }
.pnr-table th { background-color: #f2f2f2; font-weight: bold; text-align: center; }
.pnr-table tr:hover { background-color: #fafafa; }
.decision-options { display: flex; flex-direction: column; gap: 6px; }
.decision-options label { white-space: normal; font-size: 14px; cursor: pointer; }
.decision-options input[type="radio"] { margin-right: 6px; transform: scale(1.1);
  vertical-align: middle; }
@media (max-width: 600px) {
  .pnr-table { table-layout: auto; }
  .pnr-table thead { display: none; }
  .pnr-table, .pnr-table tbody, .pnr-table tr, .pnr-table td { display: block; width: 100%; }
  .pnr-table tr { border: 1px solid #ddd; border-radius: 8px; padding: 8px; margin-bottom: 10px;
    background: #fff; }
  .pnr-table td { border: none; padding: 6px 0; }
  .pnr-table td::before { content: attr(data-label); display: block; font-weight: 600;
    color: #555; margin-bottom: 4px; }
}
</style>`;

const CHOICES = [
  ["noSelection", "No selection"],
  ["proceed", "Proceed"],
  ["doNotProceed", "Do not proceed"],
  ["changes", "Different request"]
];

let html = "<h3>No PNRs were determined</h3>";

if (rows.length >= 1) {
  const body = rows.map(row => {
    const name = "customer_action_" + String(row.pnr).replace(/[^a-zA-Z0-9_-]/g, "_");
    const passengers = (row.passengers || [])
      .map(p => esc(p.passengerFirstName + " " + p.passengerLastName)).join("<br>");
    const options = CHOICES.map(([value, label], i) =>
      '<label><input type="radio" name="' + name + '" value="' + value + '" class="zt-data"' +
      (i === 0 ? " checked" : "") + "> " + label + "</label>").join("");

    return "<tr>" +
      '<td data-label="PNR">' + esc(row.pnr) + "</td>" +
      '<td data-label="Handling">' + esc(row.proceedHandling) + "</td>" +
      '<td data-label="New flights">' + esc(row.new_flights) + "</td>" +
      '<td data-label="Outcome">' + esc(row.outcome) + "</td>" +
      '<td data-label="Cost">' + esc(row.cost_to_pax) + " " + esc(row.currency) + "</td>" +
      '<td data-label="Passengers">' + passengers + "</td>" +
      '<td data-label="Decision"><div class="decision-options">' + options + "</div></td>" +
      "</tr>";
  }).join("");

  html = STYLE + '<div class="pnr-wrapper"><table class="pnr-table"><thead><tr>' +
    "<th>PNR</th><th>Handling</th><th>New flights</th><th>Outcome</th><th>Cost</th>" +
    "<th>Passengers</th><th>Decision</th></tr></thead><tbody>" + body +
    "</tbody></table></div>";
}

ZT.setTransformData("customer_action_table_html", html);
