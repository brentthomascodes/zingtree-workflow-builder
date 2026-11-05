ZT.setFormData("null_variable", null)
let records = actions.zingtree_redesign__get_order_line_items.records || [];

function bucketRecords(records) {
  const buckets = {
    returnable: [],
    non_returnable: [],
    not_shipped: []
  };

  records.forEach(record => {
      // Returnable Bucket -> Inside Policy
      if (
        (record.Order_Line_Item_Status__c == "Shipped"
        || record.Order_Line_Item_Status__c == "Delivered") 
        && record.Item_Returnable__c == true
        && !ZT.isOlderThan30Days(record.Delivered_Date__c)) {
          buckets.returnable.push(record);
      }

      // Non-Returnable Bucket -> Outside of Policy (30 days)
      if (
        ((record.Order_Line_Item_Status__c == "Shipped"
          || record.Order_Line_Item_Status__c == "Delivered")
        && record.Item_Returnable__c == false)
        || ZT.isOlderThan30Days(record.Delivered_Date__c)) {
        buckets.non_returnable.push(record);
      }

      // Not Shipped Bucket
      // Has not shipped yet, has to be canceled
      if ((record.Order_Line_Item_Status__c === "Back Order"
        || record.Order_Line_Item_Status__c === "Open"
        || record.Order_Line_Item_Status__c === "Cancelled")) {
          buckets.not_shipped.push(record);
      } 
  });
  return buckets;
}

let buckets = bucketRecords(records);
ZT.setTransformData("buckets", buckets);
// Not Shipped Dynamic View
ZT.setResponseData("dynamic_view__not_shipped", { records: buckets.not_shipped });
// Returnable Dynamic View
ZT.setResponseData("dynamic_view__returnable", { records: buckets.returnable });
// Non Returnable Dynamic View
ZT.setResponseData("dynamic_view__non_returnable", { records: [...buckets.non_returnable] });