import json
T4A = """If Requested Action = hc_business_personal_charges and Response Variant = driver_multi_ev_pushback:
<p>Hello,</p>
<p>Thank you for your email and for confirming that the home charger will be used for both personal and business charging.</p>
<p>We have a feature called Multi EV Mode. This allows charging sessions to be marked as either 'Personal EV' or 'Work EV', ensuring that only business‑related sessions are included in monthly payments.</p>
<p>For this to be enabled, a fleet manager must add this feature to the specific account on the fleet portal.</p>
<p>All charge sessions will be marked as 'Personal EV' by default. Each month, please ensure any business‑related charging is updated to 'Work EV' in the Homecharge Portal.</p>
<p><strong>How often should this be updated?</strong></p>
<p>We recommend reviewing and updating sessions every few days, so the information is fresh and accurate.</p>
<p><strong>What if a session is missed?</strong></p>
<p>If a session isn't marked as 'Work EV', it won't be included in the next monthly payment cycle. However, previous sessions can be updated within the following month, and they will be included in the next payment run.</p>
<p>A short video explaining how this works can be found <a href="https://premiercxvideo.wistia.com/medias/didc1cdm0n">here</a>.</p>
<p>Alternatively, for further assistance, please navigate the "Help and Support" tab in the Homecharge portal by <a href="https://login.chargepass.co.uk/">logging in</a>.</p>
<p>Kind regards<br>Allstar Homecharge Support</p>"""
T4B = """If Requested Action = hc_business_personal_charges and Response Variant = fleet_manager_multi_ev_response:
<p>Hello,</p>
<p>Thank you for your email.</p>
<p>Multi EV Mode allows your drivers to easily separate business and personal charging sessions, allowing them to manage multiple electric vehicles using the same charger.</p>
<p>This is useful to them if they have a personal EV or multiple EVs in their household. Drivers can do this by toggling each charge session as either personal or work.</p>
<p>All charging sessions are marked as personal by default, so they won't be covered by the business unless they update them.</p>
<p>Only sessions marked as work will be paid to their energy supplier.</p>
<p>You can activate this feature in Allstar Online by going to 'my cards', find the driver you want to enable it for, hover over the three dots, and choose 'Homecharge' from the menu. You'll see a multi EV Mode toggle. Switch it on so it turns from grey to green, then click update.</p>
<p>Once activated, your driver will need to regularly sign into their driver portal to manually toggle their personal and work charge sessions, ensuring accurate payments for business charging only.</p>
<p>If you need to deactivate multi EV mode, follow the same steps and switch the toggle from green to grey, then click update.</p>
<p>Here is a <a href="https://premiercxvideo.wistia.com/medias/mb48ytv62w">useful video</a> containing further information.</p>
<p>Kind regards,<br>Allstar Homecharge Support</p>"""
DEF = """Intent hc_business_personal_charges definition
Scan customer email for the following words/phrases or similar ones: - "Need to enable multi-EV mode" - "Need to add another EV" - "Have more than one EV" - "Need to add a second vehicle" - "Charge two EVs at home" - "Need both vehicles linked to the account" - "Have two EVs" - "Need both cars on the account" - "Use EV for business and personal" - "Charge EV for work and personal use" - "Need business charging separated from personal" - "Need to claim only business charging"
The customer wants home charging split between business and personal use, or more than one EV on the same home charger (Multi EV Mode)."""
VAR = """

hc_business_personal_charges:
- driver_multi_ev_pushback: the email is from a driver talking about their own account.
- fleet_manager_multi_ev_response: the email is from a fleet manager writing on behalf of a driver."""
patches = {
 "19": [
  {"section":"context","find":"- hc_resent_onboarding_email\n- other","old":"- hc_resent_onboarding_email\n- other","new":"- hc_resent_onboarding_email\n- hc_business_personal_charges\n- other"},
  {"section":"context","find":"Possible Response Variants","old":"Return \"\" for every other intent.","new":"hc_business_personal_charges only:\n- driver_multi_ev_pushback\n- fleet_manager_multi_ev_response\nReturn \"\" for every other intent."},
  {"section":"instructions","insert_after":"Intent hc_resent_onboarding_email definition","content":DEF},
  {"section":"instructions","find":"Response Variant\nhc_response_variant applies","old":"hc_response_variant applies to hc_tariff_update and hc_payment_query only. Return \"\" when neither is one of the detected intents.","new":"hc_response_variant applies to hc_tariff_update, hc_payment_query and hc_business_personal_charges only. Return \"\" when none of them is one of the detected intents."},
  {"section":"instructions","find":"Response Variant\nhc_response_variant applies","old":"Group 2b wins over Group 2a when both appear.","new":"Group 2b wins over Group 2a when both appear."+VAR},
  {"section":"instructions","find":"Response Variant\nhc_response_variant applies","old":"When both hc_tariff_update and hc_payment_query are detected, return the hc_tariff_update variant.","new":"When more than one of these intents is detected, return the variant of the first in this order: hc_tariff_update, hc_payment_query, hc_business_personal_charges."},
  {"section":"constraints","find":"hc_response_variant must be one of","old":"one of dd_increase_pushback or underpayment_response when hc_payment_query is detected and hc_tariff_update is not; and \"\" for every other intent.","new":"one of dd_increase_pushback or underpayment_response when hc_payment_query is detected and hc_tariff_update is not; one of driver_multi_ev_pushback or fleet_manager_multi_ev_response when hc_business_personal_charges is detected and neither of the other two is; and \"\" for every other intent."},
  {"section":"constraints","find":"WORKED EXAMPLES","old":"\"I've forgotten my password, and can my charger be moved to my new house?\"","new":"\"I use my EV for business and personal, how do I claim only business charging?\" -> hc_business_personal_charges, driver_multi_ev_pushback, no escalation\n\"I'm the fleet manager, one of my drivers has two EVs at home and needs both on the account\" -> hc_business_personal_charges, fleet_manager_multi_ev_response, no escalation\n\"I've forgotten my password, and can my charger be moved to my new house?\""}
 ],
 "18": [
  {"section":"instructions","find":"Your job is to generate a single email","old":"the three hc_tariff_update templates and the two hc_payment_query templates.","new":"the three hc_tariff_update templates, the two hc_payment_query templates and the two hc_business_personal_charges templates."},
  {"section":"instructions","insert_after":"If Requested Action = hc_resent_onboarding_email:","content":T4A},
  {"section":"instructions","insert_after":"If Requested Action = hc_business_personal_charges and Response Variant = driver_multi_ev_pushback:","content":T4B},
  {"section":"instructions","find":"REQUESTER TYPE","old":"For BOTH driver and fleet, the HTML structure","new":"Exception: the two hc_business_personal_charges templates are already written for their audience (driver_multi_ev_pushback for a driver, fleet_manager_multi_ev_response for a fleet manager). Use the one Response Variant selects exactly as written, whatever the Requester Type.\nFor BOTH driver and fleet, the HTML structure"}
 ]
}
# PROD threading: same swap as INT 29 Oct, generic over the PROD case alias
for i in ["13","12","20","21"]:
    patches["p"+i] = [{"section":"context","thread":True,"old":"${actions.get_case_details__prod.records[0].Description}","new":"${latest_customer_email}",
       "insert":"Earlier emails from the customer on this case, for context only (may be empty):\n${thread_context_emails}"}]
json.dump(patches, open("ai_patches.json","w"), ensure_ascii=False, indent=1)
print("ok", {k:len(v) for k,v in patches.items()})
