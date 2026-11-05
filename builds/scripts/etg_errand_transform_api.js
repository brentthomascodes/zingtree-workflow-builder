// SOURCE: Cowork session 'Code diff: static arrays to API data' (local_08259f0a)
// ACCOUNT: eTraveli Group (ETG) - Errands Template / Edvin API integration
// PURPOSE: Zingtree Script Node (tree transform). Replaces 17 static actions arrays with the Edvin errandConfiguration API response; flattens channels->categories->types->actions, maps buckets, keeps IDs for registerErrand.

// ETG Errand Register — tree transform, API-driven version
// Replaces the 17 static actions arrays with the Edvin errandConfiguration response.
// Output keeps the old item shape ({name, bucket, edvin_actions}) so downstream
// nodes keep working, and adds numeric IDs needed for POST registerErrand.

// --- 1. Channel: was a tags filter, now selects a top-level branch ---
// Map Zingtree channel -> Edvin channel ID.
// Prefer sourcing these from getLongProperty (Edvin.Errands.Channels.PhoneIn.Id etc.)
// instead of hardcoding.
const channelIdMap = {
  Phone: 1, // "1: Phone In"
  Email: 3, // "2: Mail In"
  Chat: null // OPEN ITEM #4: no Chat channel in API yet
};

// --- 2. Bucket: was a routing string, now an object {id, name} ---
// Map API bucket names -> the routing keys the tree already branches on.
// Prefer getLongProperty (Edvin.Errands.Buckets.Proceed.Id) and match on ID.
const bucketMap = {
  "Proceed": "proceed",
  "Do not proceed": "no_action"
  // OPEN ITEM #3: escalate, different_request, proceed/take_payment
  // don't exist in the sample yet — confirm full bucket list with Elis.
};

// --- 3. Parse the API response (adjust to however the node stores it) ---
const apiData = JSON.parse(edvin_config_response); // e.g. from the API call node

const channelNode = (apiData.channels || [])
  .find(c => c.id === channelIdMap[channel]);

// --- 4. Flatten channels -> categories -> types -> actions ---
let actions_array = [];

if (channelNode) {
  for (const category of channelNode.categories || []) {
    // OPEN ITEM #5: subCategories are empty in all samples; if Edvin starts
    // populating them instead of types, this picks whichever is non-empty.
    const groups = (category.types && category.types.length)
      ? category.types
      : (category.subCategories || []);

    for (const type of groups) {
      for (const action of type.actions || []) {
        actions_array.push({
          name: action.name, // OPEN ITEM #2: Edvin name, not the old agent-facing label
          bucket: bucketMap[action.bucket?.name] ?? "no_action", // safe default
          edvin_actions: {
            category: category.name,
            type: type.name,
            action: action.name
          },
          // Keep IDs — registerErrand should send these, not display names (open item #7)
          ids: {
            channelId: channelNode.id,
            categoryId: category.id,
            typeId: type.id,
            actionId: action.id,
            bucketId: action.bucket?.id
          }
        });
      }
    }
  }
}

// --- 5. Flow scoping (replaces actionsArrayMap[actions_array_name]) ---
// OPEN ITEM #1: the API has no field that maps to the 17 flow names.
// Until ETG confirms the mapping (tree key FL/SL? category?), scope by
// category name per flow. Example placeholder:
const flowCategoryMap = {
  void_actions_array: ["2: Cancellation / refund"],
  before_ticket_issuance_actions_array: ["2: Cancellation / refund"]
  // ...fill in once ETG confirms flow -> category mapping
};

const allowedCategories = flowCategoryMap[actions_array_name];
if (allowedCategories) {
  actions_array = actions_array.filter(item =>
    allowedCategories.includes(item.edvin_actions.category)
  );
}

ZT.setTransformData("actions_array", actions_array);
