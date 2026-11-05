let bucket = views.dynamic_view__non_returnable || [];

let stock_type_buckets = {
    non_stock: [], // arrays of grouped items
    stock: []
};

bucket.forEach(item => {
    if (String(item.Stock_Type__c).toLowerCase() === "stock") {
      stock_type_buckets.stock.push(item)
    }
    
    else {
      stock_type_buckets.non_stock.push(item)
    }
});

if (stock_type_buckets.non_stock.length >= 1) {
    function groupByVendor(data) {
        const map = new Map();

        for (const item of data) {
            const key = item.Vendor_Key__c;

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