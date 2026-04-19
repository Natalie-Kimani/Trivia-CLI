const readline = require("readline");

const questions = [
  { question: "What keyword declares a block-scoped variable in JavaScript?", options: ["var", "let", "define", "set"], answer: "let" },
  { question: "Which method adds an element to the end of an array?", options: ["push()", "pop()", "shift()", "unshift()"], answer: "push()" },
  { question: "What does 'DOM' stand for?", options: ["Document Object Model", "Data Object Manager", "Display Output Method", "Dynamic Object Model"], answer: "Document Object Model" },
  { question: "Which symbol is used for single-line comments in JavaScript?", options: ["//", "/*", "#", "--"], answer: "//" },
  { question: "What does the '===' operator check?", options: ["Value only", "Type only", "Value and type", "Neither"], answer: "Value and type" },
];

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((resolve) => rl.question(q, resolve));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const formatTime = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

async function displayQuestion(q, index, total) {
  console.log(`\n─────────────────────────────────────`);
  console.log(`Question ${index + 1} of ${total}`);
  console.log(`─────────────────────────────────────`);
  console.log(`\n❓  ${q.question}\n`);
  q.options.map((opt, i) => `  ${String.fromCharCode(65+i)}) ${opt}`).forEach(l => console.log(l));
  console.log();
  let userAnswer = "";
  while (true) {
    const input = await ask("Your answer (A/B/C/D): ");
    const idx = input.trim().toUpperCase().charCodeAt(0) - 65;
    if (idx >= 0 && idx < q.options.length) { userAnswer = q.options[idx]; break; }
    else console.log("⚠️  Invalid input. Please enter A, B, C, or D.");
  }
  const correct = userAnswer === q.answer;
  console.log(correct ? "\n✅  Correct!\n" : `\n❌  Wrong! The correct answer was: ${q.answer}\n`);
  await sleep(1000);
  return correct;
}

function gameOverFeedback(score, total, elapsed) {
  const pct = Math.round((score/total)*100);
  console.log(`\n═════════════════════════════════════`);
  console.log(`           🎉 GAME OVER 🎉`);
  console.log(`═════════════════════════════════════`);
  console.log(`  Score : ${score} / ${total} (${pct}%)`);
  console.log(`  Time  : ${formatTime(elapsed)}`);
  console.log(`─────────────────────────────────────`);
  if (pct === 100) console.log(`  🏆 Perfect score!`);
  else if (pct >= 80) console.log(`  🌟 Great job!`);
  else if (pct >= 60) console.log(`  👍 Good effort!`);
  else console.log(`  📚 Keep studying!`);
  console.log(`═════════════════════════════════════\n`);
}

async function startGame() {
  console.log(`\n╔═════════════════════════════════════╗`);
  console.log(`║       🧠 JS TRIVIA CHALLENGE 🧠      ║`);
  console.log(`╚═════════════════════════════════════╝`);
  const name = await ask("\nEnter your name: ");
  console.log(`\nGood luck, ${name.trim()}! Starting in 3 seconds...\n`);
  await sleep(3000);
  let score = 0;
  const startTime = Date.now();
  for (let i = 0; i < questions.length; i++) {
    if (await displayQuestion(questions[i], i, questions.length)) score++;
  }
  gameOverFeedback(score, questions.length, Math.floor((Date.now()-startTime)/1000));
  const again = await ask("Play again? (y/n): ");
  if (again.trim().toLowerCase() === "y") await startGame();
  else { console.log(`\nThanks for playing! Goodbye! 👋\n`); rl.close(); }
}

startGame().catch(err => { console.error(err); rl.close(); });
