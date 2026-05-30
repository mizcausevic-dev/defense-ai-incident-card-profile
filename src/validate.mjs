import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const HERE = dirname(fileURLToPath(import.meta.url));
const SCHEMA = JSON.parse(readFileSync(resolve(HERE, "../schema/incident-card.schema.json"), "utf8"));

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const compiled = ajv.compile(SCHEMA);

const SEVENTY_TWO_HOURS_MS = 72 * 60 * 60 * 1000;

export function validate(card) {
  const errors = [];
  if (!compiled(card)) {
    for (const e of compiled.errors) errors.push(`schema: ${e.instancePath} ${e.message}`);
    return { ok: false, errors };
  }
  // Invariant#1: DFARS 72-hour cyber-incident type requires dfars_72_hour_report_filed with filed_at within 72h of discovered_at.
  if (card.event_type === "dfars-72-hour-cyber-incident") {
    if (!card.dfars_72_hour_report_filed || !card.dfars_72_hour_report_filed.filed_at) {
      errors.push("invariant#1: event_type=dfars-72-hour-cyber-incident requires dfars_72_hour_report_filed.filed_at");
    } else {
      const discovered = new Date(card.discovered_at).getTime();
      const filed = new Date(card.dfars_72_hour_report_filed.filed_at).getTime();
      if (filed - discovered > SEVENTY_TWO_HOURS_MS) {
        errors.push(`invariant#1: DFARS 72-hour clock missed — filed ${Math.round((filed - discovered) / 3600000)}h after discovery (limit 72h)`);
      }
    }
  }
  // Invariant#2: ITAR-related event_types MUST cite itar-22-cfr-120-130 (and ear-related must cite ear-15-cfr-730-774).
  const itarTypes = ["itar-deemed-export-violation", "itar-license-mismatch"];
  if (itarTypes.includes(card.event_type) && !card.regulatory_basis.includes("itar-22-cfr-120-130")) {
    errors.push(`invariant#2: event_type=${card.event_type} MUST cite itar-22-cfr-120-130 in regulatory_basis`);
  }
  const earTypes = ["ear-license-mismatch", "ear-entity-list-screening-failure"];
  if (earTypes.includes(card.event_type) && !card.regulatory_basis.includes("ear-15-cfr-730-774")) {
    errors.push(`invariant#2: event_type=${card.event_type} MUST cite ear-15-cfr-730-774 in regulatory_basis`);
  }
  // Invariant#3: CUI-Specified+ affected_data on S1/S2 severity requires dodi-5230-24 in regulatory_basis (distribution-statement obligation).
  const isSpecifiedOrHigher = !["PUBLIC", "CUI-BASIC"].includes(card.affected_data.cui_categorization);
  const isHighSeverity = ["S1-catastrophic", "S2-critical"].includes(card.severity);
  if (isSpecifiedOrHigher && isHighSeverity && !card.regulatory_basis.includes("dodi-5230-24-distribution-statements")) {
    errors.push("invariant#3: CUI-Specified+ affected data on S1/S2 severity MUST cite dodi-5230-24-distribution-statements (distribution-statement obligation persists through incident response)");
  }
  return { ok: errors.length === 0, errors };
}

const argv1 = (process.argv[1] ?? "").replace(/\\/g, "/");
if (import.meta.url.endsWith("/validate.mjs") && argv1.endsWith("validate.mjs")) {
  const file = process.argv[2] ?? "examples/stratos-incident-card-cui-spillage-2026q4.json";
  const path = resolve(process.cwd(), file);
  const card = JSON.parse(readFileSync(path, "utf8"));
  const result = validate(card);
  if (!result.ok) {
    for (const e of result.errors) console.error("✗", e);
    console.error(`\nFAIL · ${result.errors.length} error(s)`);
    process.exit(1);
  }
  console.log(`OK · ${card.incident_id} · schema ✓ · 3 invariants ✓`);
}
