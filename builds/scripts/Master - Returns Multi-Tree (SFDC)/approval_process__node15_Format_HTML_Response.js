let non_stock_count = transforms.non_stock_count || 0;
let current_non_stock_vendor_group = transforms.grouped_non_stock[non_stock_count];
ZT.setTransformData("current_items_group", current_non_stock_vendor_group)

non_stock_count += 1;
const vendor_name =
  actions?.zingtree_redesign__get_vendor_details?.records?.[0]?.Name?.trim() ||
  "Example Vendor Name";

ZT.setTransformData("current_non_stock_vendor_group", current_non_stock_vendor_group)
// ZT.log("current group: " + JSON.stringify(current_non_stock_vendor_group))

//// Create HTML for current_non_stock_vendor
function itemsToHtml(items) {
  const listItems = items.map((item) => `
    <li style="
      list-style: none;
      margin-bottom: 20px;
      padding: 16px;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      background: #fafafa;
    ">
      
      <div style="font-size: 16px; font-weight: 600; margin-bottom: 10px;">
        ${item.Description ?? "Item"}
      </div>

      <div style="
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 6px 16px;
        font-size: 14px;
      ">
        <div><span style="color:#6b7280;">Order Line Key:</span> ${item.PCS_Order_Line_Key__c ?? ""}</div>
        <div><span style="color:#6b7280;">Order #:</span> ${item.PCS_Order_Number__c ?? ""}</div>
        <div><span style="color:#6b7280;">Quantity:</span> ${item.Quantity ?? ""}</div>
        <div><span style="color:#6b7280;">Stock Type:</span> ${item.Stock_Type__c ?? ""}</div>
        <div><span style="color:#6b7280;">Status:</span> ${item.Order_Line_Item_Status__c ?? ""}</div>
        <div><span style="color:#6b7280;">Returnable:</span> ${item.Item_Returnable__c ? "Yes" : "No"}</div>
        <div><span style="color:#6b7280;">Cancellable:</span> ${item.Item_Cancellable__c ? "Yes" : "No"}</div>
        <div><span style="color:#6b7280;">Delivered:</span> ${item.Delivered_Date__c ?? ""}</div>
        <div><span style="color:#6b7280;">Shipped:</span> ${item.Date_Shipped__c ?? ""}</div>
        <div><span style="color:#6b7280;">Tracking #:</span> ${item.TrackingNumber__c ?? ""}</div>
        <div>
          <span style="grid-column: span 2; color:#6b7280;">Tracking Info:</span>
          ${
            item.Tracking_Information__c
            ? `<a href="${item.Tracking_Information__c}" target="_blank" rel="noopener noreferrer">Track Now</a>`
            : ""
          }
        </div>
      </div>

    </li>
  `).join("");

  return `
    <div style="font-family: Arial, sans-serif;">
      <h3 style="margin-bottom: 4px;">
        Vendor: ${vendor_name}
      </h3>

      <p style="margin-top: 0; color: #6b7280; font-size: 14px;">
        ${non_stock_count} of ${transforms.grouped_non_stock.length} Vendor Groups
      </p>

      <ul style="padding: 0; margin-top: 16px;">
        ${listItems}
      </ul>
    </div>
  `;
}

ZT.setTransformData("non_stock_items_html", itemsToHtml(current_non_stock_vendor_group));

let isMoreNonStock = true;
if (non_stock_count >= transforms.grouped_non_stock.length) {
  isMoreNonStock = false;
  non_stock_count = 0;
}

ZT.setTransformData("non_stock_count", non_stock_count);
ZT.setTransformData("isMoreNonStock", isMoreNonStock);

function getRelevantString(data) {
  const fields = ['Legacy__c', 'Description', 'Quantity'];
  const items = Array.isArray(data) ? data : [data];
  return items.map(obj =>
    fields
      .filter(key => obj[key] != null)
      .map(key => `${key}: ${String(obj[key]).replace(/"/g, "'")}`)
      .join(', ')
  ).join(' | ');
}
let orderItemsStringify = getRelevantString(current_non_stock_vendor_group)

ZT.setFormData("subject", `Child Case for Approvals (Non-stock): ${actions.zingtree_redesign__get_vendor_details.records[0].Name} - ${sf_PCS_Order__c}`)
ZT.setFormData("description", `The following products are requesting Vendor RMA for approval: ${orderItemsStringify}`)
// ZT.setFormData("order_id", sf_Order__c)
ZT.setFormData("order_id", sf_PCS_Order__c)
// ZT.setFormData("contact_id","0037z00001Mqki9AAB")
ZT.setFormData("contact_id", sf_ContactId)
// ZT.setFormData("account_id", "0017z00001mUD3hAAG")
ZT.setFormData("account_id", sf_AccountId)
// ZT.setFormData("record_type_id", "012Po000003tlcVIAQ")
ZT.setFormData("record_type_id", sf_RecordTypeId)