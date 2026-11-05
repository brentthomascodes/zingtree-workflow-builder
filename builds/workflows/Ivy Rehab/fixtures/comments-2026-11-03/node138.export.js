// Format Case Date Only
function getDate(datetime) {
    if (!datetime) return '';
    return new Date(datetime).toISOString().split('T')[0];
}

function formatToISOWithoutOffset(dateStr, timeStr) {
    const [month, day, year] = dateStr.split('/').map(Number);

    // Normalize spacing/capitalization for AM/PM
    // Examples:
    // "6:30am"  -> "6:30 AM"
    // "8:15Pm"  -> "8:15 PM"
    // "7:00 PM" -> "7:00 PM"
    const normalizedTime = timeStr
        .trim()
        .replace(/\s*/g, '') // remove all spaces
        .replace(/^(\d{1,2}:\d{2})(am|pm)$/i, (_, time, modifier) => {
            return `${time} ${modifier.toUpperCase()}`;
        });

    const match = normalizedTime.match(/^(\d{1,2}):(\d{2}) (AM|PM)$/);

    if (!match) {
        throw new Error(`Invalid time format: "${timeStr}"`);
    }

    let [, hours, minutes, modifier] = match;

    hours = Number(hours);
    minutes = Number(minutes);

    // Convert to 24-hour format
    if (modifier === 'PM' && hours !== 12) {
        hours += 12;
    }

    if (modifier === 'AM' && hours === 12) {
        hours = 0;
    }

    const pad = (num) => String(num).padStart(2, '0');

    return `${year}-${pad(month)}-${pad(day)}T${pad(hours)}:${pad(minutes)}:00`;
}

function formatUnixTimestamp(timestamp) {
  return new Date(timestamp).toISOString().slice(0, 19);
}

let appointment_datetime = formatToISOWithoutOffset(appt_date, appt_time);
ZT.setFormData("appointment_datetime", appointment_datetime)


ZT.setFormData("appointment_datetime_dateonly", getDate(appointment_datetime));
let date_appt_format = new Date(appointment_datetime);
ZT.setFormData("to_query_param", formatUnixTimestamp(date_appt_format.setMinutes(date_appt_format.getMinutes() + 60)));
// ZT.setFormData("to_query_param", "")
ZT.setFormData("appointment_carestart_dateonly", getDate(new Date()));

//// FORMAT SUMMARY NOTES

function buildSummaryFromVariables(variableNames, separator = "\n") {
    const pairs = variableNames
        .map(name => {
            const value = ZT.getVariableValue(name, "");
            return value !== "" ? `${name}: ${value}` : null;
        })
        .filter(item => item !== null);

    return pairs.join(separator);
}

function generateSummaryText() {
    const variables = [
        "disposition_type",
        "rt_task_subtype",
        "caller_first_name",
        "follow_up_notes",
        "zt_session_notes",
        "message_for_clinic",
        "message_for_patient_exp",
        "general_question",
        "running_late_notes",
        "final_notes",
        "wc_payor",
        "claim_number",
        "date_of_injury",
        "wc_adjuster",
        "wc_adjuster_phone",
        "mva_payor",
        "mva_claim_number",
        "mva_date_of_accident",
        "patient_first_name",
        "patient_dob",
        "patient_birth_sex",
        "patient_pronouns",
        "patient_email_address",
        "patient_address_line_1",
        "patient_address_line_2",
        "therapy_type",
        "specialty_needed_name",
        "new_appointment_clinic",
        "how_did_you_hear_about_us",
        "body_part",
        "additional_treatment_notes",
        "is_prescription_found",
        "referring_physician_last_name",
        "referring_physician_first_name",
        "referring_physician_phone_number",
        "primary_care_physician_last_name",
        "primary_care_physician_first_name",
        "primary_care_physician_phone_number",
        "no_referral_note",
        "referred_to_ivy",
        "is_private_pay_patient",
        "va_facility",
        "va_facility_note",
        "updated_first_name",
        "updated_last_name",
        "updated_dob",
        "updated_phone_number",
        "updated_email_address",
        "updated_address_line_1",
        "updated_address_line_2",
        "updated_city",
        "updated_state",
        "updated_zipcode",
        "patient_insurance_other",
        "patient_insurance_rt_code",
        "missing_insurance_details",
        "subscriber_first_name",
        "subscriber_middle_initial",
        "subscriber_last_name",
        "subscriber_relationship_to_patient",
        "subscriber_dob",
        "group_number",
        "subscriber_id",
        "dod_benefit_number",
        "va_icn",
        "effective_year",
        "patient_secondary_insurance_other",
        "secondary_patient_insurance_rt_code",
        "secondary_subscriber_first_name",
        "secondary_subscriber_middle_initial",
        "secondary_subscriber_last_name",
        "secondary_subscriber_relationship_to_patient",
        "secondary_subscriber_dob",
        "secondary_group_number",
        "secondary_subscriber_id",
        "modify_reason",
        "inquiry_reason",
        "parent_guardian_first_name",
        "emergency_contact_first_name",
        "current_appointment_date",
        "current_appointment_time",
        "current_appointment_provider",
        "appt_time",
        "scheduled_out_reason",
        "post_op_expected_date",
        "rt_lead_type",
        "rt_lead_tag",
        "disposition_tag",
        "second_disposition_tag",
        "third_disposition_tag"
    ];

    const summary_text = buildSummaryFromVariables(variables, "\n\n");

    return summary_text;
}

