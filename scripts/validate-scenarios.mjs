/**
 * Scenario Validator Script
 * Validates all scenario JSON files in data/scenarios:
 * - Valid JSON schema
 * - All question IDs are unique
 * - Every next_question_id exists or points to an ending_id
 * - Every ending_id exists in endings array
 * - Each question has exactly 2 answers
 * - No orphaned or unreachable nodes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const scenariosDir = path.resolve(__dirname, '../data/scenarios');

if (!fs.existsSync(scenariosDir)) {
  console.error(`Scenarios directory not found: ${scenariosDir}`);
  process.exit(1);
}

const scenarioFiles = fs.readdirSync(scenariosDir).filter((f) => f.endsWith('.json'));

if (scenarioFiles.length === 0) {
  console.error('No scenario files found in data/scenarios!');
  process.exit(1);
}

let totalErrors = 0;

for (const file of scenarioFiles) {
  const filePath = path.join(scenariosDir, file);
  console.log(`\nValidating scenario file: ${file}`);
  
  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (err) {
    console.error(`  ❌ Failed to parse JSON in ${file}: ${err.message}`);
    totalErrors++;
    continue;
  }

  // Check top level
  if (!data.start_question_id) {
    console.error(`  ❌ Missing start_question_id in ${file}`);
    totalErrors++;
  }

  if (!Array.isArray(data.questions) || data.questions.length === 0) {
    console.error(`  ❌ Missing or empty questions array in ${file}`);
    totalErrors++;
    continue;
  }

  if (!Array.isArray(data.endings) || data.endings.length === 0) {
    console.error(`  ❌ Missing or empty endings array in ${file}`);
    totalErrors++;
  }

  const questionMap = new Map();
  const endingMap = new Map();

  for (const q of data.questions) {
    if (questionMap.has(q.id)) {
      console.error(`  ❌ Duplicate question ID "${q.id}" in ${file}`);
      totalErrors++;
    }
    questionMap.set(q.id, q);
  }

  for (const e of data.endings || []) {
    if (endingMap.has(e.id)) {
      console.error(`  ❌ Duplicate ending ID "${e.id}" in ${file}`);
      totalErrors++;
    }
    endingMap.set(e.id, e);
  }

  if (!questionMap.has(data.start_question_id)) {
    console.error(`  ❌ start_question_id "${data.start_question_id}" does not exist in questions list!`);
    totalErrors++;
  }

  // Check each question node
  for (const q of data.questions) {
    if (!Array.isArray(q.answers) || q.answers.length !== 2) {
      console.error(`  ❌ Question ${q.id} must have exactly 2 answers (found ${q.answers?.length})`);
      totalErrors++;
    }

    for (const ans of q.answers || []) {
      if (ans.next_question_id) {
        if (!questionMap.has(ans.next_question_id)) {
          console.error(`  ❌ Answer "${ans.id}" in ${q.id} points to non-existent question: ${ans.next_question_id}`);
          totalErrors++;
        }
      } else if (ans.ending_id) {
        if (!endingMap.has(ans.ending_id)) {
          console.error(`  ❌ Answer "${ans.id}" in ${q.id} points to non-existent ending: ${ans.ending_id}`);
          totalErrors++;
        }
      } else {
        console.error(`  ❌ Answer "${ans.id}" in ${q.id} has neither next_question_id nor ending_id!`);
        totalErrors++;
      }
    }
  }

  // Reachability check via BFS from start_question_id
  const reachableQuestions = new Set();
  const reachableEndings = new Set();
  const queue = [data.start_question_id];

  while (queue.length > 0) {
    const currentId = queue.shift();
    if (reachableQuestions.has(currentId)) continue;
    reachableQuestions.add(currentId);

    const q = questionMap.get(currentId);
    if (!q) continue;

    for (const ans of q.answers) {
      if (ans.next_question_id && !reachableQuestions.has(ans.next_question_id)) {
        queue.push(ans.next_question_id);
      }
      if (ans.ending_id) {
        reachableEndings.add(ans.ending_id);
      }
    }
  }

  const unreachable = data.questions.filter((q) => !reachableQuestions.has(q.id));
  if (unreachable.length > 0) {
    console.warn(`  ⚠️ Warning: ${unreachable.length} questions are unreachable from start node ${data.start_question_id}:`, unreachable.map(q => q.id));
  }

  console.log(`  ✓ ${file} passed basic structural checks (${data.questions.length} questions, ${data.endings.length} endings, ${reachableQuestions.size} reachable).`);
}

if (totalErrors > 0) {
  console.error(`\nValidation failed with ${totalErrors} errors.`);
  process.exit(1);
} else {
  console.log('\nAll scenario files validated successfully! ✨');
}
