
import React, { useEffect, useState } from "react";

const levels = [
  { name: "Basic", total: 200, topics: 10, color: "emerald" },
  { name: "Intermediate", total: 200, topics: 10, color: "amber" },
  { name: "Advanced", total: 200, topics: 10, color: "rose" }
];

const topics = [
  [
    "Version Control", "Git Fundamentals", "Git vs GitHub",
    "Repository Basics", "Git Configuration", "Staging Area",
    "Commit Basics", "Branching Basics", "Remote Basics",
    "GitHub Fundamentals"
  ],
  [
    "Branch Management", "Merge Strategies", "Merge Conflicts",
    "Rebase Concepts", "Reset & Revert", "Git Stash",
    "Remote Synchronization", "Pull Requests",
    "Issues & Collaboration", "Team Workflows"
  ],
  [
    "Advanced Branching", "Advanced Merge & Rebase",
    "Cherry-pick", "Git History", "Tags & Releases",
    "Git Internals", "Recovery & Troubleshooting",
    "GitHub Collaboration", "Security & Access",
    "Repository Best Practices"
  ]
];

// Starter question bank: add verified questions to reach 600.
const questionBank = [
  {
    id: "B001",
    level: 0,
    topic: 0,
    question: "What is Git primarily used for?",
    options: [
      "Version control",
      "Image editing",
      "Database hosting",
      "Web browsing"
    ],
    answer: 0,
    explanation:
      "Git is a distributed version control system used to track changes."
  },
  {
    id: "B002",
    level: 0,
    topic: 1,
    question: "Which statement best describes Git?",
    options: [
      "A version control system",
      "A programming language",
      "A database engine",
      "An operating system"
    ],
    answer: 0,
    explanation:
      "Git manages project history and tracks changes across versions."
  },
  {
    id: "B003",
    level: 0,
    topic: 2,
    question: "What is GitHub?",
    options: [
      "A platform for hosting Git repositories",
      "A programming language",
      "A Linux distribution",
      "A database server"
    ],
    answer: 0,
    explanation:
      "GitHub hosts Git repositories and provides collaboration features."
  },
  {
    id: "B004",
    level: 0,
    topic: 6,
    question: "What does a commit represent?",
    options: [
      "A recorded set of changes",
      "A deleted branch",
      "A remote server",
      "A user account"
    ],
    answer: 0,
    explanation:
      "A commit records changes in the repository history."
  },
  {
    id: "B005",
    level: 0,
    topic: 7,
    question: "Why are branches used in Git?",
    options: [
      "To develop independently",
      "To remove Git history",
      "To install GitHub",
      "To create user accounts"
    ],
    answer: 0,
    explanation:
      "Branches allow independent lines of development."
  }
];

const initialState = {
  completed: [0, 0, 0],
  correct: [0, 0, 0],
  positions: [0, 0, 0],
  answers: {},
  selected: null
};

function loadProgress() {
  try {
    return {
      ...initialState,
      ...JSON.parse(localStorage.getItem("git-mastery-progress"))
    };
  } catch {
    return initialState;
  }
}

