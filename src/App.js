import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import questionsData from "./questions.json";

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [hintLevels, setHintLevels] = useState([]);
  const [hintCount, setHintCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const questionsPerPage = 10;
  const startIdx = currentPage * questionsPerPage;
  const endIdx = startIdx + questionsPerPage;
  const pageQuestions = questions.slice(startIdx, endIdx);

  useEffect(() => {
    const shuffled = [...questionsData]; // can shuffle if you want
    setQuestions(shuffled);
    setUserAnswers(Array(shuffled.length).fill(""));
    setHintLevels(Array(shuffled.length).fill(0));
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
      setHintCount((prev) => prev + 1);
    }
  };

  const handleFeedback = (isCorrect) => {
    setFeedback(isCorrect ? "👏" : "❌");
    setTimeout(() => setFeedback(null), 1000);
  };

  const checkAnswers = () => setShowResults(true);

  const handleRetry = () => window.location.reload();

  const correctAnswers = userAnswers.reduce(
    (a, v, i) => a + (v.trim() === questions[i]?.answer ? 1 : 0),
    0
  );

  const penalty = hintCount * 0.25;
  const finalScore = Math.max(correctAnswers - penalty, 0).toFixed(2);

  // Check if all questions on the current page are correct
  const allCorrectOnPage = pageQuestions.every(
    (q, i) => userAnswers[startIdx + i].trim() === q.answer
  );

  return (
    <div style={{ padding: "20px", maxWidth: "650px", margin: "auto" }}>
      <h1>JLPT N5 Grammar Quiz</h1>
      <h3>
        Page {currentPage + 1} / {Math.ceil(questions.length / questionsPerPage)}
      </h3>

      {pageQuestions.map((q, i) => (
        <div
          key={i}
          style={{
            marginBottom: "20px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <p>{startIdx + i + 1}. {q.jp}</p>
          <p style={{ color: "#555" }}>{q.en}</p>
          <input
            type="text"
            value={userAnswers[startIdx + i]}
            onChange={(e) => handleChange(startIdx + i, e.target.value)}
            onBlur={() =>
              handleFeedback(userAnswers[startIdx + i].trim() === q.answer)
            }
            placeholder="Type your answer"
          />
          {!showResults && (
            <button
              style={{ marginLeft: "10px" }}
              onClick={() => handleHint(startIdx + i)}
              disabled={hintLevels[startIdx + i] >= q.answer.length}
            >
              Hint
            </button>
          )}
          {hintLevels[startIdx + i] > 0 && (
            <p style={{ color: "blue" }}>
              Hint: {q.answer.slice(0, hintLevels[startIdx + i])}
              {hintLevels[startIdx + i] < q.answer.length ? "..." : ""}
            </p>
          )}
          {showResults && (
            <p
              style={{
                color:
                  userAnswers[startIdx + i].trim() === q.answer
                    ? "green"
                    : "red",
              }}
            >
              {userAnswers[startIdx + i].trim() === q.answer
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
          <h2>
            Your score: {finalScore}/{questions.length}  
            <br />
            <span style={{ fontSize: "0.9em", color: "#666" }}>
              ({correctAnswers} correct − {penalty.toFixed(2)} hint penalty)
            </span>
          </h2>
          <button onClick={handleRetry} style={{ padding: "10px 20px" }}>
            Try Again 🔁
          </button>
        </div>
      )}

      {allCorrectOnPage && currentPage < Math.floor(questions.length / questionsPerPage) && (
        <button
          onClick={() => {
            setShowResults(false);
            setCurrentPage(currentPage + 1);
          }}
          style={{
            marginTop: "20px",
            padding: "10px 25px",
            backgroundColor: "green",
            color: "white",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Next Page ➡️
        </button>
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
