let final_pnrs = transforms.final_pnrs || [];
let final_pnrs_count = transforms.final_pnrs_count || 0;
let current_pnr = final_pnrs[final_pnrs_count];
let is_more_pnrs = true;

final_pnrs_count++;
if (final_pnrs_count >= final_pnrs.length) {
  is_more_pnrs = false;
}

ZT.setTransformData("final_pnrs_count", final_pnrs_count);
ZT.setFormData("is_more_pnrs", is_more_pnrs);
ZT.setTransformData("current_pnr", current_pnr);