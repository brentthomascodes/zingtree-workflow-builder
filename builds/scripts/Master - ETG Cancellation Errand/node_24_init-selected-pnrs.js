let selected_pnrs = views.findorder || [];
ZT.setTransformData("selected_pnrs", selected_pnrs)

ZT.setFormData("category", custom_field_29658558478738);


function mapInteractionType(type) {
  const map = {
    genesys_interaction_type__call: "Phone",
    genesys_interaction_type__message: "Chat",
    genesys_interaction_type__email: "Email"
  };

  return map[type] || "Phone"; // or return type if you prefer fallback
}

ZT.setFormData("channel", mapInteractionType(custom_field_30555623661842));