
import React, { useState, useEffect } from 'react';
import questionsData from './questions.json';

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    setQuestions(questionsData);
    setUserAnswers(Array(questionsData.length).fill(''));
  }, []);

  const handleChange = (i, val) => {
    const ans = [...userAnswers];
    ans[i] = val;
    setUserAnswers(ans);
  };

  const checkAnswers = () => setShowResults(true);
  const score = userAnswers.reduce((a, v, i) => a + (v.trim() === questions[i]?.answer ? 1 : 0), 0);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1>JLPT N5 Grammar Quiz</h1>
      {questions.map((q,i) => (
        <div key={i} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <p>{i+1}. {q.jp}</p>
          <p style={{color:'#555'}}>{q.en}</p>
          <input type='text' value={userAnswers[i]} onChange={e=>handleChange(i,e.target.value)} placeholder='Type your answer'/>
          {showResults && <p style={{color:userAnswers[i].trim()===q.answer?'green':'red'}}>{userAnswers[i].trim()===q.answer?'✅ Correct':'❌ Correct: '+q.answer}</p>}
        </div>
      ))}
      <button onClick={checkAnswers} style={{padding:'10px 20px'}}>Check Answers</button>
      {showResults && <h2>Your score: {score}/{questions.length}</h2>}
    </div>
  );
}