export default function App() {
  const [progress, setProgress] = useState(loadProgress);
  const [level, setLevel] = useState(0);
  const [screen, setScreen] = useState("dashboard");
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    localStorage.setItem(
      "git-mastery-progress",
      JSON.stringify(progress)
    );
  }, [progress]);

  const unlocked = (i) =>
    i === 0 ||
    (progress.completed[i - 1] >= 200 &&
      progress.correct[i - 1] / 200 >= 0.7);

  const currentQuestion = () => {
    const list = questionBank.filter(q => q.level === level);
    if (!list.length) return null;

    return list[progress.positions[level] % list.length];
  };

  const question = currentQuestion();

  function startLevel(i) {
    if (!unlocked(i)) return;
    setLevel(i);
    setSelected(null);
    setSubmitted(false);
    setScreen("quiz");
  }

  function submitAnswer() {
    if (selected === null || submitted || !question) return;

    const isCorrect = selected === question.answer;
    const next = { ...progress };

    next.completed = [...progress.completed];
    next.correct = [...progress.correct];
    next.positions = [...progress.positions];
    next.answers = { ...progress.answers };

    next.answers[question.id] = selected;
    next.completed[level] = Math.min(
      200,
      next.completed[level] + 1
    );

    if (isCorrect) {
      next.correct[level]++;
    }

    next.positions[level]++;
    setProgress(next);
    setSubmitted(true);
  }

  function nextQuestion() {
    setSelected(null);
    setSubmitted(false);

    if (progress.completed[level] >= 200) {
      setScreen("result");
    }
  }

  const percentage = (i) =>
    Math.round(progress.completed[i] / 200 * 100);

  const totalCompleted = progress.completed.reduce(
    (a, b) => a + b, 0
  );

  return (
    <div className={
      theme === "dark"
        ? "min-h-screen bg-slate-950 text-white"
        : "min-h-screen bg-slate-100 text-slate-900"
    }>
      <header className="border-b border-slate-700 p-5">
        <div className="mx-auto max-w-6xl flex flex-wrap justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              ⚡ Git Mastery Arena
            </h1>
            <p className="text-sm text-slate-400">
              Learn Git. Practice Git. Master Git.
            </p>
          </div>

          <button
            className="rounded-lg border border-slate-600 px-4 py-2"
            onClick={() =>
              setTheme(theme === "dark" ? "light" : "dark")
            }
          >
            {theme === "dark" ? "☀ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </header>

      <nav className="mx-auto max-w-6xl flex flex-wrap gap-3 p-4">
        {["dashboard", "bank", "progress"].map(item => (
          <button
            key={item}
            onClick={() => setScreen(item)}
            className="rounded-lg bg-slate-800 px-4 py-2 capitalize"
          >
            {item}
          </button>
        ))}
      </nav>

      <main className="mx-auto max-w-6xl p-5">
        {screen === "dashboard" && (
          <>
            <h2 className="text-3xl font-bold mb-2">
              Your Learning Journey
            </h2>
            <p className="text-slate-400 mb-7">
              Complete each level to unlock the next one.
            </p>

            <div className="grid gap-4 md:grid-cols-3">
              {levels.map((item, i) => (
                <div
                  key={item.name}
                  className="rounded-2xl border border-slate-700 bg-slate-900 p-5"
                >
                  <h3 className="text-xl font-bold">
                    {item.name}
                  </h3>

                  <p className="my-3 text-slate-400">
                    {item.total} Questions · {item.topics} Topics
                  </p>

                  <div className="h-2 rounded-full bg-slate-700">
                    <div
                      className="h-2 rounded-full bg-emerald-500"
                      style={{ width: percentage(i) + "%" }}
                    />
                  </div>

                  <p className="my-3 text-sm">
                    {progress.completed[i]} / 200 completed
                  </p>

                  <button
                    disabled={!unlocked(i)}
                    onClick={() => startLevel(i)}
                    className="w-full rounded-lg bg-emerald-600 p-3 font-semibold disabled:opacity-30"
                  >
                    {unlocked(i) ? "Continue Learning" : "🔒 Locked"}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-slate-900 p-5">
              <h3 className="font-bold text-xl">
                Overall Progress
              </h3>
              <p className="mt-2 text-slate-400">
                {totalCompleted} / 600 questions completed
              </p>
            </div>
          </>
        )}

        {screen === "bank" && (
          <>
            <h2 className="text-3xl font-bold mb-5">
              Question Bank
            </h2>

            {levels.map((item, i) => (
              <section key={item.name} className="mb-6">
                <h3 className="text-xl font-bold mb-3">
                  {item.name}
                </h3>

                <div className="grid gap-3 md:grid-cols-2">
                  {topics[i].map((topic, j) => (
                    <div
                      key={topic}
                      className="rounded-lg bg-slate-900 p-4"
                    >
                      <p className="font-semibold">{topic}</p>
                      <p className="text-sm text-slate-400">
                        20 Questions
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </>
        )}

        {screen === "quiz" && (
          <div className="mx-auto max-w-2xl rounded-2xl bg-slate-900 p-6">
            <div className="flex justify-between gap-3">
              <span>{levels[level].name}</span>
              <span>
                {progress.completed[level]} / 200
              </span>
            </div>

            <div className="my-5 h-2 bg-slate-700 rounded-full">
              <div
                className="h-2 bg-emerald-500 rounded-full"
                style={{ width: percentage(level) + "%" }}
              />
            </div>

            {question ? (
              <>
                <h2 className="text-xl font-bold my-5">
                  {question.question}
                </h2>

                {question.options.map((option, i) => (
                  <button
                    key={i}
                    disabled={submitted}
                    onClick={() => setSelected(i)}
                    className={
                      "block w-full text-left rounded-lg border p-4 mb-3 " +
                      (selected === i
                        ? "border-emerald-400 bg-emerald-900"
                        : "border-slate-700 bg-slate-800")
                    }
                  >
                    {String.fromCharCode(65 + i)}. {option}
                  </button>
                ))}

                {submitted && (
                  <div className="my-4 rounded-lg bg-slate-800 p-4">
                    <p className="font-bold">
                      {selected === question.answer
                        ? "✓ Correct!"
                        : "✗ Incorrect"}
                    </p>
                    <p className="text-sm mt-2 text-slate-300">
                      {question.explanation}
                    </p>
                  </div>
                )}

                {!submitted ? (
                  <button
                    disabled={selected === null}
                    onClick={submitAnswer}
                    className="w-full rounded-lg bg-emerald-600 p-3 disabled:opacity-40"
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button
                    onClick={nextQuestion}
                    className="w-full rounded-lg bg-emerald-600 p-3"
                  >
                    Continue
                  </button>
                )}
              </>
            ) : (
              <p>
                No questions have been added for this level yet.
                Add questions to the question bank to continue.
              </p>
            )}

            <button
              className="mt-4 text-slate-400"
              onClick={() => setScreen("dashboard")}
            >
              ← Save & Exit
            </button>
          </div>
        )}

        {screen === "progress" && (
          <>
            <h2 className="text-3xl font-bold mb-6">
              Performance Analytics
            </h2>

            {levels.map((item, i) => (
              <div
                key={item.name}
                className="rounded-xl bg-slate-900 p-5 mb-4"
              >
                <div className="flex justify-between">
                  <b>{item.name}</b>
                  <span>{percentage(i)}%</span>
                </div>

                <p className="text-sm text-slate-400 my-2">
                  Completed: {progress.completed[i]} / 200
                  · Correct: {progress.correct[i]}
                </p>

                <div className="h-2 bg-slate-700 rounded-full">
                  <div
                    className="h-2 bg-emerald-500 rounded-full"
                    style={{ width: percentage(i) + "%" }}
                  />
                </div>
              </div>
            ))}
          </>
        )}

        {screen === "result" && (
          <div className="rounded-2xl bg-slate-900 p-8 text-center">
            <h2 className="text-3xl font-bold">Level Completed!</h2>
            <p className="my-4">
              Review your score and continue your learning journey.
            </p>
            <button
              onClick={() => setScreen("dashboard")}
              className="rounded-lg bg-emerald-600 px-5 py-3"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
