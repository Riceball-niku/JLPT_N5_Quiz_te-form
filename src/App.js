import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import questionsData from './questions.json';

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [feedback, setFeedback] = useState(null); // 👏 or ❌

  useEffect(() => {
    setQuestions(questionsData);
    setUserAnswers(Array(questionsData.length).fill(''));
  }, []);

  // Trigger feedback when user types the correct answer
  const handleChange = (i, val) => {
    const ans = [...userAnswers];
    ans[i] = val;
    setUserAnswers(ans);

    // Trim input and compare to correct answer
    if (val.trim() === questions[i]?.answer) {
      showAnimatedFeedback('👏');
    } else if (val.trim().length >= questions[i]?.answer.length) {
      showAnimatedFeedback('❌');
    }
  };

  // Helper function to display emoji briefly
  const showAnimatedFeedback = (emoji) => {
    setFeedback(emoji);
    setTimeout(() => setFeedback(null), 1000);
  };

  const checkAnswers = () => setShowResults(true);

  const score = userAnswers.reduce(
    (a, v, i) => a + (v.trim() === questions[i]?.answer ? 1 : 0),
    0
  );

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', position: 'relative' }}>
      <h1>JLPT N5 Grammar Quiz</h1>

      {/* 🎉 Floating emoji animation */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            key={feedback}
            initial={{ opacity: 0, scale: 0.5, y: 30 }}
            animate={{ opacity: 1, scale: 1.5, y: -20 }}
            exit={{ opacity: 0, scale: 0.5, y: -60 }}
            transition={{ duration: 0.8, type: 'spring' }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '4rem',
              pointerEvents: 'none',
            }}
          >
            {feedback}
          </motion.div>
        )}
      </AnimatePresence>

      {questions.map((q, i) => (
        <div
          key={i}
          style={{
            marginBottom: '20px',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
          }}
        >
          <p>{i + 1}. {q.jp}</p>
          <p style={{ color: '#555' }}>{q.en}</p>
          <input
            type='text'
            value={userAnswers[i]}
            onChange={e => handleChange(i, e.target.value)}
            placeholder='Type your answer'
          />
          {showResults && (
            <p
              style={{
                color: userAnswers[i].trim() === q.answer ? 'green' : 'red',
              }}
            >
              {userAnswers[i].trim() === q.answer
                ? '✅ Correct'
                : '❌ Correct: ' + q.answer}
            </p>
          )}
        </div>
      ))}

      <button onClick={checkAnswers} style={{ padding: '10px 20px' }}>
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
