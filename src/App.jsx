import useQuiz from './hooks/useQuiz.js';
import { useState, useEffect } from 'react';
import MenuBar from './components/MenuBar.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import QuestionCard from './components/QuestionCard.jsx';
import ResultsScreen from './components/ResultsScreen.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';
import { internationalization } from './internationalization/internationalization.js';

function App() {
  const translated = internationalization.getTranslated();
  const [isLoading, setIsLoading] = useState(true)
  const {
    score,
    progress,
    isComplete,
    isRevealed,
    selectedAnswer,
    currentQuestion,
    handleAnswerSelect,
    handleNextQuestion,
    handleLoadLocalState,
    handleLoadQuestionsFromRemote
  } = useQuiz()

  useEffect(() => {
    // localStorage.removeItem('previousSession');

    // Simulate initial loading - quick for Dev environment
    const loadingDurationSeconds = import.meta.env.MODE === 'development' ? 0.33 : 2.66;
    const timer = setTimeout(() => setIsLoading(false), loadingDurationSeconds * 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    handleLoadLocalState()
  }, [])

  useEffect(() => {
    handleLoadQuestionsFromRemote()
  }, [])

  return (
    <>
      <MenuBar />

      <div className="min-h-screen p-4 md:p-8 grid-pattern">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <LoadingScreen key="loading" />
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <header className="text-center mt-8 mb-8">
                <motion.h1
                  className="text-4xl md:text-5xl mb-2 bg-linear-to-r from-accent1 to-accent3 bg-clip-text text-transparent font-bold"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", duration: 1.6 }}
                >
                  Versus Info ■
                  {/* Versus Info ▓ */}
                </motion.h1>

                <motion.p
                  className="text-secondary"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {translated.testYourNewsKnowledge}
                </motion.p>

                {!isComplete && (
                  <div className="max-w-md mx-auto mt-4">
                    <div className="progress-bar">
                      <motion.div
                        className="progress-bar-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </header>

              <main className="max-w-2xl mx-auto">
                <AnimatePresence mode="wait">
                  {!isComplete ? (
                    <QuestionCard
                      isRevealed={isRevealed}
                      key={currentQuestion?.id}
                      question={currentQuestion}
                      selectedAnswer={selectedAnswer}
                      onAnswerSelect={handleAnswerSelect}
                      onNext={handleNextQuestion}
                    />
                  ) : (
                    <ResultsScreen score={score} />
                  )}
                </AnimatePresence>
              </main>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export default App