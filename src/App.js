import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import questionsData from "./questions.json";

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const questionsPerPage = 10;

  useEffect(() => {
    setQuestions(questionsData);
    setUserAnswers(Array(questionsData.length).fill(""));
  }, []);

  const handleChange = (i, val) => {
    const newAnswers = [...userAnswers];
    newAnswers[i] = val;
    setUserAnswers(newAnswers);
  };

  const handleCheckPage = () => {
    const start = currentPage * questionsPerPage;
    const end = start + questionsPerPage;
    const correctCount = questions
      .slice(start, end)
      .reduce(
        (acc, q, idx) =>
          acc +
          (userAnswers[start + idx].trim() === q.answer.trim() ? 1 : 0),
        0
      );

    if (correctCount === questionsPerPage) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 10000);
      if (end >= questions.length) {
        setShowSummary(true);
      } else {
        setCurrentPage(currentPage + 1);
      }
    } else {
      alert(
        `You got ${correctCount}/${questionsPerPage} correct. Try again before continuing!`
      );
    }
  };

  const handleCheckAnswer = (index, correctAnswer) => {
    const isAnsCorrect = userAnswers[index].trim() === correctAnswer.trim();
    setIsCorrect(isAnsCorrect);
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 1000);
  };

  const handleBackPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleTryAgain = () => {
    setUserAnswers(Array(questions.length).fill(""));
    setCurrentPage(0);
    setShowSummary(false);
  };

  const start = currentPage * questionsPerPage;
  const end = start + questionsPerPage;
  const pageQuestions = questions.slice(start, end);

  if (showSummary) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h1>🎉 JLPT N5 Grammar Quiz Completed!</h1>
        <h2>✅ All Answers Summary</h2>
        <ul style={{ textAlign: "left", display: "inline-block" }}>
          {questions.map((q, i) => (
            <li key={i} style={{ marginBottom: "10px" }}>
              <strong>{i + 1}. {q.jp}</strong><br />
              Correct Answer: <span style={{ color: "green" }}>{q.answer}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={handleTryAgain}
          style={{ marginTop: "20px", padding: "10px 20px", fontSize: "16px" }}
        >
          🔁 Try Again?
        </button>
      </div>
    );
  }

  return (
    <div className="App" style={{ textAlign: "center", padding: "20px" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "10px" }}>JLPT N5 Grammar Quiz</h1>

      {/* 🌸 Instruction Box */}
      <p
        style={{
          backgroundColor: "#f9f9f9",
          padding: "15px",
          borderRadius: "10px",
          maxWidth: "700px",
          margin: "0 auto 30px",
          fontSize: "16px",
          lineHeight: "1.8",
          color: "#333",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <strong>Instructions:</strong><br />
        Complete each sentence by changing the dictionary form inside parentheses
        into the <strong>て-form</strong>.<br />
        Use one of the following patterns:<br />
        ～てください、～てもいいですか、～てはいけません、～てもいいです、～て～、or ～てから。
      </p>

      {pageQuestions.map((q, i) => (
        <div
          key={i}
          style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "15px",
            marginBottom: "15px",
          }}
        >
          <p>
            <strong>{start + i + 1}. {q.jp}</strong>
          </p>
          <p style={{ color: "#555" }}>{q.en}</p>
          <input
            type="text"
            value={userAnswers[start + i]}
            onChange={(e) => handleChange(start + i, e.target.value)}
            placeholder="Type your answer"
            style={{ padding: "8px", fontSize: "16px", width: "80%" }}
          />
          <button
            onClick={() => handleCheckAnswer(start + i, q.answer)}
            style={{
              marginLeft: "10px",
              padding: "5px 10px",
              fontSize: "14px",
            }}
          >
            Check
          </button>
        </div>
      ))}

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={handleBackPage}
          disabled={currentPage === 0}
          style={{
            marginRight: "10px",
            padding: "10px 20px",
            backgroundColor: currentPage === 0 ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          ◀ Back Page
        </button>

        <button
          onClick={handleCheckPage}
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          ✅ Check Page
        </button>
      </div>

      {/* 👏 or ❌ Floating Animation */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, y: -50 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              fontSize: "3rem",
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 9999,
            }}
          >
            {isCorrect ? "👏" : "❌"}
          </motion.div>
        )}
      </AnimatePresence>

      {showConfetti && <Confetti />}
    </div>
  );
}
