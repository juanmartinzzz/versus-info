import time from './utils/time.js';
import useQuiz from './hooks/useQuiz.js';
import { useState, useEffect } from 'react';
import MenuBar from './components/MenuBar.jsx';
import { constants } from './data/constants.js';
import { motion, AnimatePresence } from 'framer-motion';
import QuestionCard from './components/QuestionCard.jsx';
import ResultsScreen from './components/ResultsScreen.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';
import { internationalization } from './internationalization/internationalization.js';


const timeToMidnight = {
  hours: 24 - (new Date()).getHours(),
  minutes: 60 - (new Date()).getMinutes(),
}

function App() {
  const translated = internationalization.getTranslated();
  const [isLoading, setIsLoading] = useState(true)
  const {
    score,
    progress,
    isComplete,
    isRevealed,
    questionsData,
    selectedAnswer,
    currentQuestion,
    handleAnswerSelect,
    handleNextQuestion,
    currentQuestionIndex,
    handleLoadLocalState,
    handleLoadQuestionsFromRemote,
    handleQuestionFeedback,
  } = useQuiz()

  useEffect(() => {
    // Reset questions helper for development purposes
    const resetQueryParam = new URLSearchParams(window.location.search).get('reset');
    if (resetQueryParam) {
      localStorage.removeItem(constants.localStorageKeys.previousSession);
    }

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
                  className="text-4xl md:text-5xl bg-linear-to-r from-accent1 to-accent3 bg-clip-text text-transparent font-bold"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", delay: 0.33, duration: 1.6 }}
                >
                  Versus Info ■
                  {/* Versus Info ▓ */}
                </motion.h1>

                <motion.p
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.66 }}
                  className="text-secondary font-bold"
                >
                  {translated.catchUpAndChallengeOthers}
                </motion.p>

                <motion.p
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-secondary text-sm"
                >
                  {time.getHumanMonthShortAndDay()}
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
                      onNext={handleNextQuestion}
                      selectedAnswer={selectedAnswer}
                      onAnswerSelect={handleAnswerSelect}
                      onFeedback={handleQuestionFeedback}
                      currentQuestionIndex={currentQuestionIndex}
                    />
                  ) : (
                    <ResultsScreen
                      score={score}
                      questionsData={questionsData}
                    />
                  )}
                </AnimatePresence>
              </main>

              <motion.p
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.33 }}
                className="mt-4 text-secondary text-center text-sm"
              >
                {translated.newQuestionsComingOn} {timeToMidnight.hours} {translated.hours} {timeToMidnight.minutes} {translated.minutes}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export default App