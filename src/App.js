return (
  <div className="App" style={{ textAlign: 'center', padding: '20px' }}>
    <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>JLPT N5 Grammar Quiz</h1>

    {/* 🌸 Instruction Box */}
    <p style={{
      backgroundColor: '#f9f9f9',
      padding: '15px',
      borderRadius: '10px',
      maxWidth: '700px',
      margin: '0 auto 30px',
      fontSize: '16px',
      lineHeight: '1.8',
      color: '#333',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    }}>
      <strong>Instructions:</strong><br />
      Complete each sentence by changing the dictionary form inside parentheses into the <strong>て-form</strong>.<br />
      Use one of the following patterns:<br />
      ～てください、～てもいいですか、～てはいけません、～てもいいです、～て～、or ～てから。
    </p>

    {/* 🌸 Progress Bar */}
    <div style={{
      width: '80%',
      height: '15px',
      backgroundColor: '#eee',
      borderRadius: '10px',
      margin: '20px auto'
    }}>
      <div
        style={{
          width: `${((currentPage * 10 + currentQuestionIndex + 1) / questions.length) * 100}%`,
          height: '100%',
          backgroundColor: '#4CAF50',
          borderRadius: '10px',
          transition: 'width 0.4s ease'
        }}
      />
    </div>

    {/* 👇 Your quiz content */}
    {!showResults ? (
      <>
        <h2>Question {currentPage * 10 + currentQuestionIndex + 1} of {questions.length}</h2>
        <p style={{ fontSize: '20px' }}>{currentQuestion.jp}</p>
        ...
