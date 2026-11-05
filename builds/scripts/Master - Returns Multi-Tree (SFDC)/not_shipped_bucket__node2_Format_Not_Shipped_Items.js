// let count = transforms.count || 0;
// let current_item = current_bucket[count];

// ZT.setTransformData("current_item", current_item);
// count++
// let isMoreItems = true;
// if (count >= current_bucket.length) {
//     count = 0;
//     isMoreItems = false;
// }

// ZT.setFormData("count", count)
// ZT.setFormData("isMoreItems", isMoreItems)

let current_bucket = views.dynamic_view__not_shipped || [];
let items_to_cancel = [];
let items_canceled = [];

current_bucket.forEach(item => {
    if (item.Order_Line_Item_Status === "canceled") {
        items_canceled.push(item);
    } else {
        items_to_cancel.push(item);
    }
});

// Set structure at point in time
function renderOrderLineItemsTable(records) {
    if (!Array.isArray(records) || records.length === 0) {
        return `
      <div class="order-line-items-empty">
        No order line items found.
      </div>
    `;
    }

    const columns = [
        { key: "Id", label: "ID" },
        { key: "OrderId", label: "Order ID" },
        { key: "CaseId__c", label: "Case ID" },
        { key: "Description", label: "Description" },
        { key: "Order_Line_Item_Status__c", label: "Line Item Status" },
        { key: "Quantity", label: "Quantity" },
        { key: "Stock_Type__c", label: "Stock Type" },
        { key: "Item_Cancellable__c", label: "Item Cancellable" },
        { key: "Item_Returnable__c", label: "Item Returnable" },
        { key: "Product_Cancellable__c", label: "Product Cancellable" },
        { key: "Product_Returnable__c", label: "Product Returnable" },
        { key: "Date_Shipped__c", label: "Date Shipped" },
        { key: "Delivered_Date__c", label: "Delivered Date" },
        { key: "Date_Cancelled__c", label: "Date Cancelled" },
        { key: "PCS_Order_Line_Key__c", label: "Order Line Key" },
        { key: "PCS_Order_Number__c", label: "Order Number" },
        { key: "TrackingNumber__c", label: "Tracking Number" },
        { key: "Tracking_Info__c", label: "Tracking Info" },
        { key: "Tracking_Information__c", label: "Tracking Information" }
    ];

    const escapeHtml = (value) => {
        if (value === null || value === undefined) return "";
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    };

    const formatValue = (value) => {
        if (value === null || value === undefined || value === "") return "-";
        if (typeof value === "boolean") return value ? "Yes" : "No";
        return escapeHtml(value);
    };

    const headerHtml = columns
        .map(col => `<th>${col.label}</th>`)
        .join("");

    const rowsHtml = records
        .map(record => {
            const cells = columns
                .map(col => `<td>${formatValue(record[col.key])}</td>`)
                .join("");

            return `<tr>${cells}</tr>`;
        })
        .join("");

    return `
    <style>
      .order-line-items-table-wrapper {
        overflow-x: auto;
        margin: 12px 0;
      }

      .order-line-items-table {
        width: 100%;
        border-collapse: collapse;
        font-family: Arial, sans-serif;
        font-size: 14px;
      }

      .order-line-items-table th,
      .order-line-items-table td {
        border: 1px solid #dcdcdc;
        padding: 10px 12px;
        text-align: left;
        vertical-align: top;
      }

      .order-line-items-table th {
        background-color: #f5f5f5;
        font-weight: 600;
      }

      .order-line-items-table tr:nth-child(even) {
        background-color: #fafafa;
      }

      .order-line-items-empty {
        padding: 12px;
        border: 1px solid #dcdcdc;
        background: #fafafa;
        font-family: Arial, sans-serif;
      }
    </style>

    <div class="order-line-items-table-wrapper">
      <table class="order-line-items-table">
        <thead>
          <tr>${headerHtml}</tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>
  `;
}

ZT.log("ITEMS TO CANCEL: " + JSON.stringify(items_to_cancel));
ZT.setTransformData("items_to_cancel", JSON.stringify(items_to_cancel.map(item => {
    return {
      "orderLineKey": item.PCS_Order_Line_Key__c,
      "qty": item.Quantity
    }
}))
)
ZT.setTransformData("items_to_cancel_html", renderOrderLineItemsTable(items_to_cancel));
ZT.setTransformData("items_canceled_html", renderOrderLineItemsTable(items_canceled));

// DIVISION KEY LOGIC

let divisionKey = "3"
if (sf_Division_Key__c == "US") {
  divisionKey = "1"
}

ZT.setFormData("divisionKey", divisionKey);