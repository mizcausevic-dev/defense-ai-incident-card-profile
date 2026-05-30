# defense-ai-incident-card-profile

> **DefenseTech Incident Card profile (Spec #5 of the DefenseTech 6-pack).** Publishable AI-incident record for DIB contractors covering DFARS 72-hour cyber incidents, CUI spillage, ITAR/EAR export-control violations, foreign-person access breaches, CMMC POA&M-related failures, classified-environment AI misuse, NISPOM insider-threat events, and AI-tool supply-chain compromise. **22 event types** — the largest Incident Card profile in the Suite.

Part of the [Kinetic Gain Protocol Suite](https://suite.kineticgain.com).

> Status: v0.1 draft. Canonical example: Stratos Aerospace × VendorD GuardianAI 3.x DFARS 72-hour cyber incident filed via dibnet.dod.mil.

## Regulatory floor

DFARS 252.204-7012/7019/7020/7021 · CMMC 2.0 L2/L3 · NIST SP 800-171/172 · ITAR · EAR + deemed export · EO 13526 + ICD 705 · DoDI 5230.24 · CUI Notice 2020-04 · NISPOM 32 CFR 117 + Conforming Change 2 · FAR 52.204-21 · False Claims Act 31 USC 3729.

## 22 event types encoded (most extensive Incident Card in Suite)

| Category | Event types |
| --- | --- |
| **DFARS cyber** | `dfars-72-hour-cyber-incident` |
| **CUI handling** | `cui-spillage-detected` · `cui-marking-failure` · `cui-mishandling-on-unauthorized-system` |
| **Export control** | `itar-deemed-export-violation` · `itar-license-mismatch` · `ear-license-mismatch` · `ear-entity-list-screening-failure` |
| **Foreign-person** | `foreign-person-unauthorized-access` · `foreign-person-access-attempt-blocked` |
| **Classified** | `classified-environment-ai-misuse` · `scif-policy-violation-detected` · `ai-generated-classified-marking-error` |
| **Personnel** | `nispom-insider-threat-flag` · `personnel-clearance-status-change-mishandling` |
| **CMMC** | `cmmc-l2-l3-readiness-gap-discovered` · `cmmc-poam-open-finding-related-failure` · `sprs-self-assessment-discrepancy` |
| **AI-supply-chain** | `ai-tool-supply-chain-compromise-detected` · `ai-tool-update-introduced-non-conformance` |
| **AI-output** | `ai-output-on-unverified-us-person-system` · `third-party-shared-responsibility-incident` |

## Three invariants enforced

1. **DFARS 72-hour clock invariant** — `event_type = dfars-72-hour-cyber-incident` MUST include `dfars_72_hour_report_filed.filed_at`, and `filed_at` must be within **72 hours** of `discovered_at`. Mirrors the audit-stream invariant — but enforced at the **published Incident Card** level so external regulators reading the card can verify the clock without diving into the audit-stream.
2. **Export-control basis invariant** — ITAR event types must cite `itar-22-cfr-120-130`, EAR event types must cite `ear-15-cfr-730-774`. Prevents miscategorized export-control incidents from being filed under the wrong regime.
3. **Distribution-statement obligation invariant** — CUI-Specified+ affected data on S1-catastrophic or S2-critical severity MUST cite `dodi-5230-24-distribution-statements`. The distribution-statement obligation under DoDI 5230.24 doesn't lapse during incident response.

## Canonical example

`STRATOS-INC-2026-DFARS-0011` — Stratos Aerospace CUI spillage event detected by VendorD GuardianAI v3.x, filed via dibnet.dod.mil within the 72-hour window, FSO notified, 5 response actions (3 completed, 1 in-progress, 1 open). Cross-references audit-stream event `0190dt-0005`.

## Verify

```bash
npm install
npm run build:examples
npm run validate
npm test                # 8 unit tests
```

## Composes with

- [`defense-decision-record-audit-stream`](https://github.com/mizcausevic-dev/defense-decision-record-audit-stream) — `audit_stream_event_refs` links back to source events
- [`cmmc-l2-l3-readiness-evidence-bundle`](https://github.com/mizcausevic-dev/cmmc-l2-l3-readiness-evidence-bundle) — `cyber-incident-72-hour-report-copy` evidence kind ingests this Incident Card
- [`cui-data-vault-contract-profile`](https://github.com/mizcausevic-dev/cui-data-vault-contract-profile) — vault contract whose violation triggered the incident
- [`dod-cmmc-disclosure-tracker`](https://github.com/mizcausevic-dev/dod-cmmc-disclosure-tracker) — context on which authority receives which disclosure
- [`defense-contractor-bias-coverage-lab`](https://github.com/mizcausevic-dev/defense-contractor-bias-coverage-lab) — bias `exceeds-threshold` outcomes become Incident Cards here
- [Kinetic Gain Protocol Suite](https://suite.kineticgain.com) — umbrella

## Compliance posture

Incident Card **readiness scaffolding**. Does NOT substitute for the actual DFARS 7012 cyber-incident report (which must be filed via dibnet.dod.mil under the contractor's DoD-approved Medium Assurance Certificate), DDTC / BIS voluntary disclosures (which have their own filing requirements), or NISPOM-required FSO notifications. Per the standing Suite public-language guardrail: *readiness · evidence · posture · controls · scaffolding* — never "compliant" / "certified" without externally-attested certification.

## License

MIT.
