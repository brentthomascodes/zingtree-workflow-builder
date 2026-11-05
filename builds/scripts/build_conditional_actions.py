#!/usr/bin/env python3
"""
Generate node 1's conditional + dynamic customer_action fields for the ETG
"Register Errands - Dynamic" tree, and collapse the separate action node into it.

    python3 build_conditional_actions.py <tree.json> <edvin-config.json> <out.json>

The Edvin config is the GET errand-configuration response, or anything with the
same shape. Only the types of the Cancellation-equivalent category are read:

    { "types": [ { "id": ..., "name": ..., "actions": [...] } ] }
    or the full  { "channels":[{ "categories":[{ "types":[...] }] }] }  response.

WHY THIS SHAPE
--------------
Two capabilities are separately proven in ETG's production trees:

  conditional          {"conditional":{"simple":[{"variable":"X","op":"eq","value":"Y"}]}}
                       28 uses, and 28 of those depend on a field on the SAME node
                       (GDS 51/53, Portals 96/107, LCC 18). Same-node cascade works.

  dynamic list source  {"list_source_type":"dynamic","list_dynamic_source":
                        {"type":"transforms","variable":"category.types", ...}}
                       Proven on node 1's `type` field.

What is NOT proven anywhere in ETG: the two on ONE field (0 uses), and a variable
inside the dynamic path (0 uses - every path in every tree is a static literal).

So this generator avoids path interpolation entirely. Instead of one field whose
source path is computed from the selected type, it writes ONE field PER TYPE, each
with a STATIC path into node 46's grouping and a conditional that shows it only when
that type is selected. Every field shares the name `customer_action_pick`, so exactly
one is visible and exactly one posts. Node 1 already proves Zingtree tolerates two
fields sharing a name (hidden `notes` + multiline `notes`).

That leaves exactly one unproven thing to verify in sandbox - conditional and
list_dynamic_source coexisting on a single field - instead of two.
"""
import json, sys, copy


def load_types(cfg):
    """Accept either a bare {types:[...]} or the full errand-configuration response."""
    if isinstance(cfg, dict) and cfg.get("types"):
        return cfg["types"]
    for channel in (cfg.get("channels") or []):
        for category in (channel.get("categories") or []):
            if category.get("types"):
                return category["types"]
    raise SystemExit("Could not find a types[] array in the config file.")


def action_field(type_id, type_name, rank):
    """One conditional + dynamic select, scoped to a single type."""
    return {
        "type": "select",
        "name": "customer_action_pick",
        "label": "Customer Action:",
        "label_type": "L",
        "options": "",
        "hidden_value": "",
        "custom_regex": "",
        "inline": "0",
        # Not required: only the matching type's field is visible, and a required
        # field that is hidden blocks the node in some form engines. The pick is
        # enforced downstream by node 27's unresolved guard instead.
        "required": "0",
        "score_var": "",
        "checkbox_score": "1",
        "scores": "",
        "rank": str(rank),
        "config": json.dumps({
            "filterable": True,
            "list_source_type": "dynamic",
            "list_dynamic_source": {
                "type": "transforms",
                # STATIC path into node 46's actions_by_type grouping. No interpolation.
                "variable": "actions_by_type." + str(type_id),
                "attributes": {"label": "name", "value": "id", "score": ""}
            },
            "conditional": {
                "simple": [{"variable": "type", "op": "eq", "value": str(type_id)}]
            },
            "help_text": "Actions available for " + type_name
        })
    }


def main():
    if len(sys.argv) != 4:
        raise SystemExit(__doc__)
    tree_path, cfg_path, out_path = sys.argv[1:4]

    tree = json.load(open(tree_path))
    types = load_types(json.load(open(cfg_path)))
    N = tree["nodes"]

    # --- node 1: keep `type` and `notes`, append one action field per type -----
    old = N["1"]["formfields"]
    keep = [f for f in old.values() if f.get("name") in ("type", "notes")]
    fields, rank = {}, 0
    for f in keep:
        f = copy.deepcopy(f)
        rank += 1
        f["rank"] = str(rank)
        fields[str(len(fields))] = f
    # hidden same-name field FIRST among the action fields, so the previous PNR's
    # pick is cleared on render (the ETG clear-out convention, tracker #21)
    rank += 1
    fields[str(len(fields))] = {
        "type": "hidden", "name": "customer_action_pick", "label": "", "label_type": "L",
        "options": "", "hidden_value": "", "custom_regex": "", "inline": "0",
        "required": "0", "score_var": "", "checkbox_score": "1", "scores": "",
        "rank": str(rank), "config": ""
    }
    for t in types:
        rank += 1
        fields[str(len(fields))] = action_field(t.get("id"), t.get("name") or "", rank)
    N["1"]["formfields"] = fields
    N["1"]["page_title"] = "Agent - Select Type & Customer Action"

    # --- collapse node 54: the action now lives on node 1 ----------------------
    # 1 -> 2 (build actions_array + upsert PNR) -> 55 (record the pick) -> 11
    N["1"]["buttons"]["0"]["button_link"] = "2"
    N["2"]["continuation_node_id"] = "55"
    if "54" in N:
        del N["54"]

    # node 56 (re-select entry) still restarts the loop at node 7 - unchanged.

    json.dump(tree, open(out_path, "w"), indent=1)
    print("types: %d | action fields written: %d | node 54 removed | 1 -> 2 -> 55 -> 11"
          % (len(types), len(types)))
    for t in types:
        print("   type %-28s -> transforms.actions_by_type.%s" % (t.get("name"), t.get("id")))


if __name__ == "__main__":
    main()
