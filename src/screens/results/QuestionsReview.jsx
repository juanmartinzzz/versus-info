import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { internationalization } from '../../internationalization/internationalization';
import { CheckCircle2, XCircle, ChevronLeft, ChevronRight, Pointer } from 'lucide-react';

const FloatingIndicator = ({ icon, text, color, delay = 0, top, horizontalPosition, rotations }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, rotate: -15 }}
    animate={{ opacity: 1, y: 0, rotate: rotations}}
    transition={{
      duration: 3.3,
      repeat: Infinity,
      repeatType: "reverse",
      delay
    }}
    className={`absolute ${top} ${horizontalPosition} flex justify-center items-center gap-2 ${color}`}
  >
    {icon}

    <span className="font-bold text-lg whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">{text}</span>
  </motion.div>
);

const NavigationControls = ({ currentIndex, handleSwipe, questionsLength }) => {
  return (
    <div className="flex justify-between items-center">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleSwipe({ direction: 'prev' })}
        disabled={currentIndex === 0}
        className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
      >
        <ChevronLeft className="w-6 h-6" />
      </motion.button>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="text-xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-full shadow-lg"
      >
        {currentIndex + 1} / {questionsLength}
      </motion.div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleSwipe({ direction: 'next' })}
        disabled={currentIndex === questionsLength - 1}
        className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
      >
        <ChevronRight className="w-6 h-6" />
      </motion.button>
    </div>
  )
}

const QuestionsReview = ({ questions, answersData }) => {
  const translated = internationalization.getTranslated();

  const questionsReviewTopRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredOption, setHoveredOption] = useState(null);

  const handleSwipe = ({direction}) => {
    if (direction === 'next' && currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (direction === 'prev' && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }

    setTimeout(() => {
      questionsReviewTopRef.current.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const currentQuestion = questions[currentIndex];
  const userAnswer = answersData[currentQuestion.id];
  const isCorrect = userAnswer?.isCorrect;

  const getFeedbackMessage = () => {
    if (isCorrect) {
      return (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-5xl flex items-center justify-center gap-2"
        >
          {/* <Trophy className="w-8 h-8" /> */}
          🎉
        </motion.div>
      );
    }
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="text-5xl flex items-center justify-center gap-2"
      >
        {/* <Brain className="w-8 h-8" /> */}
        😅
      </motion.div>
    );
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          {translated.yourAnswers}
        </h2>
        <p className="text-xl text-gray-600 mt-2">
          {translated.reviewHowYouDidToday}
        </p>
      </motion.div>

      <div id="questions-review-top" ref={questionsReviewTopRef}></div>

      {/* Navigation Controls */}
      <NavigationControls handleSwipe={handleSwipe} currentIndex={currentIndex} questionsLength={questions.length} />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
          className="mt-4 overflow-hidden"
        >
          {/* Question Content */}
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-md font-bold mb-6 leading-tight"
            >
              {currentQuestion.text}
            </motion.div>

            {/* Media Content */}
            {currentQuestion.imageUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 relative group"
              >
                <img
                  src={currentQuestion.imageUrl}
                  alt="Question media"
                  className="w-full h-64 object-cover rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105"
                />
              </motion.div>
            )}
          </div>

          {/* Answer Options */}
          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => {
              const isUserAnswer = userAnswer?.selectedAnswer === option.value;
              const isCorrectOption = option.correct;
              const isHovered = hoveredOption === index;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onHoverStart={() => setHoveredOption(index)}
                  onHoverEnd={() => setHoveredOption(null)}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                    isUserAnswer
                      ? isCorrect
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                      : isCorrectOption
                      ? 'border-green-500 bg-green-20'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                  }`}
                >
                  {/* Floating Indicators */}
                  {isCorrectOption && (
                    <FloatingIndicator
                      icon={<span className="-rotate-180"><Pointer /></span>}
                      text={translated.correctAnswer}
                      color="text-purple-600"
                      top="-top-4"
                      horizontalPosition="left-8"
                      delay={0.2}
                      rotations={[-15, -5, -10]}
                    />
                  )}
                  {isUserAnswer && (
                    <FloatingIndicator
                      icon={<span><Pointer /></span>}
                      text={translated.yourChoice}
                      color="text-purple-600"
                      top="top-8"
                      horizontalPosition="right-0"
                      delay={0.4}
                      rotations={[15, 5, 10]}
                    />
                  )}

                  <div className="flex items-center gap-3">
                    {isUserAnswer && (
                      isCorrect ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-500" />
                      )
                    )}
                    <span className="text-lg">{option.value}</span>
                  </div>

                  {/* Hover Overlay */}
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl"
                    />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Video Content */}
          {currentQuestion.videoEmbed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4"
            >
              <iframe
                src={currentQuestion.videoEmbed}
                className="w-full h-128 rounded-sm"
                allowFullScreen
              />
            </motion.div>
          )}

          {/* Feedback Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center"
          >
            {getFeedbackMessage()}
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="mt-4">
        <NavigationControls handleSwipe={handleSwipe} currentIndex={currentIndex} questionsLength={questions.length} />
      </div>
    </div>
  );
};

export default QuestionsReview;