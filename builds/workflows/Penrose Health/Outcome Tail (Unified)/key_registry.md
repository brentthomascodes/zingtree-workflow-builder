# Outcome key registry (integration contract for source trees)

### Contraception

| outcome_key | title | suggested_outcome code | source node(s) |
|---|---|---|---|
| `con_email_prescription` | Outcome: Email prescription | 1.website | 36 |
| `con_msi_choices` | Outcome: MSI Choices | 1.info | 2.GPrtTEL | 3 |
| `con_nurse` | Outcome: Nurse | 1.NUrtF2F | 2.SHC | 27 |
| `con_pharmacist` | Outcome: Pharmacist | 1.PHrtF2F, PHrtTEL | 24 |
| `con_pharmacist_2` | Outcome: Pharmacist | 1.PHrtTEL | 2.SHC | 26 |
| `con_pharmacist_3` | Outcome: Pharmacist | 1.PHrtTEL | 30 |
| `con_pharmacist_4` | Outcome: Pharmacist | 1.PHrtTEL | 2.NUrtF2F | 31 |
| `con_pharmacist_5` | Outcome: Pharmacist | 1.PHrtF2F | 2.NUrtF2F | 32 |
| `con_pharmacist_6` | Outcome: Pharmacist | 1.PHrtTEL | 2.SHC | 39 |
| `con_pharmacist_7` | Outcome: Pharmacist | 1.P1 | 46 |
| `con_pharmacy_first` | Outcome: Pharmacy First | 1.P1 | 4,38,44 |
| `con_pharmacy_first_2` | Outcome: Pharmacy First | 1.P1 | 18 |
| `con_pharmacy_first_3` | Outcome: Pharmacy First | 1.P1 | 42 |
| `con_sexual_health_clinic` | Outcome: Sexual Health Clinic | 1.SHC | 2 |
| `con_sexual_health_clinic_2` | Outcome: Sexual Health Clinic | 1.SHC | 2.PHsdTEL | 28 |

### NHS Health Check

| outcome_key | title | suggested_outcome code | source node(s) |
|---|---|---|---|
| `nhs_hca_nurse` | Outcome: HCA/Nurse | 1.HCArtF2F | 2.NUrtF2F | 5 |
| `nhs_not_eligible` | Outcome: Not eligible | 1.noappt | 3 |
| `nhs_too_soon` | Outcome: Too soon | 1.info | 4 |

### Paediatric Cough, Cold & Fever

| outcome_key | title | suggested_outcome code | source node(s) |
|---|---|---|---|
| `paeds_emergency` | Outcome: Emergency | 1. AEor999 | 2 |
| `paeds_gp` | Outcome: GP | 1.GPrtF2F | 37 |
| `paeds_pa_paramedic` | Outcome: PA/Paramedic | 1.PAorPMsdF2F | 2.GPsdF2F | 3.GPEA | 4.UCC | 6,47 |
| `paeds_pa_paramedic_2` | Outcome: PA/Paramedic | 1.PAorPM48hrF2F | 2.GP48hrF2F | 3.GPEA | 4.UCC | 39,48 |
| `paeds_pa_paramedic_3` | Outcome: PA/Paramedic | 1.PAorPM1wkF2F | 2.GP1wkF2F | 3.GPEA | 4.UCC | 41 |
| `paeds_reassurance` | Outcome: Reassurance | 1.info | 2.P1 | 3.GPrtF2F | 11 |
| `paeds_reassurance_2` | Outcome: Reassurance | 1.info | 2.P1 | 34 |
| `paeds_reassurance_3` | Outcome: Reassurance | 1.info | 2.LocalPharm | 3.GPrtF2F | 40 |

### Pharmacy First

| outcome_key | title | suggested_outcome code | source node(s) |
|---|---|---|---|
| `p1_call_local_pharmacy` | Outcome: Call Local Pharmacy | 1.contactservice | 12 |
| `p1_duty_doctor` | Outcome: Duty Doctor | 1.LBDDsd, DD | 2 |
| `p1_emergency` | Outcome: Emergency | 1.AEor999 | 9 |
| `p1_pa_paramedic` | Outcome: PA/Paramedic | 1.PAorPMrtF2F | 6 |
| `p1_pa_paramedic_2` | Outcome: PA/Paramedic | 1.PAorPM1wkF2F | 2.GP1wkF2F | 3.GPEA | 4.UCC | 7 |
| `p1_pa_paramedic_3` | Outcome: PA/Paramedic | 1.PAorPMsdF2F | 2.GPsdF2F | 3.GPEA | 4.UCC | 8 |
| `p1_pharmacy_first` | Outcome: Pharmacy First | 1.P1 | 2.discuss | 11 |
| `p1_send_document` | Outcome: Send Document | 1.email, Accurx | 10 |

