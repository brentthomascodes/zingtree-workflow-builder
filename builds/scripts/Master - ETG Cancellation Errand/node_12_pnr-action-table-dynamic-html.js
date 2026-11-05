let customer_action_pnrs = transforms.customer_action_pnrs || [];

function escapeHtml(value) {
    if (value === null || value === undefined) return "";
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function buildActionDropdown(item, rowIndex) {
    const actionsArray = Array.isArray(item.actions_array) ? item.actions_array : [];
    const uniqueNames = [];
    const seen = new Set();

    actionsArray.forEach(action => {
        const name = action && action.name;
        if (!name || seen.has(name)) return;
        seen.add(name);
        uniqueNames.push(name);
    });

    const safePnr = String(item.pnr || "").replace(/[^a-zA-Z0-9_-]/g, "_");
    const variableName = `customer_action_${safePnr}_${rowIndex}`;

    return `
      <select
        name="${escapeHtml(variableName)}"
        class="action-select zt-data"
        data-row-index="${rowIndex}"
        data-pnr="${escapeHtml(item.pnr)}"
      >
        <option value="">Select action</option>
        ${uniqueNames.map(name => `
          <option value="${escapeHtml(name)}">${escapeHtml(name)}</option>
        `).join("")}
      </select>
    `;
}

function buildMeta(label, value) {
    if (!value) return "";
    return `
      <div class="pnr-meta-item">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(value)}</strong>
      </div>
    `;
}

function buildCustomerActionTable(pnrItems) {
    let html = `
    <style>
      :root {
        --etg-ink: #101820;
        --etg-muted: #667085;
        --etg-line: #e7eaee;
        --etg-bg: #f6f4ef;
        --etg-card: #ffffff;
        --etg-blue: #163a5f;
        --etg-sky: #d8ecf5;
        --etg-sand: #f3eadb;
        --etg-green: #dce8df;
      }

      .pnr-board {
        font-family: Arial, sans-serif;
        background: var(--etg-bg);
        border: 1px solid var(--etg-line);
        border-radius: 18px;
        padding: 14px;
      }

      .pnr-list {
        display: grid;
        gap: 12px;
      }

      .pnr-card {
        background: var(--etg-card);
        border: 1px solid var(--etg-line);
        border-radius: 16px;
        padding: 16px;
      }

      .pnr-card-header {
        display: flex;
        justify-content: space-between;
        gap: 14px;
        align-items: flex-start;
        margin-bottom: 12px;
      }

      .pnr-title {
        color: var(--etg-ink);
        font-size: 16px;
        font-weight: 700;
        letter-spacing: -0.01em;
      }

      .pnr-pill {
        display: inline-flex;
        align-items: center;
        background: var(--etg-sky);
        color: var(--etg-blue);
        border-radius: 999px;
        padding: 5px 10px;
        font-size: 11px;
        font-weight: 700;
        white-space: nowrap;
      }

      .pnr-passengers {
        color: var(--etg-ink);
        font-size: 13px;
        line-height: 1.45;
        margin-bottom: 12px;
      }

      .pnr-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 12px;
      }

      .pnr-meta-item {
        background: var(--etg-sand);
        border-radius: 10px;
        padding: 7px 9px;
        min-width: 96px;
      }

      .pnr-meta-item span {
        display: block;
        color: var(--etg-muted);
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        margin-bottom: 2px;
      }

      .pnr-meta-item strong {
        display: block;
        color: var(--etg-ink);
        font-size: 12px;
        font-weight: 600;
      }

      .pnr-notes {
        color: #344054;
        background: #fafafa;
        border: 1px solid var(--etg-line);
        border-radius: 12px;
        padding: 10px 12px;
        font-size: 13px;
        line-height: 1.45;
        white-space: pre-wrap;
        margin-bottom: 12px;
      }

      .action-row {
        display: grid;
        gap: 6px;
      }

      .action-label {
        color: var(--etg-muted);
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }

      .action-select {
        width: 100%;
        padding: 11px 12px;
        font-size: 14px;
        font-weight: 600;
        color: var(--etg-ink);
        background: var(--etg-green);
        border: 1px solid #c8d8cd;
        border-radius: 12px;
        outline: none;
        cursor: pointer;
      }

      .action-select:focus {
        border-color: var(--etg-blue);
        box-shadow: 0 0 0 3px rgba(22, 58, 95, 0.12);
      }

      .empty-message {
        background: var(--etg-card);
        border: 1px dashed var(--etg-line);
        border-radius: 14px;
        padding: 22px;
        text-align: center;
        color: var(--etg-muted);
        font-size: 14px;
      }

      @media (min-width: 760px) {
        .pnr-list {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
    </style>

    <div class="pnr-board">
      <div class="pnr-list">
    `;

    if (!pnrItems.length) {
        html += `<div class="empty-message">No customer action records found.</div>`;
    } else {
        pnrItems.forEach((item, index) => {
            html += `
              <div class="pnr-card">
                <div class="pnr-card-header">
                  <div class="pnr-title">${escapeHtml(item.pnr)}</div>
                  ${item.category ? `<div class="pnr-pill">${escapeHtml(item.category)}</div>` : ""}
                </div>

                <div class="pnr-passengers">
                  ${item.formatted_passengers || ""}
                </div>

                <div class="pnr-meta">
                  ${buildMeta("Channel", item.channel)}
                  ${buildMeta("Type", item.type)}
                </div>

                ${item.notes ? `
                  <div class="pnr-notes">${escapeHtml(item.notes)}</div>
                ` : ""}

                <div class="action-row">
                  <div class="action-label">Customer action</div>
                  ${buildActionDropdown(item, index)}
                </div>
              </div>
            `;
        });
    }

    html += `
      </div>
    </div>
    `;

    return html;
}

let customer_action_table_html = buildCustomerActionTable(customer_action_pnrs);

ZT.setTransformData("customer_action_table_html", customer_action_table_html);
ZT.log("customer_action_table_html: " + JSON.stringify(customer_action_table_html));