let summary_text = generateSummaryText();

ZT.setTransformData("summary_text", summary_text)



/// NEW TEST DISPLAY DATA:

function Build_HTML_Summary() {
  const {
    name = "",
    clinic_raintree_code = "",

    disposition_type = "",
    rt_task_subtype = "",
    general_question = "",
    caller_first_name = "",
    caller_last_name = "",
    caller_phone_number = "",
    running_late_notes = "",
    message_for_clinic = "",
    message_for_patient_exp = "",

    patient_first_name = "",
    patient_last_name = "",
    patient_relationship_to_caller = "",
    patient_dob = "",
    patient_birth_sex = "",
    patient_pronouns = "",
    patient_pronoun_value = "",
    patient_phone_number = "",
    patient_email_address = "",
    patient_address_line_1 = "",
    patient_address_line_2 = "",
    patient_city = "",
    patient_state = "",
    patient_zipcode = "",

    therapy_type = "",
    new_appointment_clinic = "",
    new_appointment_clinic_raintree_code = "",
    how_did_you_hear_about_us = "",
    body_part = "",
    additional_treatment_notes = "",
    specialty_needed_name = "",

    is_prescription_found = "",
    referring_physician_first_name = "",
    referring_physician_last_name = "",
    referring_physician_phone_number = "",
    primary_care_physician_first_name = "",
    primary_care_physician_last_name = "",
    primary_care_physician_phone_number = "",
    no_referral_note = "",
    referred_to_ivy = "",
    va_facility = "",
    va_facility_note = "",
    is_private_pay_patient = "",
    appt_ie_pricing = "",
    appt_dv_pricing = "",

    updated_first_name = "",
    updated_last_name = "",
    updated_dob = "",
    updated_phone_number = "",
    updated_email_address = "",
    updated_address_line_1 = "",
    updated_address_line_2 = "",
    updated_city = "",
    updated_state = "",
    updated_zipcode = "",

    current_appointment_date = "",
    current_appointment_time = "",
    current_appointment_provider = "",

    patient_insurance_rt_code = "",
    missing_insurance_details = "",
    patient_insurance_other = "",
    subscriber_first_name = "",
    subscriber_middle_initial = "",
    subscriber_last_name = "",
    subscriber_relationship_to_patient = "",
    subscriber_dob = "",
    group_number = "",
    effective_year = "",
    subscriber_id = "",
    dod_benefit_number = "",
    va_icn = "",

    secondary_patient_insurance_rt_code = "",
    patient_secondary_insurance_other = "",
    secondary_subscriber_first_name = "",
    secondary_subscriber_middle_initial = "",
    secondary_subscriber_last_name = "",
    secondary_subscriber_relationship_to_patient = "",
    secondary_subscriber_dob = "",
    secondary_group_number = "",
    secondary_subscriber_id = "",

    wc_payor = "",
    claim_number = "",
    date_of_injury = "",
    wc_adjuster = "",
    wc_adjuster_phone = "",

    mva_payor = "",
    mva_claim_number = "",
    mva_date_of_accident = "",

    follow_up_notes = "",
    modify_reason = "",
    inquiry_reason = "",

    parent_guardian_first_name = "",
    parent_guardian_last_name = "",
    parent_guardian_phone_number = "",

    emergency_contact_relationship = "",
    emergency_contact_first_name = "",
    emergency_contact_last_name = "",
    emergency_contact_phone_number = "",
    is_emergency_contact_authorized_representative = "",

    appt_clinic = "",
    appt_clinic_raintree_code = "",
    appt_date = "",
    appt_time = "",
    appt_provider = "",
    scheduled_out_reason = "",
    post_op_expected_date = "",
    zt_session_notes = "",
    final_notes = "",

    rt_lead_type = "",
    rt_lead_tag = "",
    disposition_tag = "",
    second_disposition_tag = "",
    third_disposition_tag = "",
    session = "",

    clinic_info_popup = ""
  } = globalThis;

  const isUnset = (v) => {
    const s = String(v == null ? "" : v).trim();
    return s === "" || s === "0" || (s.startsWith("#") && s.endsWith("#"));
  };

  const eq = (a, b) => String(a == null ? "" : a).trim() === b;
  const show = (condition, html) => (condition ? html : "");
  const esc = (v) => String(v == null ? "" : v);

  const showUpdateRecordDoublecheck =
    eq(disposition_type, "PEC - Appointment Scheduled IE") ||
    eq(rt_task_subtype, "PEC - Update Info");

  const showUpdateInfoTask = eq(rt_task_subtype, "PEC - Update Info");

  const showMedicalInfo =
    !isUnset(therapy_type) || !isUnset(specialty_needed_name);

  const showMvaInfo =
    !isUnset(mva_payor) ||
    !isUnset(mva_claim_number) ||
    !isUnset(mva_date_of_accident);

  const showUpdatedPatientInfo = !(
    isUnset(updated_first_name) &&
    isUnset(updated_last_name) &&
    isUnset(updated_dob) &&
    isUnset(updated_phone_number) &&
    isUnset(updated_email_address) &&
    isUnset(updated_address_line_1) &&
    isUnset(updated_address_line_2) &&
    isUnset(updated_city) &&
    isUnset(updated_state) &&
    isUnset(updated_zipcode)
  );

  const showOriginalAppointmentInfo =
    !isUnset(current_appointment_date) &&
    !isUnset(current_appointment_time) &&
    !isUnset(current_appointment_provider);

  const showInsuranceInfo = !isUnset(patient_insurance_other);

  const showSecondaryInsuranceInfo = !isUnset(patient_secondary_insurance_other);

  const showRtLeadTaskDisplay = !eq(disposition_tag, "Transferred");

  const value = `
<!-- begin CLINIC INFO BUNDLE -->
<div class="clinic-info-modal-bundle">
  <!-- begin CLINIC INFO POPUP MODAL -->${esc(clinic_info_popup)}
  <!-- end CLINIC INFO POPUP MODAL -->

  <!--begin CALL INFO HEADER -->
  <div class="call-info-header panel panel-reference panel-horizontal">
    <div class="panel-heading"><i class="fa fa-phone-square" aria-hidden="true"></i></div>
    <div class="panel-body">
      <div class="col-md-6">
        <strong><i class="fa fa-building-o" aria-hidden="true"></i> CLINIC</strong>
          <i class="fa fa-info-circle" data-toggle="tooltip" data-placement="right" title="more Clinic Info" aria-hidden="true"></i>
          <span class="sr-only">more Clinic Info</span>
        <br>${name} (${clinic_raintree_code})
      </div>
    </div>
  </div>
  <!--end CALL INFO HEADER -->
</div>
<!-- end CLINIC INFO BUNDLE -->

${show(showUpdateRecordDoublecheck, `
<!-- begin DOUBLE CHECK IF EXISTING PATIENT -->
<div id="update_record_doublecheck_display">
  <div class="panel panel-instructions panel-horizontal">
    <div class="panel-heading"><i class="fa fa-list" aria-hidden="true"></i></div>
    <div class="panel-body">
      <p>Double-check Raintree to make sure there is no previous record for the patient. If found, update the record in Raintree with the data collected during the call.</p>
      ${show(showUpdateInfoTask, `
      <p id="update_info_task_display">If the record is not found, create the task provided below in Raintree with the data collected during the call.</p>
      `)}
    </div>
  </div>
</div>
<!-- end DOUBLE CHECK IF EXISTING PATIENT -->
`)}

<!-- begin SUMMARY INFO -->
<div id="summary_info_display">
  <div class="panel panel-reference panel-horizontal">
    <div class="panel-heading"><i class="fa fa-info-circle" aria-hidden="true"></i></div>
    <div class="panel-body">

      <p style="text-align:center;"><u><strong>CALL SUMMARY</strong></u></p>

      ${show(!isUnset(caller_first_name), `
      <p id="caller_info_display"><u><strong>Caller Info</strong></u>
        <br><strong>First Name:</strong> ${caller_first_name}
        <br><strong>Last Name:</strong> ${caller_last_name}
        <br><strong>Phone Number:</strong> ${caller_phone_number}</p>
      `)}

      ${show(!isUnset(general_question), `
      <p id="general_question_display"><strong>Question(s):</strong>
        <br>${general_question}</p>
      `)}

      ${show(!isUnset(running_late_notes), `
      <p id="running_late_notes_display"><strong>Message:</strong>
        <br>${running_late_notes}</p>
      `)}

      ${show(!isUnset(message_for_clinic), `
      <p id="caller_message_for_clinic_display"><strong>Message:</strong>
        <br>${message_for_clinic}</p>
      `)}

      ${show(!isUnset(message_for_patient_exp), `
      <p id="caller_message_for_patient_exp_display"><strong>Message:</strong>
        <br>${message_for_patient_exp}</p>
      `)}

      ${show(!isUnset(patient_first_name), `
      <p id="patient_info_display"><u><strong>Patient Info</strong></u>
        <br><strong>First Name:</strong> ${patient_first_name}
        <br><strong>Last Name:</strong> ${patient_last_name}
        <br><strong>Relationship to Patient:</strong> ${patient_relationship_to_caller}
        ${show(!isUnset(patient_dob), `<br><span id="patient_dob_display"><strong>DOB:</strong> ${patient_dob}&nbsp;<br></span>`)}
        ${show(!isUnset(patient_birth_sex), `<span id="patient_birth_sex_display"><strong>Birth Sex:</strong> ${patient_birth_sex}&nbsp;${show(!eq(patient_pronouns, "[not offered]"), `<span id="patient_pronouns_display">(${patient_pronouns})<span>${patient_pronoun_value}</span></span>`)}<br></span>`)}
        <strong>Phone Number:</strong> ${patient_phone_number}
        ${show(!isUnset(patient_email_address), `<br><span id="patient_email_display"><strong>Email:</strong> ${patient_email_address}&nbsp;<br></span>`)}
        ${show(!isUnset(patient_address_line_1), `<span id="patient_address_display"><strong>Mailing Address:</strong>&nbsp;<br>${patient_address_line_1}
${show(!isUnset(patient_address_line_2), `${patient_address_line_2}&nbsp;<br>`)}
${patient_city}, ${patient_state} ${patient_zipcode}</span>`)}
      </p>
      `)}

      ${show(showMedicalInfo, `
      <p id="medical_info_display"><u><strong>Medical Information</strong></u>
        ${show(!isUnset(therapy_type), `<br><span id="therapy_type_display"><strong>What are you here for?</strong> ${therapy_type}<br></span>`)}
        ${show(!isUnset(new_appointment_clinic), `<span id="preferred_location_display"><strong>Preferred Location:&nbsp;</strong>${new_appointment_clinic}
(${new_appointment_clinic_raintree_code})<br></span>`)}
        ${show(!isUnset(how_did_you_hear_about_us), `<span id="how_heard_display"><strong>How did you hear about us?</strong> ${how_did_you_hear_about_us}<br></span>`)}
        ${show(!isUnset(body_part), `<span id="body_part_display"><strong>Body Part:&nbsp;</strong>${body_part}<br></span>`)}
        ${show(!isUnset(additional_treatment_notes), `<span id="treatment_notes_display"><strong>Additional Treatment Notes:</strong> ${additional_treatment_notes}<br></span>`)}
        ${show(!isUnset(specialty_needed_name), `<span id="specialty_needed_display"><strong>Specialty Needed:</strong> ${specialty_needed_name}</span>`)}
      </p>
      `)}

      ${show(!eq(is_prescription_found, "no") && !isUnset(is_prescription_found), `
      <p id="presciption_in_rt_display"><strong>Prescription:</strong> Already recorded in Raintree <span class="hide">${is_prescription_found}</span></p>
      `)}

      ${show(!isUnset(referring_physician_last_name), `
      <p id="referring_physcian_display"><strong>Referring Physician:</strong> ${referring_physician_first_name} ${referring_physician_last_name} &nbsp; ${referring_physician_phone_number}</p>
      `)}

      ${show(!isUnset(primary_care_physician_last_name), `
      <p id="primary_care_physician_display"><strong>PCP:</strong> ${primary_care_physician_first_name} ${primary_care_physician_last_name} &nbsp; ${primary_care_physician_phone_number}</p>
      `)}

      ${show(!isUnset(no_referral_note), `
      <p id="no_referral_note_display"><strong>Referring Provider Note:</strong> ${no_referral_note}</p>
      `)}

      ${show(!isUnset(referred_to_ivy), `
      <p id="referred_to_ivy_display"><strong>Referred to Ivy:</strong> ${referred_to_ivy}</p>
      `)}

      ${show(!isUnset(va_facility), `
      <p id="va_facility_display"><strong>VA Facility:</strong> ${va_facility}</p>
      `)}

      ${show(!isUnset(va_facility_note), `
      <p id="va_facility_note_display"><strong>VA Facility Note:</strong> ${va_facility_note}</p>
      `)}

      ${show(eq(is_private_pay_patient, "true"), `
      <p id="private_pay_info_display"><strong>Private Pay Patient</strong> (Quoted $${appt_ie_pricing} for IE and $${appt_dv_pricing} for follow-ups) <span class="hide">${is_private_pay_patient}</span></p>
      `)}

      ${show(showUpdatedPatientInfo, `
      <div id="updated_patient_info_display"><u><strong>Updated Patient Info</strong></u>
        ${show(!isUnset(updated_first_name), `<br><span id="updated_first_name_display"><strong>First Name:</strong> ${updated_first_name}&nbsp;<br></span>`)}
        ${show(!isUnset(updated_last_name), `<span id="updated_last_name_display"><strong>Last Name:</strong> ${updated_last_name}&nbsp;<br></span>`)}
        ${show(!isUnset(updated_dob), `<span id="updated_dob_display"><strong>DOB:</strong> ${updated_dob}&nbsp;<br></span>`)}
        ${show(!isUnset(updated_phone_number), `<span id="updated_phone_number_display"><strong>Phone Number:</strong> ${updated_phone_number}&nbsp;<br></span>`)}
        ${show(!isUnset(updated_email_address), `<span id="updated_email_address_display"><strong>Email:</strong> ${updated_email_address}&nbsp;<br></span>`)}
        ${show(!isUnset(updated_address_line_1), `<span id="updated_address_line_1_display"><strong>Address Line 1:</strong> ${updated_address_line_1}&nbsp;<br></span>`)}
        ${show(!isUnset(updated_address_line_2), `<span id="updated_address_line_2_display"><strong>Address Line 2:</strong> ${updated_address_line_2}&nbsp;<br></span>`)}
        ${show(!isUnset(updated_city), `<span id="updated_city_display"><strong>City:</strong> ${updated_city}&nbsp;<br></span>`)}
        ${show(!isUnset(updated_state), `<span id="updated_state_display"><strong>State:</strong> ${updated_state}&nbsp;<br></span>`)}
        ${show(!isUnset(updated_zipcode), `<span id="updated_zipcode_display"><strong>ZIP Code:</strong> ${updated_zipcode}<br></span>`)}
        <p><br></p>
      </div>
      `)}

      ${show(showOriginalAppointmentInfo, `
      <p id="original_appointment_info_display"><strong><u>Original Appointment Information</u></strong>
        <br><strong>Date:</strong> ${current_appointment_date}
        <br><strong>Time:</strong> ${current_appointment_time}
        <br><strong>Provider:</strong> ${current_appointment_provider}</p>
      `)}

      ${show(showInsuranceInfo, `
      <div id="insurance_info_display">
        <p><u><strong>Insurance Info</strong></u>
          ${show(!isUnset(patient_insurance_rt_code), `<br><span id="insurance_rt_code_display"><strong>Insurance Raintree Code:</strong> ${patient_insurance_rt_code}&nbsp;<br></span>`)}
          ${show(!isUnset(patient_insurance_other), `<span id="other_insurance_message_display">Enter insurance information in comments in Raintree&nbsp;<br></span>`)}
          ${show(!isUnset(missing_insurance_details), `<span id="missing_insurance_details_display"><strong>Reason for no insurance details:</strong> ${missing_insurance_details}&nbsp;<br></span>`)}
          <span id="patient_insurance_name_display"><strong>Name of Insurance:</strong><span id="patient_insurance_other_display">${patient_insurance_other}&nbsp;<br></span>
          ${show(!isUnset(subscriber_first_name), `<span id="subscriber_first_name_display"><strong>Subscriber First Name:</strong> ${subscriber_first_name}&nbsp;<br></span>`)}
          ${show(!isUnset(subscriber_middle_initial), `<span id="subscriber_middle_initial_display"><strong>Subscriber Middle Initial:</strong> ${subscriber_middle_initial}&nbsp;<br></span>`)}
          ${show(!isUnset(subscriber_last_name), `<span id="subscriber_last_name_display"><strong>Subscriber Last Name:</strong> ${subscriber_last_name}&nbsp;<br></span>`)}
          ${show(!isUnset(subscriber_relationship_to_patient), `<span id="subscriber_relationship_to_patient_display"><strong>Relationship to Insured:</strong> ${subscriber_relationship_to_patient}&nbsp;<br></span>`)}
          ${show(!isUnset(subscriber_dob), `<span id="subscriber_dob_display"><strong>Subscriber DOB:</strong> ${subscriber_dob}&nbsp;<br></span>`)}
          ${show(!isUnset(group_number), `<span id="group_number_display"><strong>Group Number:</strong> ${group_number}&nbsp;<br></span>`)}
          ${show(!isUnset(effective_year), `<span id="effective_date_display"><strong>Effective Date:</strong> 01/01/${effective_year}&nbsp;<br></span>`)}
          ${show(!isUnset(subscriber_id), `<span id="subscriber_id_display"><strong>Subscriber/Member ID:</strong> ${subscriber_id}&nbsp;<br></span>`)}
          ${show(!isUnset(dod_benefit_number), `<span id="dod_benefit_number_display"><strong>DOD Benefit Number:</strong> ${dod_benefit_number}&nbsp;<br></span>`)}
          ${show(!isUnset(va_icn), `<span id="va_icn_display"><strong>ICN:</strong> ${va_icn}<br></span>`)}
        </p>
      </div>
      `)}

      ${show(showSecondaryInsuranceInfo, `
      <div id="secondary_insurance_info_display">
        <p><u><strong>Secondary Insurance Info</strong></u>
          ${show(!isUnset(secondary_patient_insurance_rt_code), `<br><span id="secondary_insurance_rt_code_display"><strong>Insurance Raintree Code:</strong> ${secondary_patient_insurance_rt_code}<br></span>`)}
          ${show(!isUnset(patient_secondary_insurance_other), `<span id="secondary_other_insurance_message_display">Enter insurance information in comments in Raintree<br></span>`)}
          <span id="secondary_patient_insurance_name_display"><strong>Name of Insurance:</strong><span id="secondary_patient_insurance_other_display">${patient_secondary_insurance_other}<br></span>
          ${show(!isUnset(secondary_subscriber_first_name), `<span id="secondary_subscriber_first_name_display"><strong>Subscriber First Name:</strong> ${secondary_subscriber_first_name}<br></span>`)}
          ${show(!isUnset(secondary_subscriber_middle_initial), `<span id="secondary_subscriber_middle_initial_display"><strong>Subscriber Middle Initial:</strong> ${secondary_subscriber_middle_initial}<br></span>`)}
          ${show(!isUnset(secondary_subscriber_last_name), `<span id="secondary_subscriber_last_name_display"><strong>Subscriber Last Name:</strong> ${secondary_subscriber_last_name}<br></span>`)}
          ${show(!isUnset(secondary_subscriber_relationship_to_patient), `<span id="secondary_subscriber_relationship_to_patient_display"><strong>Relationship to Insured:</strong> ${secondary_subscriber_relationship_to_patient}<br></span>`)}
          ${show(!isUnset(secondary_subscriber_dob), `<span id="secondary_subscriber_dob_display"><strong>Subscriber DOB:</strong> ${secondary_subscriber_dob}<br></span>`)}
          ${show(!isUnset(secondary_group_number), `<span id="secondary_group_number_display"><strong>Group Number:</strong> ${secondary_group_number}<br></span>`)}
          ${show(!isUnset(effective_year), `<span id="secondary_effective_date_display"><strong>Effective Date:</strong> 01/01/${effective_year}<br></span>`)}
          ${show(!isUnset(secondary_subscriber_id), `<span id="secondary_subscriber_id_display"><strong>Subscriber/Member ID:</strong> ${secondary_subscriber_id}<br></span>`)}
        </p>
      </div>
      `)}

      ${show(!isUnset(wc_payor), `
      <div id="wc_info_display">
        <p><u><strong>Workers Comp Information:</strong></u></p>
        ${show(!isUnset(wc_payor), `<span id="wc_payor_display"><strong>WC Payor:</strong> ${wc_payor}</span>`)}
        ${show(!isUnset(claim_number), `<br><span id="claim_number_display"><strong>Claim Number:</strong> ${claim_number}</span>`)}
        ${show(!isUnset(date_of_injury), `<br><span id="date_of_injury_display"><strong>Date of Injury:</strong> ${date_of_injury}</span>`)}
        ${show(!isUnset(wc_adjuster), `<br><span id="wc_adjuster_display"><strong>Adjuster:</strong> ${wc_adjuster}</span>`)}
        ${show(!isUnset(wc_adjuster_phone), `<br><span id="wc_adjuster_phone_display"><strong>Adjuster Phone:</strong> ${wc_adjuster_phone}</span>`)}
        <br>
        <p><br></p>
      </div>
      `)}

      ${show(showMvaInfo, `
      <div id="mva_info_display">
        <p><u><strong>MVA Information:</strong></u></p>
        ${show(!isUnset(mva_payor), `<span id="mva_payor_display"><strong>MVA Payor:</strong> ${mva_payor}<br></span>`)}
        ${show(!isUnset(mva_claim_number), `<span id="mva_claim_number_display"><strong>MVA Claim Number:</strong> ${mva_claim_number}<br></span>`)}
        ${show(!isUnset(mva_date_of_accident), `<span id="mva_date_of_accident_display"><strong>MVA Date of Accident:</strong> ${mva_date_of_accident}<br></span>`)}
        <p><br></p>
      </div>
      `)}

      ${show(!isUnset(follow_up_notes), `
      <p id="follow_up_notes_display"><strong>&nbsp;Follow-up Notes:</strong>
        <br>${follow_up_notes}</p>
      `)}

      ${show(!isUnset(modify_reason), `
      <p id="modify_reason_display"><strong>Modify Appointment Reason:</strong>
        <br>${modify_reason}</p>
      `)}

      ${show(!isUnset(inquiry_reason), `
      <p id="inquiry_reason_display"><strong>Inquiry Reason:</strong>
        <br>${inquiry_reason}</p>
      `)}

      ${show(!isUnset(parent_guardian_first_name), `
      <p id="guardian_info_display"><u><strong>Parent/Guardian</strong></u>
        <br><strong>First Name:</strong> ${parent_guardian_first_name}
        <br><strong>Last Name:</strong> ${parent_guardian_last_name}
        <br><strong>Phone Number:</strong> ${parent_guardian_phone_number}</p>
      `)}

      ${show(!isUnset(emergency_contact_first_name), `
      <p id="emergency_contact_info_display"><u><strong>Emergency Contact</strong></u>
        <br><strong>Relationship:</strong> ${emergency_contact_relationship}
        <br><strong>First Name:</strong> ${emergency_contact_first_name}
        <br><strong>Last Name:</strong> ${emergency_contact_last_name}
        <br><strong>Phone Number:</strong> ${emergency_contact_phone_number}
        <br><strong>Authorized Representative?:</strong> ${is_emergency_contact_authorized_representative}</p>
      `)}

      ${show(!isUnset(appt_time), `
      <p id="appointment_info_display"><strong><u>Appointment Information</u></strong>
        <br><strong>Clinic:</strong> ${appt_clinic} (${appt_clinic_raintree_code})
        <br><strong>Date:</strong> ${appt_date}
        <br><strong>Time:</strong> ${appt_time}
        <br><strong>Provider:</strong> ${appt_provider}
        <br><strong>Reason for Schedule on Date:</strong> ${scheduled_out_reason}</p>
      `)}

      ${show(!isUnset(post_op_expected_date), `
      <p id="post_op_expected_date_display"><strong>Post Op Date:</strong> ${post_op_expected_date}</p>
      `)}

      ${show(!isUnset(zt_session_notes), `
      <p id="zt_session_notes_display"><u><strong>Session Notes</strong></u>
        <br>${zt_session_notes}</p>
      `)}

      ${show(!isUnset(final_notes), `
      <p id="final_notes_display"><strong>End Call / Call Disconnected Notes:</strong>
        <br>${final_notes}</p>
      `)}

    </div>
  </div>
</div>
<!-- end SUMMARY INFO -->

${show(!isUnset(general_question), `
<!-- begin GENERAL INQUIRY OTHER NOTE -->
<div id="general_inquiry_task_lead_display">
  <div class="panel panel-instructions panel-horizontal">
    <div class="panel-heading"><i class="fa fa-list" aria-hidden="true"></i></div>
    <div class="panel-body">
      <p>Double-check Raintree to see if there is a record for the patient. If found, create a task with the caller&#39;s question(s).
        <br>If patient record is not found, create a lead with the caller&#39;s question(s).</p>
    </div>
  </div>
</div>
<!-- end GENERAL INQUIRY OTHER NOTE -->
`)}

<!-- begin TASK/LEAD/DISPOSITION -->
<div id="action_items_display">
  <div class="panel panel-actions panel-horizontal">
    <div class="panel-heading"><i class="fa fa-check-square-o" aria-hidden="true"></i></div>
    <div class="panel-body">

      ${show(showRtLeadTaskDisplay, `
      <div id="rt_lead_task_display">
        ${show(!isUnset(rt_task_subtype), `<p id="rt_task_prompt_display">Create a task in Raintree - <span id="rt_task_subtype_display"><strong>${rt_task_subtype}</strong></span></p>`)}
        ${show(!isUnset(rt_lead_type), `<p id="rt_lead_prompt_display">Create a lead in Raintree with lead stage <strong>${rt_lead_type}</strong>${show(!isUnset(rt_lead_tag), `<span id="rt_lead_tag_display">&nbsp;and type <strong>${rt_lead_tag}</strong> in lead comments</span>`)}</p>`)}
        <p id="zt_session_id_display" class="hide">Record this call&#39;s Session ID in Raintree&#39;s Communication Call Log - <strong>${session}</strong></p>
      </div>
      `)}

    </div>
  </div>
</div>
<!-- end TASK/LEAD/DISPOSITION -->
`;

  ZT.setTransformData("Summary_HTML", value);
};

Build_HTML_Summary()