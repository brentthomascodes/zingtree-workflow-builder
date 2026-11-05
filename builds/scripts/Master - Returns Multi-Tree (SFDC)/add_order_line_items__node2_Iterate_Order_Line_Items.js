let count = transforms.count || 0;
let orderLineItems = transforms.current_items_group;
let currentLineItem = orderLineItems[count];

count++;
let isMoreOrderLineItems = true;
if (count >= orderLineItems.length) {
    isMoreOrderLineItems = false;
    count = 0;
}

ZT.setFormData("isMoreOrderLineItems", isMoreOrderLineItems)
ZT.setTransformData("count", count);

////

let case_id = actions.zingtree_redesign__child_case_create__cancellation.id;
let user_id = actions.zingtree_redesign__get_user_details.records[0].Id;
let order_item_id = currentLineItem.Id;
let quantity = currentLineItem.Quantity;

ZT.setFormData("case_id", case_id);
ZT.setFormData("user_id", user_id);
ZT.setFormData("order_item_id", order_item_id);
ZT.setFormData("quantity", quantity);