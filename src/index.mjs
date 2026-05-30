export const EVENT_TYPES = [
  "dfars-72-hour-cyber-incident", "cui-spillage-detected", "cui-marking-failure",
  "cui-mishandling-on-unauthorized-system", "itar-deemed-export-violation",
  "itar-license-mismatch", "ear-license-mismatch", "ear-entity-list-screening-failure",
  "foreign-person-unauthorized-access", "foreign-person-access-attempt-blocked",
  "classified-environment-ai-misuse", "scif-policy-violation-detected",
  "nispom-insider-threat-flag", "personnel-clearance-status-change-mishandling",
  "cmmc-l2-l3-readiness-gap-discovered", "cmmc-poam-open-finding-related-failure",
  "sprs-self-assessment-discrepancy", "ai-generated-classified-marking-error",
  "ai-tool-supply-chain-compromise-detected", "ai-tool-update-introduced-non-conformance",
  "ai-output-on-unverified-us-person-system", "third-party-shared-responsibility-incident"
];

export const SEVERITIES = ["S1-catastrophic", "S2-critical", "S3-significant", "S4-moderate", "S5-low"];

export function summarize(card) {
  return {
    incident_id: card.incident_id,
    event_type: card.event_type,
    severity: card.severity,
    cui: card.affected_data.cui_categorization,
    export_control: card.affected_data.export_control_status,
    record_count: card.affected_data.approximate_record_count,
    response_action_count: card.response_actions.length,
    dibnet_filed: Boolean(card.dfars_72_hour_report_filed)
  };
}
