import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import questionsData from "./questions.json";

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [page, setPage] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const questionsPerPage = 10;
  const startIndex = page * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = questions.slice(startIndex, endIndex);

  useEffect(() => {
    setQuestions(questionsData);
    setUserAnswers(Array(questionsData.length).fill(""));
  }, []);

  const handleChange = (i, val) => {
    const ans = [...userAnswers];
    ans[startIndex + i] = val;
    setUserAnswers(ans);
  };

  const checkAnswers = () => {
    setShowResults(true);

    // Check all answers on this page
    const allCorrect = currentQuestions.every(
      (q, i) => userAnswers[startIndex + i].trim() === q.answer
    );

    if (allCorrect) {
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        if (endIndex < questions.length) setPage((p) => p + 1);
      }, 10000); // 10 seconds confetti
    }
  };

  const score = userAnswers.reduce(
    (a, v, i) => a + (v.trim() === questions[i]?.answer ? 1 : 0),
    0
  );

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      {showConfetti && <Confetti />}

      <h1>JLPT N5 Grammar Quiz</h1>
      <h3>
        Page {page + 1} / {Math.ceil(questions.length / questionsPerPage)}
      </h3>

      {currentQuestions.map((q, i) => (
        <div
          key={i}
          style={{
            marginBottom: "20px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <p>{startIndex + i + 1}. {q.jp}</p>
          <p style={{ color: "#555" }}>{q.en}</p>
          <input
            type="text"
            value={userAnswers[startIndex + i]}
            onChange={(e) => handleChange(i, e.target.value)}
            placeholder="Type your answer"
          />
          {showResults && (
            <p
              style={{
                color:
                  userAnswers[startIndex + i].trim() === q.answer
                    ? "green"
                    : "red",
              }}
            >
              {userAnswers[startIndex + i].trim() === q.answer
                ? "✅ Correct"
                : "❌ Correct: " + q.answer}
            </p>
          )}
        </div>
      ))}

      <button onClick={checkAnswers} style={{ padding: "10px 20px" }}>
        Check Answers
      </button>

      {showResults && (
        <h2>
          Your score: {score}/{questions.length}
        </h2>
      )}
    </div>
  );
}
