let selected_pnrs = transforms.selected_pnrs || [];
let pnr_index = transforms.pnr_index || 0;

let current_pnr = selected_pnrs[pnr_index];
ZT.setTransformData("current_pnr", current_pnr);

pnr_index += 1;
ZT.setTransformData("pnr_banner", `<h3>PNR ${pnr_index} of ${selected_pnrs.length}</h3>`)
let isMorePNR = true;
if (pnr_index >= selected_pnrs.length) {
    isMorePNR = false
    pnr_index = 0;
} 

ZT.setTransformData("isMorePNR", isMorePNR)
ZT.setTransformData("pnr_index", pnr_index);