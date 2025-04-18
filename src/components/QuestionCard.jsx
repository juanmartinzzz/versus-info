import { useState } from 'react';
import NewsLink from './NewsLink';
import { motion } from 'framer-motion';
import { constants } from '../data/constants';
import { Timer, CheckCircle2, XCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import { internationalization } from '../internationalization/internationalization';

const QuestionCard = ({
  onNext,
  question,
  isRevealed,
  onFeedback,
  selectedAnswer,
  onAnswerSelect,
  currentQuestionIndex,
}) => {
  const translated = internationalization.getTranslated();
  const [feedbackGiven, setFeedbackGiven] = useState(null);

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
    e.preventDefault();
    e.stopPropagation();
    setFeedbackGiven(null);
    onNext();
  }

  const handleFeedback = (feedback) => {
    setFeedbackGiven(feedback);
    onFeedback(feedback);
  }

  const FeedbackButtons = ({ size = 18 }) => {
    return(
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-4"
      >
        <button
          onClick={() => handleFeedback('thumbsDown')}
          className={`hover:bg-gray-100 cursor-pointer`}
        >
          <ThumbsDown size={size} className={`${feedbackGiven === 'thumbsDown' ? 'text-danger' : 'text-primary'}`} />
        </button>

        <button
          onClick={() => handleFeedback('thumbsUp')}
          className={`hover:bg-gray-100 cursor-pointer`}
        >
          <ThumbsUp size={size} className={`${feedbackGiven === 'thumbsUp' ? 'text-accent1' : 'text-primary'}`} />
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-white backdrop-blur-xs rounded-md p-6 shadow-lg"
    >
      {/* Category, emoji and feedback buttons */}
      <motion.div
        variants={itemVariants}
        className="flex justify-between gap-2 text-info mb-4"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">{question.emoji}</span>
          <span className="text-xl">{constants.categories.find(category => category.id === question.categoryId)?.defaultEmoji}</span>
          <span className="text-xl font-semibold">{question.category}</span>
          <span className="text-xl font-semibold uppercase">{translated[constants.categories.find(category => category.id === question.categoryId)?.nameKey]}</span>
        </div>

        <FeedbackButtons />
      </motion.div>

      <motion.div
        translate="no"
        variants={itemVariants}
        className="text-2xl text-primary font-semibold leading-[1.066]"
      >
        {question.text}
      </motion.div>

      <div className="py-2 ml-auto flex items-center gap-2 w-full">
        {selectedAnswer && !isRevealed && (
          <>
            <Timer className="w-4 h-4 text-accent1 animate-pulse" />
            <span className="bg-accent1 rounded-full h-1 animate-countdown"></span>
          </>
        )}
      </div>

      {/* News link */}
      {isRevealed && (
        <NewsLink expandedInfo={question.expandedInfo} newsArticleUrl={question.newsArticleUrl} videoEmbed={question.videoEmbed} imageUrl={question.imageUrl} />
      )}

      {/* Options for the User to answer */}
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
              <span translate="no">{option.value}</span>
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

      {/* Next question button */}
      {isRevealed && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 w-full bg-linear-to-r from-accent1 to-accent3 text-white py-3 rounded-md hover:shadow-lg hover:shadow-accent1/20 hover:-translate-y-0.5 transition-all duration-300"
          onClick={handleNext}
        >
          {currentQuestionIndex === 4 ? translated.checkYourResults : translated.nextQuestion}
        </motion.button>
      )}
    </motion.div>
  )
}

export default QuestionCard