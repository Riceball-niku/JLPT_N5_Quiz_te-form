import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import questionsData from "./questions.json";

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [hintLevels, setHintLevels] = useState([]);

  useEffect(() => {
    // Randomize question order
    const shuffled = [...questionsData].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setUserAnswers(Array(shuffled.length).fill(""));
    setHintLevels(Array(shuffled.length).fill(0)); // start with 0 hints shown
  }, []);

  const handleChange = (i, val) => {
    const ans = [...userAnswers];
    ans[i] = val;
    setUserAnswers(ans);
  };

  const handleHint = (i) => {
    const newLevels = [...hintLevels];
    if (newLevels[i] < questions[i].answer.length) {
      newLevels[i] += 1;
      setHintLevels(newLevels);
    }
  };

  const checkAnswers = () => setShowResults(true);

  const handleRetry = () => {
    window.location.reload();
  };

  const score = userAnswers.reduce(
    (a, v, i) => a + (v.trim() === questions[i]?.answer ? 1 : 0),
    0
  );

  const handleFeedback = (isCorrect) => {
    setFeedback(isCorrect ? "👏" : "❌");
    setTimeout(() => setFeedback(null), 1000);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>JLPT N5 Grammar Quiz</h1>

      {questions.map((q, i) => (
        <div
          key={i}
          style={{
            marginBottom: "20px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <p>{i + 1}. {q.jp}</p>
          <p style={{ color: "#555" }}>{q.en}</p>
          <input
            type="text"
            value={userAnswers[i]}
            onChange={(e) => handleChange(i, e.target.value)}
            onBlur={() => handleFeedback(userAnswers[i].trim() === q.answer)}
            placeholder="Type your answer"
          />

          {!showResults && (
            <button
              style={{ marginLeft: "10px" }}
              onClick={() => handleHint(i)}
              disabled={hintLevels[i] >= q.answer.length}
            >
              Hint
            </button>
          )}

          {hintLevels[i] > 0 && (
            <p style={{ color: "blue" }}>
              Hint: {q.answer.slice(0, hintLevels[i])}
              {hintLevels[i] < q.answer.length ? "..." : ""}
            </p>
          )}

          {showResults && (
            <p
              style={{
                color: userAnswers[i].trim() === q.answer ? "green" : "red",
              }}
            >
              {userAnswers[i].trim() === q.answer
                ? "✅ Correct"
                : "❌ Correct: " + q.answer}
            </p>
          )}
        </div>
      ))}

      {!showResults ? (
        <button onClick={checkAnswers} style={{ padding: "10px 20px" }}>
          Check Answers
        </button>
      ) : (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <h2>Your score: {score}/{questions.length}</h2>
          <button onClick={handleRetry} style={{ padding: "10px 20px" }}>
            Try Again 🔁
          </button>
        </div>
      )}

      <AnimatePresence>
        {feedback && (
          <motion.div
            key={feedback}
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "fixed",
              top: "40%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "60px",
            }}
          >
            {feedback}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
