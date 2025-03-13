import { motion } from 'framer-motion';
import { Timer, CheckCircle2, XCircle } from 'lucide-react';
import { internationalization } from '../internationalization/internationalization';

const QuestionCard = ({
  onNext,
  question,
  isRevealed,
  selectedAnswer,
  onAnswerSelect,
  currentQuestionIndex
}) => {
  const translated = internationalization.getTranslated();
  if (!question) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    },
    exit: { opacity: 0, y: -20 }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  }

  const handleNext = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onNext()
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-white backdrop-blur-xs rounded-md p-6 shadow-lg"
    >
      <motion.div
        className="flex items-center gap-2 text-info mb-4"
        variants={itemVariants}
      >
        <span className="text-xl">{question.emoji}</span>
        <span className="text-xl font-semibold">{question.category}</span>

        {selectedAnswer && !isRevealed && (
          <div className="ml-auto flex items-center gap-2 w-full">
            <Timer className="w-4 h-4 text-accent1 animate-pulse" />
            <span className="bg-accent1 rounded-full h-1 animate-countdown"></span>
          </div>
        )}
      </motion.div>

      <motion.h2
        variants={itemVariants}
        className="text-2xl font-semibold mb-8 leading-tight"
      >
        {question.text}
      </motion.h2>

      <div className="space-y-4">
        {question.options.map((option, index) => (
          <motion.button
            key={index}
            variants={itemVariants}
            onClick={() => !isRevealed && onAnswerSelect({answer: option.value})}
            className={`
              answer-button
              backdrop-blur-[4px]
              ${selectedAnswer === option.value ? 'selected' : ''}
              ${isRevealed && option.correct ? 'correct' : ''}
              ${isRevealed && selectedAnswer === option.value && !option.correct ? 'incorrect' : ''}
            `}
            disabled={isRevealed}
          >
            <span className="relative z-10 flex items-center justify-between">
              <span>{option.value}</span>
              {isRevealed && (
                option.correct ? (
                  <CheckCircle2 className="w-5 h-5 text-success" />
                ) : (
                  selectedAnswer === option.value && (
                    <XCircle className="w-5 h-5 text-danger" />
                  )
                )
              )}
            </span>
          </motion.button>
        ))}
      </div>

      {isRevealed && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 w-full bg-linear-to-r from-accent1 to-accent3
                     text-white py-3 rounded-md hover:shadow-lg
                     hover:shadow-accent1/20 hover:-translate-y-0.5
                     transition-all duration-300"
          onClick={handleNext}
        >
          {currentQuestionIndex === 4 ? translated.checkYourResults : translated.nextQuestion}
        </motion.button>
      )}
    </motion.div>
  )
}

export default QuestionCard