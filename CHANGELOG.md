# Changelog

## 1.0.0-prod — 2026-05-31

- Hardened to v1.0-prod per squad doctrine; member of the DefenseTech vertical 6-pack.
- Spec-component repo (no Pages deploy required); AGPL-3.0-or-later, synthetic example data only.
- Pulse universe entry not applicable (no custom subdomain).



## [0.1] — 2026-05-30

### Added

- Initial schema + validator + canonical example.
- **22 event types** — most extensive Incident Card profile in the Suite, spanning DFARS cyber incidents, CUI handling (spillage/marking/mishandling), ITAR/EAR export-control violations, foreign-person access (unauthorized + blocked), classified-environment misuse + SCIF policy violations + AI-generated classified-marking errors, NISPOM insider-threat flags, personnel clearance mishandling, CMMC L2/L3 gaps + POA&M failures + SPRS discrepancies, AI-tool supply-chain compromise + update non-conformance, AI-output on unverified US-person systems, and third-party shared-responsibility incidents.
- **5 severity tiers**: S1-catastrophic / S2-critical / S3-significant / S4-moderate / S5-low.
- **19 regulatory_basis enum values** covering DFARS 7012/7019/7020/7021, CMMC 2.0 L2/L3, NIST SP 800-171/172, ITAR, EAR + deemed export, EO 13526, ICD 705, DoDI 5230.24, CUI Notice 2020-04, NISPOM + Conforming Change 2, FAR 52.204-21, False Claims Act.
- 3 invariants enforced:
  - **#1** DFARS 72-hour clock — `dfars-72-hour-cyber-incident` event requires `dfars_72_hour_report_filed.filed_at` within 72h of `discovered_at`
  - **#2** Export-control basis — ITAR event types require `itar-22-cfr-120-130`, EAR event types require `ear-15-cfr-730-774`
  - **#3** Distribution-statement obligation — CUI-Specified+ on S1/S2 severity requires `dodi-5230-24-distribution-statements`
- `affected_data` block with required `cui_categorization` + `export_control_status` + `approximate_record_count` (no raw record counts beyond approximation, no PII).
- `response_actions` array tracking actor + due date + status.
- `public_disclosure_posture` block with `dibnet_reported` + `ddtc_voluntary_disclosure_filed` + `bis_voluntary_disclosure_filed` + `fso_notified_at` + `public_summary_url`.
- `audit_stream_event_refs` linking back to source audit-stream events.
- Canonical example: Stratos Aerospace CUI spillage / DFARS 72-hour event filed via dibnet.dod.mil.
- 8 unit tests + 3 negative invariant tests.

### Not yet

- Classified-environment example bundle (would require fictional program designations + clearance level S/TS/TS-SCI walkthrough).
- Multi-incident pivot (one card per incident family).
- DDTC voluntary-disclosure example flow.
- ICD 705 SCIF physical-violation example.
- AI-tool-supply-chain compromise example with SBOM diff evidence.