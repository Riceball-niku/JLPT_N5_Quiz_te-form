import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import questionsData from "./questions.json";

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [nextPageAvailable, setNextPageAvailable] = useState(false);

  const questionsPerPage = 10;

  useEffect(() => {
    setQuestions(questionsData);
    setUserAnswers(Array(questionsData.length).fill(""));
  }, []);

  const startIndex = currentPage * questionsPerPage;
  const currentQuestions = questions.slice(startIndex, startIndex + questionsPerPage);

  const handleChange = (index, value) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[startIndex + index] = value;
    setUserAnswers(updatedAnswers);
  };

  const handleCheckAnswer = (index) => {
    const globalIndex = startIndex + index;
    const userAnswer = userAnswers[globalIndex].trim();
    const correctAnswer = questions[globalIndex]?.answer;

    const correct = userAnswer === correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 1000);

    // Check if all 10 answers on the current page are correct
    const allCorrect = currentQuestions.every(
      (q, i) => userAnswers[startIndex + i].trim() === q.answer
    );

    if (allCorrect && !nextPageAvailable) {
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        setNextPageAvailable(true);
      }, 10000); // show confetti for 10s, then show next button
    }
  };

  const handleNextPage = () => {
    setNextPageAvailable(false);
    setShowConfetti(false);

    if (startIndex + questionsPerPage < questions.length) {
      setCurrentPage((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const score = userAnswers.reduce(
    (sum, val, i) => sum + (val.trim() === questions[i]?.answer ? 1 : 0),
    0
  );

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
        <strong>Instructions:</strong>
        <br />
        Complete each sentence by changing the dictionary form inside parentheses
        into the <strong>て-form</strong>.
        <br />
        Use one of the following patterns:
        <br />
        ～てください、～てもいいですか、～てはいけません、～てもいいです、～て～、or ～てから。
      </p>

      {!showResults ? (
        <>
          <h2>
            Page {currentPage + 1} / {Math.ceil(questions.length / questionsPerPage)}
          </h2>

          {currentQuestions.map((q, i) => (
            <div
              key={i}
              style={{
                marginBottom: "20px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                maxWidth: "600px",
                margin: "20px auto",
              }}
            >
              <p style={{ fontSize: "18px" }}>
                {startIndex + i + 1}. {q.jp}
              </p>
              <p style={{ color: "#555" }}>{q.en}</p>
              <input
                type="text"
                value={userAnswers[startIndex + i]}
                onChange={(e) => handleChange(i, e.target.value)}
                placeholder="Type your answer"
                style={{ padding: "8px", fontSize: "16px" }}
              />
              <br />
              <button
                onClick={() => handleCheckAnswer(i)}
                style={{ padding: "6px 12px", marginTop: "5px" }}
              >
                Check
              </button>
            </div>
          ))}

          {/* ✅ Next Page button (after confetti) */}
          {nextPageAvailable && (
            <button
              onClick={handleNextPage}
              style={{
                marginTop: "20px",
                padding: "10px 25px",
                fontSize: "16px",
                borderRadius: "8px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Next Page →
            </button>
          )}
        </>
      ) : (
        <div>
          <h2>🎉 Congratulations! You finished all questions!</h2>
          <h3>
            Final Score: {score}/{questions.length}
          </h3>
        </div>
      )}

      {/* 👏❌ feedback animation */}
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
