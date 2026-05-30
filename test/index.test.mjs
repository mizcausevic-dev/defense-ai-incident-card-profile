import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { EVENT_TYPES, SEVERITIES, summarize } from "../src/index.mjs";
import { validate } from "../src/validate.mjs";

const card = JSON.parse(readFileSync(new URL("../examples/stratos-incident-card-cui-spillage-2026q4.json", import.meta.url), "utf8"));

test("22 event types — largest Incident Card profile in Suite", () => assert.equal(EVENT_TYPES.length, 22));
test("5 severities", () => assert.equal(SEVERITIES.length, 5));
test("example validates", () => {
  const r = validate(card);
  assert.ok(r.ok, JSON.stringify(r.errors, null, 2));
});
test("summarize roundtrips key fields", () => {
  const s = summarize(card);
  assert.equal(s.event_type, "dfars-72-hour-cyber-incident");
  assert.equal(s.cui, "CUI-SPECIFIED-NOFORN");
  assert.equal(s.export_control, "ITAR");
  assert.equal(s.dibnet_filed, true);
});
test("invariant#1: missing dfars_72_hour_report on cyber-incident fails", () => {
  const bad = JSON.parse(JSON.stringify(card));
  delete bad.dfars_72_hour_report_filed;
  const r = validate(bad);
  assert.ok(!r.ok);
  assert.ok(r.errors.some((e) => e.includes("invariant#1")));
});
test("invariant#1: filed after 72h fails", () => {
  const bad = JSON.parse(JSON.stringify(card));
  bad.dfars_72_hour_report_filed.filed_at = "2026-11-10T18:00:00Z";  // ~6 days after discovered_at
  const r = validate(bad);
  assert.ok(!r.ok);
  assert.ok(r.errors.some((e) => e.includes("invariant#1") && e.includes("72-hour clock missed")));
});
test("invariant#2: ITAR event type without ITAR basis fails", () => {
  const bad = JSON.parse(JSON.stringify(card));
  bad.event_type = "itar-deemed-export-violation";
  bad.regulatory_basis = bad.regulatory_basis.filter((b) => b !== "itar-22-cfr-120-130");
  const r = validate(bad);
  assert.ok(!r.ok);
  assert.ok(r.errors.some((e) => e.includes("invariant#2")));
});
test("invariant#3: CUI-Specified+ S1/S2 without dodi-5230-24 fails", () => {
  const bad = JSON.parse(JSON.stringify(card));
  bad.regulatory_basis = bad.regulatory_basis.filter((b) => b !== "dodi-5230-24-distribution-statements");
  const r = validate(bad);
  assert.ok(!r.ok);
  assert.ok(r.errors.some((e) => e.includes("invariant#3")));
});