### Rash

| outcome_key | title | suggested_outcome code | source node(s) |
|---|---|---|---|
| `rash_emergency` | Outcome: Emergency | 1.AEor999 | 5 |
| `rash_emergency_2` | Outcome: Emergency | 1.AEor999 | 66,119,172 |
| `rash_gp` | Outcome: GP | 1.GPrtF2F | 12 |
| `rash_gp_10` | Outcome: GP | 1.GPrtF2F | 286 |
| `rash_gp_11` | Outcome: GP | 1.GPrtF2F | 287 |
| `rash_gp_12` | Outcome: GP | 1.GP1wkF2F | 2.GPEA | 3.LBDDsd, discuss | 4.discuss | 5.UCC | 320 |
| `rash_gp_13` | Outcome: GP | 1.GP24hrF2F | 2.GPEA | 3.UCC | 326 |
| `rash_gp_2` | Outcome: GP | 1.GPrtF2F | 13 |
| `rash_gp_3` | Outcome: GP | 1.GPsdF2F | 2.GPEA | 3.UCC | 15,242,289 |
| `rash_gp_4` | Outcome: GP | 1.GP1wkF2F | 2.GPEA | 3.discuss | 59,273 |
| `rash_gp_5` | Outcome: GP | 1.GP48hrF2F | 2.UCC | 70,123,176 |
| `rash_gp_6` | Outcome: GP | 1.GPsdF2F | 2.UCC | 75,128,181 |
| `rash_gp_7` | Outcome: GP | 1.GPrtF2F | 95,148,201 |
| `rash_gp_8` | Outcome: GP | 1.GPrtF2F | 239 |
| `rash_gp_9` | Outcome: GP | 1.GPrtF2F | 240 |
| `rash_local_pharmacy` | Outcome: Local Pharmacy | 1.LocalPharm | 2.PAorPM1wkF2F | 3.GP1wkF2F | 4.UCC | 34 |
| `rash_local_pharmacy_2` | Outcome: Local Pharmacy | 1.LocalPharm | 2.PM48hrF2F | 3.GP72hrF2F | 4.UCC | 99,152,205 |
| `rash_local_pharmacy_3` | Outcome: Local Pharmacy | 1.LocalPharm | 2.PAorPM1wkF2F | 3. GP1wkF2F | 4.UCC | 108,161,214 |
| `rash_local_pharmacy_4` | Outcome: Local Pharmacy | 1.LocalPharm | 2.PAorPMsdF2F | 3.GPsdF2F | 4.GPEA | 5.UCC | 258,305 |
| `rash_pa` | Outcome: PA | 1.PArtF2F | 2.GPrtF2F | 97,150,203 |
| `rash_pa_2` | Outcome: PA | 1.PAsdF2F | 2.GPsdF2F | 3.GPEA | 4.UCC | 331 |
| `rash_pa_paramedic` | Outcome: PA/Paramedic | 1.PAorPMsdF2F | 2.GPsdF2F | 3.GPEA | 4.UCC | 11 |
| `rash_pa_paramedic_10` | Outcome: PA/Paramedic | 1.PAorPMsdF2F | 2.GPsdF2F | 3.DD | 102 |
| `rash_pa_paramedic_11` | Outcome: PA/Paramedic | 1.PAorPMsdF2F | 2.GPsdF2F | 3.UCC | 104 |
| `rash_pa_paramedic_12` | Outcome: PA/Paramedic | 1.PAorPM1wkF2F | 2.GP1wkF2F | 3.UCC | 109 |
| `rash_pa_paramedic_13` | Outcome: PA/Paramedic | 1.PAorPM48hrF2F | 2.GP72hrF2F | 3.UCC | 113 |
| `rash_pa_paramedic_14` | Outcome: PA/Paramedic | 1.PAorPMrtF2F | 2.GPrtF2F | 114 |
| `rash_pa_paramedic_15` | Outcome: PA/Paramedic | 1.PAorPM48hrF2F | 2.UCC | 115,168,221 |
| `rash_pa_paramedic_16` | Outcome: PA/Paramedic | 1.PAorPM48hrF2F | 2.GP48hrF2F | 3.UCC | 141,194 |
| `rash_pa_paramedic_17` | Outcome: PA/Paramedic | 1.PAorPMsdF2F | 2.GPsdF2F | 3.DD | 155,208 |
| `rash_pa_paramedic_18` | Outcome: PA/Paramedic | 1.PAorPMsdF2F | 2.GPsdF2F | 3.UCC | 157,210 |
| `rash_pa_paramedic_19` | Outcome: PA/Paramedic | 1.PAorPM1wkF2F | 2.GP1wkF2F | 3.UCC | 162,215 |
| `rash_pa_paramedic_2` | Outcome: PA/Paramedic | 1.PAorPMrtF2F | 28 |
| `rash_pa_paramedic_20` | Outcome: PA/Paramedic | 1.PAorPM48hrF2F | 2.GP72hrF2F | 3.UCC | 166,219 |
| `rash_pa_paramedic_21` | Outcome: PA/Paramedic | 1.PAorPMrtF2F | 2.GPrtF2F | 167,220 |
| `rash_pa_paramedic_22` | Outcome: PA/Paramedic | 1.PAorPMrtF2F | 2.GPrtF2F | 236 |
| `rash_pa_paramedic_23` | Outcome: PA/Paramedic | 1.PAorPMrtF2F | 252 |
| `rash_pa_paramedic_24` | Outcome: PA/Paramedic | 1.PAorPM24hrF2F | 2.GP24hrF2F | 3.UCC | 257,260 |
| `rash_pa_paramedic_25` | Outcome: PA/Paramedic | 1.PAorPMsdF2F | 2.GPsdF2F | 3.GPEA | 4.UCC | 261 |
| `rash_pa_paramedic_26` | Outcome: PA/Paramedic | 1.PAorPMrtF2F | 2.GPrtF2F | 270 |
| `rash_pa_paramedic_27` | Outcome: PA/Paramedic | 1.PAorPM1wkF2F | 2.GP1wkF2F | 3.GPEA | 4.UCC | 271 |
| `rash_pa_paramedic_28` | Outcome: PA/Paramedic | 1.PAorPMsdF2F | 2.GPsdF2F | 3.DD | 272 |
| `rash_pa_paramedic_29` | Outcome: PA/Paramedic | 1.PAorPMrtF2F | 299 |
| `rash_pa_paramedic_3` | Outcome: PA/Paramedic | 1.PAorPM1wkF2F | 2.GP1wkF2F | 3.UCC | 33 |
| `rash_pa_paramedic_30` | Outcome: PA/Paramedic | 1.PAorPMsdF2F | 2.GPsdF2F | 3.UCC | 304,307 |
| `rash_pa_paramedic_31` | Outcome: PA/Paramedic | 1.PAorPMsdF2F | 2.GPsdF2F | 3.GPEA | 4.UCC | 308 |
| `rash_pa_paramedic_32` | Outcome: PA/Paramedic | 1.PAorPMrtF2F | 2.GPrtF2F | 317 |
| `rash_pa_paramedic_33` | Outcome: PA/Paramedic | 1.PAorPM1wkF2F | 2.GP1wkF2F | 3.GPEA | 4.UCC | 318 |
| `rash_pa_paramedic_34` | Outcome: PA/Paramedic | 1.PAorPMsdF2F | 2.GPsdF2F | 3.LBDD | 4.DD | 319 |
| `rash_pa_paramedic_35` | Outcome: PA/Paramedic | 1.PAorPM24hrF2F | 2.GP24hrF2F | 3.GPEA | 4.UCC | 327 |
| `rash_pa_paramedic_4` | Outcome: PA/Paramedic | 1.PAorPMsdF2F | 2.GPsdF2F | 3.UCC | 36 |
| `rash_pa_paramedic_5` | Outcome: PA/Paramedic | 1.PAorPMrtF2F | 2.GPrtF2F | 37,233 |
| `rash_pa_paramedic_6` | Outcome: PA/Paramedic | 1.PAorPMrtF2F | 2.GPrtF2F | 56 |
| `rash_pa_paramedic_7` | Outcome: PA/Paramedic | 1.PAorPM1wkF2F | 2.GP1wkF2F | 3.GPEA | 4.UCC | 57 |
| `rash_pa_paramedic_8` | Outcome: PA/Paramedic | 1.PAorPMsdF2F | 2.GPsdF2F | 3.DD | 58 |
| `rash_pa_paramedic_9` | Outcome: PA/Paramedic | 1.PAorPM48hrF2F | 2.GP48hrF2F | 3.UCC | 88 |
| `rash_paramedic` | Outcome: Paramedic | 1.PMrtF2F | 2.GPrtF2F | 14 |
| `rash_paramedic_10` | Outcome: Paramedic | 1.PMsdF2F | 2.GPsdF2F | 3.UCC | 243 |
| `rash_paramedic_11` | Outcome: Paramedic | 1.PM1wkF2F | 2.GP1wkF2F | 3.GPEA | 4.UCC | 244 |
| `rash_paramedic_12` | Outcome: Paramedic | 1.PMsdF2F | 2.GPsdF2F | 3.UCC | 290 |
| `rash_paramedic_13` | Outcome: Paramedic | 1.PM1wkF2F | 2.GP1wkF2F | 3.GPEA | 4.UCC | 291 |
| `rash_paramedic_14` | Outcome: Paramedic | 1.PM24hrF2F | 2.GP24hrF2F | 3.GPEA | 4.UCC | 328 |
| `rash_paramedic_15` | Outcome: Paramedic | 1.PMsdF2F | 2.GPsdF2F | 3.GPEA | 4.UCC | 332 |
| `rash_paramedic_2` | Outcome: Paramedic | 1.PM24hrF2F | 2.GP24hrF2F | 3.UCC | 16 |
| `rash_paramedic_3` | Outcome: Paramedic | 1.PM1wkF2F | 2.GP1wkF2F | 3.GPEA | 4.UCC | 18 |
| `rash_paramedic_4` | Outcome: Paramedic | 1.PMrtF2F | 2.GPrtF2F | 68 |
| `rash_paramedic_5` | Outcome: Paramedic | 1.PMsdF2F | 2.GPsdF2F | 3.UCC | 78 |
| `rash_paramedic_6` | Outcome: Paramedic | 1.PMrtF2F | 2.GPrtF2F | 121,174 |
| `rash_paramedic_7` | Outcome: Paramedic | 1.PMsdF2F | 2.GPsdF2F | 3.UCC | 131,184 |
| `rash_paramedic_8` | Outcome: Paramedic | 1.PMsdF2F | 2.GPsdF2F | 3.GPEA | 4.UCC | 238,285 |
| `rash_paramedic_9` | Outcome: Paramedic | 1.PMrtF2F | 2.GPrtF2F | 241,278,288 |
| `rash_pharmacist` | Outcome: Pharmacist | 1.PH1wkF2F, PH1wkTEL | 2.GP1wkF2F | 3.UCC | 35 |
| `rash_pharmacist_2` | Outcome: Pharmacist | 1.PHsdF2F, PHsdTEL | 2.UCC | 110,163,216 |
| `rash_pharmacist_3` | Outcome: Pharmacist | 1.PHsdF2F, PHsdTEL | 2.LBDDsd | 3.DD | 4.UCC | 259,306 |
| `rash_pharmacy_first` | Outcome: Pharmacy First | 1.P1 | 17,279 |
| `rash_pharmacy_first_2` | Outcome: Pharmacy First | 1.P1 | 43 |
| `rash_pharmacy_first_3` | Outcome: Pharmacy First | 1.P1 | 86,93,139,146,192,199 |
| `rash_pharmacy_first_4` | Outcome: Pharmacy First | 1.P1 | 94,147,200 |
| `rash_urgent_care` | Outcome: Urgent Care | 1.UCC | 19,245,292 |
| `rash_urgent_care_2` | Outcome: Urgent Care | 1.UCC | 73,126,179 |

