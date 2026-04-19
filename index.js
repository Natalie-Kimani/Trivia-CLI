const readline = require("readline");

// 📦 Quiz questions
const questions = [
  {
    question: "What keyword declares a block-scoped variable in JavaScript?",
    options: ["var", "let", "define", "set"],
    answer: "let"
  },
  {
    question: "Which method adds an element to the end of an array?",
    options: ["push()", "pop()", "shift()", "unshift()"],
    answer: "push()"
  },
  {
    question: "What does DOM stand for?",
    options: ["Document Object Model", "Data Object Manager", "Display Output Method", "Dynamic Object Model"],
    answer: "Document Object Model"
  },
  {
    question: "Which symbol is used for single-line comments?",
    options: ["//", "/*", "#", "--"],
    answer: "//"
  },
  {
    question: "What does === check in JavaScript?",
    options: ["Value only", "Type only", "Value and type", "Neither"],
    answer: "Value and type"
  }
];

// 🧾 Create input/output interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// helper: ask question
function askQuestion(questionText) {
  return new Promise((resolve) => {
    rl.question(questionText, (answer) => {
      resolve(answer);
    });
  });
}

// helper: wait
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 🎮 Show one question
async function showQuestion(q, index) {
  console.log("\n----------------------------");
  console.log("Question " + (index + 1));
  console.log("----------------------------");

  console.log(q.question);

  // show options
  for (let i = 0; i < q.options.length; i++) {
    const letter = String.fromCharCode(65 + i); // A, B, C, D
    console.log(letter + ") " + q.options[i]);
  }

  // get user answer
  let userAnswer = "";

  while (true) {
    const input = await askQuestion("Your answer (A/B/C/D): ");
    const index = input.toUpperCase().charCodeAt(0) - 65;

    if (index >= 0 && index < q.options.length) {
      userAnswer = q.options[index];
      break;
    } else {
      console.log("Please enter A, B, C, or D.");
    }
  }

  // check answer
  if (userAnswer === q.answer) {
    console.log("Correct!");
    return true;
  } else {
    console.log("Wrong! Correct answer is: " + q.answer);
    return false;
  }
}

// 🎯 Start game
async function startGame() {
  console.log("\nWELCOME TO THE TRIVIA GAME!");

  const name = await askQuestion("Enter your name: ");
  console.log("Hello " + name + "! Let's start...\n");

  await wait(2000);

  let score = 0;
  const startTime = Date.now();

  // loop through questions
  for (let i = 0; i < questions.length; i++) {
    const correct = await showQuestion(questions[i], i);

    if (correct) {
      score++;
    }

    await wait(1000);
  }

  // end game
  const endTime = Date.now();
  const timeTaken = Math.floor((endTime - startTime) / 1000);

  console.log("\nGAME OVER!");
  console.log("Score: " + score + "/" + questions.length);
  console.log("Time: " + timeTaken + " seconds");

  if (score === questions.length) {
    console.log("Perfect score! 🎉");
  } else if (score >= 3) {
    console.log("Good job!");
  } else {
    console.log("Keep practicing!");
  }

  // play again
  const again = await askQuestion("\nPlay again? (y/n): ");

  if (again.toLowerCase() === "y") {
    startGame();
  } else {
    console.log("Thanks for playing!");
    rl.close();
  }
}

// 🚀 run game
startGame();