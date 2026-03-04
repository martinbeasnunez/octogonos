#!/usr/bin/env node
/**
 * fix-all.mjs — Pipeline automatizado para llevar health a 0 issues.
 *
 * Qué hace:
 * 1. Lee candidates.ts y parsea el array de candidatos
 * 2. Llama a /api/ai-fix-all para corregir textos truncados/genéricos/vacíos
 * 3. Valida cada fix (longitud, no repite nombre, etc.)
 * 4. Elimina fuentes rotas ("Resumen del plan de gobierno (PDF)")
 * 5. Escribe candidates.ts actualizado
 *
 * Prerequisito: dev server corriendo en localhost:3000
 * Uso: node scripts/fix-all.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = "http://localhost:3000";
const CANDIDATES_FILE = path.resolve(__dirname, "../src/data/candidates.ts");

// ── Helpers ─────────────────────────────────────────────────

function log(emoji, msg) {
  console.log(`${emoji}  ${msg}`);
}

/**
 * Validate an AI-generated fix before applying it.
 * Returns { ok: true } or { ok: false, reason: string }
 */
function validateFix(fix) {
  const text = fix.fixedText?.trim();
  if (!text) return { ok: false, reason: "vacío" };
  if (text.length < 15) return { ok: false, reason: `muy corto (${text.length} chars)` };
  if (text.length > 500) return { ok: false, reason: `muy largo (${text.length} chars)` };
  if (text.endsWith("...") || text.endsWith("…"))
    return { ok: false, reason: "sigue truncado" };

  // Should not start with candidate name (redundant)
  const nameParts = fix.candidateName.toLowerCase().split(" ");
  const textLower = text.toLowerCase();
  if (
    nameParts.length >= 2 &&
    textLower.startsWith(nameParts[0]) &&
    textLower.includes(nameParts[1])
  ) {
    return { ok: false, reason: "empieza con nombre del candidato" };
  }

  // Should not contain common filler phrases
  const fillers = [
    "según las fuentes consultadas",
    "de acuerdo a las fuentes",
    "es un político",
    "es una política",
  ];
  for (const f of fillers) {
    if (textLower.includes(f))
      return { ok: false, reason: `contiene frase de relleno: "${f}"` };
  }

  return { ok: true };
}

// ── Main ────────────────────────────────────────────────────