### Women's Health

| outcome_key | title | suggested_outcome code | source node(s) |
|---|---|---|---|
| `wh_accurx` | Outcome: Accurx | 1.Accurx | 11 |
| `wh_accurx_2` | Outcome: Accurx | 1.Accurx | 22 |
| `wh_advice` | Outcome: Advice | 1.noappt | 10 |
| `wh_contact_abortion_clinic` | Outcome: Contact Abortion Clinic | 1.contactservice, Accurx | 2.GPsdF2F | 3.GPEA | 4.UCC | 132 |
| `wh_contact_abortion_clinic_2` | Outcome: Contact Abortion Clinic | 1.contactservice, Accurx | 2.discuss | 134 |
| `wh_contact_hospital` | Outcome: Contact Hospital | 1.contactservice | 2.GP72hrF2F | 3.UCC | 94 |
| `wh_emergency` | Outcome: Emergency | 1.AEor999 | 6 |
| `wh_gp` | Outcome: GP | 1.GPrtF2F | 4,136 |
| `wh_gp_2` | Outcome: GP | 1.GP1wkF2F | 2.GPEA | 3.UCC | 8 |
| `wh_gp_3` | Outcome: GP | 1.GPrtF2F | 16 |
| `wh_gp_4` | Outcome: GP | 1.GPsdF2F | 2.LBDDsd, DD | 92 |
| `wh_gp_5` | Outcome: GP | 1.GP48hrF2F | 2.GPEA | 3.UCC | 105 |
| `wh_gp_6` | Outcome: GP | 1.GPrtF2F | 145 |
| `wh_lbdd` | Outcome: LBDD | 1.LBDDsd, LBDD24hr, DD | 143 |
| `wh_midwife` | Outcome: Midwife | 1.midwife | 2.GP1wkF2F | 3.UCC | 104 |
| `wh_midwife_2` | Outcome: Midwife | 1.midwife | 2.PArtF2F | 3.GPrtF2F | 109 |
| `wh_midwife_3` | Outcome: Midwife | 1.midwife | 2.GPrtF2F | 115 |
| `wh_pa` | Outcome: PA | 1.PArtF2F | 2.GPrtF2F | 7 |
| `wh_pa_2` | Outcome: PA | 1.PA1wkF2F | 2.GP1wkF2F | 58 |
| `wh_pa_3` | Outcome: PA | 1.PA1wkF2F | 2.GP1wkF2F | 3.GPEA | 4.contactservice | 110 |
| `wh_pa_4` | Outcome: PA | 1.PA1wkF2F | 2.GP1wkF2F | 3.GPEA | 4.UCC | 121 |
| `wh_pa_5` | Outcome: PA | 1.PArtF2F | 2.GPrtF2F | 128 |
| `wh_pa_paramedic` | Outcome: PA/Paramedic | 1.PA72hrF2F | 2.GP72hrF2F | 3.GPEA | 4.UCC | 84 |
| `wh_pharmacy_first` | Outcome: Pharmacy First | 1.P1 | 13 |
| `wh_reassure` | Outcome: Reassure | 1.info,Accurx | 2.contactservice | 3.discuss | 131 |
| `wh_reassure_2` | Outcome: Reassure | 1.info, Accurx | 2.contactservice | 3.discuss | 135 |
| `wh_sexual_health_clinic` | Outcome: Sexual Health Clinic | 1.SHC | 2.GPrtF2F | 12 |
| `wh_sexual_health_clinic_2` | Outcome: Sexual Health Clinic | 1.SHC | 2.contactservice | 15 |
| `wh_sexual_health_clinic_3` | Outcome: Sexual Health Clinic | 1.SHC | 2.contactservice | 3.GP1wkF2F | 4.UCC | 51 |
| `wh_sexual_health_clinic_4` | Outcome: Sexual Health Clinic | 1.SHC | 2.PA1wkF2F | 3.GP1wkF2F | 4.GPEA | 5.UCC | 95 |
| `wh_sexual_health_clinic_5` | Outcome: Sexual Health Clinic | 1.SHC | 2.PArtF2F | 3.GPrtF2F | 4.contactservice | 103 |
| `wh_sexual_health_clinic_6` | Outcome: Sexual Health Clinic | 1.SHC | 2.PArtF2F | 3.GPrtF2F | 116 |
| `wh_sexual_health_clinic_7` | Outcome: Sexual Health Clinic | 1.SHC | 2.PHrtF2F, PHrtTEL | 3.GPrtF2F | 118 |
