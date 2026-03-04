#!/usr/bin/env node
/**
 * generate-context.mjs — Genera "contexto público" con IA para cada candidato.
 *
 * Para educación y legal, pregunta a OpenAI si hay información pública
 * notable que complemente lo declarado ante el JNE.
 *
 * Prerequisito: dev server corriendo en localhost:3000
 * Uso: node scripts/generate-context.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = "http://localhost:3000";
const CANDIDATES_FILE = path.resolve(__dirname, "../src/data/candidates.ts");

function log(emoji, msg) {
  console.log(`${emoji}  ${msg}`);
}

async function main() {
  console.log("\n╔══════════════════════════════════════════════╗");
  console.log("║   generate-context.mjs — Contexto público IA ║");
  console.log("╚══════════════════════════════════════════════╝\n");

  // ── Step 1: Parse candidates.ts ──────────────────────────────
  log("📄", "Leyendo candidates.ts...");
  const fileContent = fs.readFileSync(CANDIDATES_FILE, "utf-8");

  const lineMarker = "export const candidates: Candidate[] = [";
  const lineIdx = fileContent.indexOf(lineMarker);
  if (lineIdx === -1) throw new Error("No encontré el array de candidatos");

  const bracketStart = lineIdx + lineMarker.length - 1;
  let depth = 0, bracketEnd = -1;
  for (let i = bracketStart; i < fileContent.length; i++) {
    if (fileContent[i] === "[") depth++;
    else if (fileContent[i] === "]") {
      depth--;
      if (depth === 0) { bracketEnd = i + 1; break; }
    }
  }
  if (bracketEnd === -1) throw new Error("No encontré el cierre del array");

  const header = fileContent.substring(0, lineIdx);
  const jsonStr = fileContent.substring(bracketStart, bracketEnd);
  const semiIdx = fileContent.indexOf(";", bracketEnd - 1);
  const footer = semiIdx >= 0 ? fileContent.substring(semiIdx + 1) : "";

  let candidates;
  try {
    candidates = JSON.parse(jsonStr);
  } catch (e) {
    throw new Error(`Error parseando JSON: ${e.message}`);
  }

  log("✅", `${candidates.length} candidatos parseados`);

  // ── Step 2: Generate context for education and legal ─────────
  const pillars = ["education", "legal"];
  let generated = 0;
  let skipped = 0;
  let nullCount = 0;

  for (const candidate of candidates) {
    for (const pillar of pillars) {
      // Skip if context already exists
      if (candidate[pillar].context) {
        skipped++;
        continue;
      }

      log("🤖", `${candidate.name} / ${pillar}...`);

      try {
        const res = await fetch(`${BASE_URL}/api/ai-context`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            candidateName: candidate.name,
            candidateParty: candidate.party,
            pillar,
            currentExplanation: candidate[pillar].explanation,
          }),
        });

        if (!res.ok) {
          log("⚠️ ", `  Error HTTP ${res.status}`);
          continue;
        }

        const data = await res.json();

        if (data.context) {
          candidate[pillar].context = data.context;
          generated++;
          log("📝", `  → ${data.context}`);
        } else {
          nullCount++;
          log("  ", `  → (sin contexto notable)`);
        }
      } catch (err) {
        log("⚠️ ", `  Error: ${err.message}`);
      }

      // Rate limit: 200ms between calls
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  log("📊", `Generados: ${generated}, Sin contexto: ${nullCount}, Ya existían: ${skipped}`);

  if (generated === 0) {
    log("ℹ️ ", "No se generó nuevo contexto. Archivo sin cambios.");
    return;
  }

  // ── Step 3: Write back ────────────────────────────────────────
  log("💾", "Escribiendo candidates.ts...");
  const newJson = JSON.stringify(candidates, null, 2);
  const newContent = header + "export const candidates: Candidate[] = " + newJson + ";" + footer;

  // Safety checks
  if (!newContent.includes("export const candidates: Candidate[] = [")) {
    throw new Error("SAFETY CHECK FAILED: missing candidates array");
  }
  if (!newContent.includes("export function searchCandidates")) {
    throw new Error("SAFETY CHECK FAILED: missing searchCandidates function");
  }

  // Verify JSON roundtrip
  const verifyStart = newContent.indexOf("export const candidates: Candidate[] = ") + "export const candidates: Candidate[] = ".length;
  const verifyJson = newContent.substring(verifyStart);
  const vBracket = verifyJson.indexOf("[");
  let vDepth = 0, vEnd = -1;
  for (let i = vBracket; i < verifyJson.length; i++) {
    if (verifyJson[i] === "[") vDepth++;
    else if (verifyJson[i] === "]") { vDepth--; if (vDepth === 0) { vEnd = i + 1; break; } }
  }
  const verifyArr = JSON.parse(verifyJson.substring(vBracket, vEnd));
  if (verifyArr.length !== candidates.length) {
    throw new Error(`SAFETY CHECK FAILED: expected ${candidates.length}, got ${verifyArr.length}`);
  }

  fs.writeFileSync(CANDIDATES_FILE, newContent, "utf-8");
  log("✅", `Escrito (${generated} contextos nuevos)`);

  console.log("\n╔══════════════════════════════════════════════╗");
  console.log(`║   ${String(generated).padStart(2)} contextos generados                     ║`);
  console.log(`║   ${String(nullCount).padStart(2)} sin contexto notable                    ║`);
  console.log("╚══════════════════════════════════════════════╝\n");
}

main().catch((err) => {
  console.error(`\n❌ Error fatal: ${err.message}`);
  process.exit(1);
});
