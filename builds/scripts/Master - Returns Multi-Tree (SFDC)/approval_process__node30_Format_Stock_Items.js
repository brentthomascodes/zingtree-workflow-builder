let stock_bucket_items = transforms.stock_type_buckets.stock;
ZT.setTransformData("current_items_group", stock_bucket_items)

const agentOrderItemHTML = (items) => {
  const statusBadge = (s) => {
    const style = s === 'Active'
      ? 'background:#EAF3DE;color:#27500A;'
      : s === 'Cancelled'
      ? 'background:#FCEBEB;color:#791F1F;'
      : 'background:#FAEEDA;color:#633806;';
    return `<span style="font-size:12px;font-weight:600;padding:3px 10px;border-radius:999px;white-space:nowrap;${style}">${s || 'Unknown'}</span>`;
  };

  const boolBadge = (val) => `<span style="font-size:12px;font-weight:600;padding:3px 9px;border-radius:999px;${val ? 'background:#EAF3DE;color:#27500A;' : 'background:#FCEBEB;color:#791F1F;'}">${val ? 'Yes' : 'No'}</span>`;

  const fmtDate = (d) => {
    if (!d) return null;
    const dt = new Date(d);
    return isNaN(dt) ? d : dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const cell = (label, value, last = false) => `
    <div style="padding:10px 16px;${last ? '' : 'border-right:2px solid #d0d0d0;'}flex:1;">
      <div style="font-size:12px;color:#666;margin-bottom:4px;font-weight:500;">${label}</div>
      <div style="font-size:15px;font-weight:600;color:#111;">${value}</div>
    </div>`;

  return `<div style="font-family:sans-serif;">
    ${items.map(item => {
      const cost = item.Item_Extended_Cost__c != null ? '$' + Number(item.Item_Extended_Cost__c).toFixed(2) : '—';
      const qty = item.Quantity != null ? Math.round(item.Quantity) : '—';
      const shippedDate = fmtDate(item.Date_Shipped__c);
      return `
      <div style="background:#fff;border:2px solid #d0d0d0;border-radius:10px;padding:16px 18px;margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:12px;">
          <span style="font-size:15px;font-weight:600;color:#111;">${item.Description || '—'}</span>
          ${statusBadge(item.Order_Line_Item_Status__c)}
        </div>
        <div style="display:flex;border:2px solid #d0d0d0;border-radius:8px;overflow:hidden;margin-bottom:12px;">
          ${cell('Cost', cost)}
          ${cell('Qty', qty)}
          ${cell('Order #', item.PCS_Order_Number__c || '—', true)}
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px 20px;font-size:13px;color:#555;align-items:center;">
          <span>Tracking: <strong style="color:#111;font-weight:600;">${item.TrackingNumber__c || '—'}</strong></span>
          <span>${shippedDate ? 'Shipped ' + shippedDate : 'Not yet shipped'}</span>
          <span style="display:flex;align-items:center;gap:5px;">Cancellable: ${boolBadge(item.Item_Cancellable__c)}</span>
          <span style="display:flex;align-items:center;gap:5px;">Returnable: ${boolBadge(item.Item_Returnable__c)}</span>
        </div>
      </div>`;
    }).join('')}
  </div>`;
};

let result = agentOrderItemHTML(stock_bucket_items);
ZT.setTransformData("stock_items_html", result)


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
let orderItemsStringify = getRelevantString(stock_bucket_items)

ZT.setFormData("subject", `Child Case for Approvals (Stock): ${sf_Order__c}`)
ZT.setFormData("description", `The following products are requesting stock item approval: ${orderItemsStringify}`)
ZT.setFormData("order_id", sf_Order__c)
ZT.setFormData("contact_id", sf_ContactId)
ZT.setFormData("account_id", sf_AccountId)
ZT.setFormData("record_type_id", sf_RecordTypeId)


// ZT.setFormData("contact_id","0037z00001Mqki9AAB")
// ZT.setFormData("account_id", "0017z00001mUD3hAAG")
// ZT.setFormData("record_type_id", "012Po000003tlcVIAQ")