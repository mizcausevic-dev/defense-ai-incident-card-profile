import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, "../examples/stratos-incident-card-cui-spillage-2026q4.json");

const card = {
  incident_id: "STRATOS-INC-2026-DFARS-0011",
  schema_version: "0.1",
  published_at: "2026-11-04T16:00:00Z",
  contractor: {
    cage_code_tokenized: "tok_cage_STRATOS_AERO_1A2B3",
    duns_tokenized: "tok_duns_STRATOS_AERO_998877665",
    facility_clearance_level: "SECRET"
  },
  event_type: "dfars-72-hour-cyber-incident",
  occurred_at: "2026-11-03T17:45:00Z",
  discovered_at: "2026-11-03T18:00:00Z",
  severity: "S2-critical",
  ai_system: {
    name: "VendorD GuardianAI",
    version: "3.x",
    ai_tool_card_url: "https://vendord-guardianai.example/.well-known/ai-tool-cards/guardianai-3.x.json"
  },
  affected_data: {
    cui_categorization: "CUI-SPECIFIED-NOFORN",
    export_control_status: "ITAR",
    approximate_record_count: 1,
    us_person_status_of_affected_persons_if_applicable: "US-Person-Verified employees only; no foreign-person disclosure"
  },
  regulatory_basis: [
    "dfars-252-204-7012-cyber-incident-reporting",
    "nist-sp-800-171-cui-protection",
    "itar-22-cfr-120-130",
    "dodi-5230-24-distribution-statements"
  ],
  dfars_72_hour_report_filed: {
    report_id: "STRATOS-DFARS-2026-0011",
    filed_at: "2026-11-04T15:30:00Z",
    dibnet_dod_mil_url: "https://dibnet.dod.mil/reports/STRATOS-DFARS-2026-0011"
  },
  response_actions: [
    { action: "Isolate impacted enclave + rotate credentials for affected service accounts", owner: "SOC-OnCall", due_at: "2026-11-03T20:00:00Z", status: "completed" },
    { action: "Notify FSO + DCSA Industrial Security Rep", owner: "FSO", due_at: "2026-11-03T21:00:00Z", status: "completed" },
    { action: "File DFARS 7012 cyber incident report via dibnet.dod.mil within 72h", owner: "CISO", due_at: "2026-11-06T18:00:00Z", status: "completed" },
    { action: "Forensic imaging of affected hosts + preserve for 90 days per 7012(d)", owner: "DFIR-Lead", due_at: "2026-11-10T18:00:00Z", status: "in-progress" },
    { action: "Update CMMC POA&M with corrective action plan", owner: "CMMC-Lead", due_at: "2026-11-15T18:00:00Z", status: "open" }
  ],
  audit_stream_event_refs: ["0190dt-0005"],
  public_disclosure_posture: {
    dibnet_reported: true,
    ddtc_voluntary_disclosure_filed: false,
    bis_voluntary_disclosure_filed: false,
    fso_notified_at: "2026-11-03T20:30:00Z"
  }
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(card, null, 2) + "\n", "utf8");
console.log(`built incident card → ${OUT}`);
