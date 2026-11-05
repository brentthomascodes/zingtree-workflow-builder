let bucket = views.dynamic_view__returnable || [];

let stock_type_buckets = {
    non_stock: [], // arrays of grouped items
    stock: []
};

bucket.forEach(item => {
  if (String(item.Stock_Type__c).toLowerCase() === "stock") {
    stock_type_buckets.stock.push(item);
  } else {
    stock_type_buckets.non_stock.push(item);
  }
});

if (stock_type_buckets.non_stock.length >= 1) {
    function groupByVendor(data) {
        const map = new Map();

        for (const item of data) {
          const key = item.Vendor_Key__c;

            // estimated delivery date

            if (!map.has(key)) {
            map.set(key, []);
            }

            map.get(key).push(item);
        }

        return Array.from(map.values());
    }

    ZT.setTransformData("grouped_non_stock", groupByVendor(stock_type_buckets.non_stock))
    // Need to be further grouped by sf_Drop_Ship_PO__c X
        // Brent find out actual field value X
}


ZT.setTransformData("stock_type_buckets", stock_type_buckets)

// function renderOrderLineItemsTable(records) {
//   if (!Array.isArray(records) || records.length === 0) {
//     return `
//       <div class="order-line-items-empty">
//         No order line items found.
//       </div>
//     `;
//   }

//   const columns = [
//     { key: "Id", label: "ID" },
//     { key: "OrderId", label: "Order ID" },
//     { key: "CaseId__c", label: "Case ID" },
//     { key: "Description", label: "Description" },
//     { key: "Order_Line_Item_Status__c", label: "Line Item Status" },
//     { key: "Quantity", label: "Quantity" },
//     { key: "Stock_Type__c", label: "Stock Type" },
//     { key: "Item_Cancellable__c", label: "Item Cancellable" },
//     { key: "Item_Returnable__c", label: "Item Returnable" },
//     { key: "Product_Cancellable__c", label: "Product Cancellable" },
//     { key: "Product_Returnable__c", label: "Product Returnable" },
//     { key: "Date_Shipped__c", label: "Date Shipped" },
//     { key: "Delivered_Date__c", label: "Delivered Date" },
//     { key: "Date_Cancelled__c", label: "Date Cancelled" },
//     { key: "PCS_Order_Line_Key__c", label: "Order Line Key" },
//     { key: "PCS_Order_Number__c", label: "Order Number" },
//     { key: "TrackingNumber__c", label: "Tracking Number" },
//     { key: "Tracking_Info__c", label: "Tracking Info" },
//     { key: "Tracking_Information__c", label: "Tracking Information" },
//     { key: "Vendor_Key__c", label: "Vendor Key" },
//     { key: "Legacy__c", label: "Legacy #" }
//   ];

//   const escapeHtml = (value) => {
//     if (value === null || value === undefined) return "";
//     return String(value)
//       .replace(/&/g, "&amp;")
//       .replace(/</g, "&lt;")
//       .replace(/>/g, "&gt;")
//       .replace(/"/g, "&quot;")
//       .replace(/'/g, "&#39;");
//   };

//   const formatValue = (value) => {
//     if (value === null || value === undefined || value === "") return "-";
//     if (typeof value === "boolean") return value ? "Yes" : "No";
//     return escapeHtml(value);
//   };

//   const headerHtml = columns
//     .map(col => `<th>${col.label}</th>`)
//     .join("");

//   const rowsHtml = records
//     .map(record => {
//       const cells = columns
//         .map(col => `<td>${formatValue(record[col.key])}</td>`)
//         .join("");

//       return `<tr>${cells}</tr>`;
//     })
//     .join("");

//   return `
//     <style>
//       .order-line-items-table-wrapper {
//         overflow-x: auto;
//         margin: 12px 0;
//       }

//       .order-line-items-table {
//         width: 100%;
//         border-collapse: collapse;
//         font-family: Arial, sans-serif;
//         font-size: 14px;
//       }

//       .order-line-items-table th,
//       .order-line-items-table td {
//         border: 1px solid #dcdcdc;
//         padding: 10px 12px;
//         text-align: left;
//         vertical-align: top;
//       }

//       .order-line-items-table th {
//         background-color: #f5f5f5;
//         font-weight: 600;
//       }

//       .order-line-items-table tr:nth-child(even) {
//         background-color: #fafafa;
//       }

//       .order-line-items-empty {
//         padding: 12px;
//         border: 1px solid #dcdcdc;
//         background: #fafafa;
//         font-family: Arial, sans-serif;
//       }
//     </style>

//     <div class="order-line-items-table-wrapper">
//       <table class="order-line-items-table">
//         <thead>
//           <tr>${headerHtml}</tr>
//         </thead>
//         <tbody>
//           ${rowsHtml}
//         </tbody>
//       </table>
//     </div>
//   `;
// }

// let stock_items_html = renderOrderLineItemsTable(stock_type_buckets.stock);
// ZT.setTransformData("stock_items_html", stock_items_html)