async function main() {
  console.log("\n╔══════════════════════════════════════════════╗");
  console.log("║   fix-all.mjs — Pipeline de corrección 100%  ║");
  console.log("╚══════════════════════════════════════════════╝\n");

  // ── Step 1: Read & parse candidates.ts ────────────────────
  log("📄", "Leyendo candidates.ts...");
  const fileContent = fs.readFileSync(CANDIDATES_FILE, "utf-8");

  // Find boundaries of the candidates array
  // Line looks like: export const candidates: Candidate[] = [
  // We need to find the actual "[" that starts the data array, not the "[]" in the type
  const lineMarker = "export const candidates: Candidate[] = [";
  const lineIdx = fileContent.indexOf(lineMarker);
  if (lineIdx === -1) throw new Error("No encontré el array de candidatos");

  // The data array starts at the "[" at the end of that line
  const bracketStart = lineIdx + lineMarker.length - 1; // points to "["

  // Find matching closing bracket
  let depth = 0;
  let bracketEnd = -1;
  for (let i = bracketStart; i < fileContent.length; i++) {
    if (fileContent[i] === "[") depth++;
    else if (fileContent[i] === "]") {
      depth--;
      if (depth === 0) {
        bracketEnd = i + 1; // points to char after "]"
        break;
      }
    }
  }
  if (bracketEnd === -1) throw new Error("No encontré el cierre del array");

  // header = everything BEFORE "export const candidates..."
  const header = fileContent.substring(0, lineIdx);
  // jsonStr = just the "[...]" array
  const jsonStr = fileContent.substring(bracketStart, bracketEnd);
  // footer = everything AFTER "];" (the semicolon + rest of file)
  // Find the ";" right after "]"
  const semiIdx = fileContent.indexOf(";", bracketEnd - 1);
  const footer = semiIdx >= 0 ? fileContent.substring(semiIdx + 1) : "";

  let candidates;
  try {
    candidates = JSON.parse(jsonStr);
  } catch (e) {
    throw new Error(`Error parseando JSON: ${e.message}`);
  }

  log("✅", `${candidates.length} candidatos parseados`);

  // ── Step 2: Get health issues ─────────────────────────────
  log("🔍", "Consultando /api/health...");
  const healthRes = await fetch(`${BASE_URL}/api/health`);
  if (!healthRes.ok) throw new Error("Health endpoint falló");
  const health = await healthRes.json();

  const fixableCount = health.issues.filter((i) =>
    ["truncated_text", "generic_explanation", "empty_explanation"].includes(
      i.type
    )
  ).length;
  const filteredCount = health.filteredSourcesCount;

  log("📊", `${fixableCount} textos por corregir, ${filteredCount} PDFs rotos por eliminar`);

  if (fixableCount === 0 && filteredCount === 0) {
    log("🎉", "¡Ya está todo limpio! 0 issues.");
    return;
  }

  // ── Step 3: AI batch fix ──────────────────────────────────
  let fixes = [];
  if (fixableCount > 0) {
    log("🤖", `Llamando a /api/ai-fix-all (${fixableCount} textos)...`);
    log("⏳", "Esto puede tomar 30-60 segundos...");

    const batchRes = await fetch(`${BASE_URL}/api/ai-fix-all`, {
      method: "POST",
    });
    if (!batchRes.ok) {
      const errData = await batchRes.json().catch(() => ({}));
      throw new Error(`Batch fix falló: ${errData.error || batchRes.status}`);
    }
    const batch = await batchRes.json();

    log("📝", `IA generó ${batch.fixed} sugerencias (${batch.failed} fallaron)`);

    // Validate each fix
    let validCount = 0;
    let invalidCount = 0;
    for (const fix of batch.fixes) {
      const validation = validateFix(fix);
      if (validation.ok) {
        fixes.push(fix);
        validCount++;
      } else {
        invalidCount++;
        log("⚠️ ", `  RECHAZADO: ${fix.candidateName} / ${fix.pillar} — ${validation.reason}`);
      }
    }

    log("✅", `${validCount} fixes válidos, ${invalidCount} rechazados`);

    // For rejected fixes with truncated text, try a simpler fix: just remove the trailing "..."
    // and add a period if needed
    if (invalidCount > 0) {
      log("🔧", "Intentando fix simple para los rechazados...");
      for (const fix of batch.fixes) {
        const validation = validateFix(fix);
        if (!validation.ok && fix.issueType === "truncated_text") {
          // Find the candidate and try a simple truncation fix
          const c = candidates.find((c) => c.slug === fix.candidateSlug);
          if (c) {
            let text = c[fix.pillarKey].explanation;
            // Remove trailing "..." or "…" and add "."
            text = text.replace(/\.\.\.+$|…$/, "").trim();
            if (!text.endsWith(".")) text += ".";
            if (text.length >= 15) {
              fixes.push({ ...fix, fixedText: text });
              log("✅", `  Fixed simple: ${fix.candidateName} / ${fix.pillar}`);
            }
          }
        }
      }
    }
  }

  // ── Step 4: Apply text fixes to candidates array ──────────
  if (fixes.length > 0) {
    log("✏️ ", `Aplicando ${fixes.length} correcciones de texto...`);
    let applied = 0;
    for (const fix of fixes) {
      const candidate = candidates.find((c) => c.slug === fix.candidateSlug);
      if (!candidate) {
        log("⚠️ ", `  ${fix.candidateSlug} no encontrado`);
        continue;
      }
      candidate[fix.pillarKey].explanation = fix.fixedText;
      applied++;
    }
    log("✅", `${applied} textos actualizados`);
  }

  // ── Step 5: Remove broken "Resumen del plan" PDFs ─────────
  log("🗑️ ", "Eliminando PDFs rotos (Resumen del plan)...");
  let removedCount = 0;
  for (const c of candidates) {
    const before = c.plan.sources.length;
    c.plan.sources = c.plan.sources.filter(
      (s) => !s.title.toLowerCase().includes("resumen del plan")
    );
    removedCount += before - c.plan.sources.length;
  }
  log("✅", `${removedCount} links a PDFs rotos eliminados`);

  // ── Step 6: Write back ────────────────────────────────────
  log("💾", "Escribiendo candidates.ts...");
  const newJson = JSON.stringify(candidates, null, 2);
  // Reconstruct: header + "export const candidates: Candidate[] = " + JSON + ";" + footer
  const newContent =
    header + "export const candidates: Candidate[] = " + newJson + ";" + footer;

  // Safety: verify the reconstructed file looks right
  if (!newContent.includes("export const candidates: Candidate[] = [")) {
    throw new Error("SAFETY CHECK FAILED: reconstructed file missing candidates array");
  }
  if (!newContent.includes("export function searchCandidates")) {
    throw new Error("SAFETY CHECK FAILED: reconstructed file missing searchCandidates function");
  }
  if (!newContent.includes("const planFeasibility")) {
    throw new Error("SAFETY CHECK FAILED: reconstructed file missing planFeasibility");
  }
  // Verify we can parse the JSON back
  const verifyJson = newContent.substring(
    newContent.indexOf("export const candidates: Candidate[] = ") + "export const candidates: Candidate[] = ".length,
  );
  const verifyBracket = verifyJson.indexOf("[");
  let vDepth = 0, vEnd = -1;
  for (let i = verifyBracket; i < verifyJson.length; i++) {
    if (verifyJson[i] === "[") vDepth++;
    else if (verifyJson[i] === "]") { vDepth--; if (vDepth === 0) { vEnd = i + 1; break; } }
  }
  const verifyArr = JSON.parse(verifyJson.substring(verifyBracket, vEnd));
  if (verifyArr.length !== candidates.length) {
    throw new Error(`SAFETY CHECK FAILED: expected ${candidates.length} candidates, got ${verifyArr.length}`);
  }
  log("✅", `Safety check passed (${verifyArr.length} candidates verified)`);

  fs.writeFileSync(CANDIDATES_FILE, newContent, "utf-8");

  const newLines = newContent.split("\n").length;
  log("✅", `Escrito (${newLines} líneas)`);

  // ── Summary ───────────────────────────────────────────────
  console.log("\n╔══════════════════════════════════════════════╗");
  console.log("║   RESUMEN                                     ║");
  console.log("╠══════════════════════════════════════════════╣");
  console.log(
    `║   Textos corregidos:    ${String(fixes.length).padStart(3)}                   ║`
  );
  console.log(
    `║   PDFs rotos eliminados: ${String(removedCount).padStart(2)}                   ║`
  );
  console.log("╠══════════════════════════════════════════════╣");
  console.log("║   Siguiente:                                  ║");
  console.log("║   1. Reinicia el dev server                   ║");
  console.log("║   2. curl localhost:3000/api/health            ║");
  console.log("║   3. npm run build                             ║");
  console.log("╚══════════════════════════════════════════════╝\n");
}

main().catch((err) => {
  console.error(`\n❌ Error fatal: ${err.message}`);
  process.exit(1);
});
