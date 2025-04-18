import { useState, useEffect } from 'react'
import supabase from '../integrations/supabase'
import time from '../utils/time';
import { constants } from '../data/constants';

const delayBetweenQuestionsSeconds = process.env.NODE_ENV === 'development' ? 0.5 : 3;

const defaultQuestions = [
  {
    category: 'Technology',
    emoji: '💻',
    text: 'Más preguntas vendrán pronto ⏱',
    options: [
    ],
    correctAnswer: 'IBM'
  }
];

const useQuiz = () => {
  const [score, setScore] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [revealTimer, setRevealTimer] = useState(null);
  const [answersData, setAnswersData] = useState({});
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [questions, setQuestions] = useState(defaultQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  const isComplete = currentQuestionIndex >= questions.length;
  const progress = (currentQuestionIndex / questions.length) * 100;

  const handleUpdateAnswersData = ({questionId, property, value}) => {
    const newAnswersData = {...answersData, [questionId]: {
      ...answersData[questionId],
      [property]: value,
    }};

    setAnswersData(newAnswersData);

    return newAnswersData;
  }

  useEffect(() => {
    return () => {
      if(revealTimer) clearTimeout(revealTimer)
    }
  }, [revealTimer])

  const handleLoadQuestionsFromRemote = async () => {
    const question = await supabase.getRelevantQuestion();

    if(Array.isArray(question.items)) {
      setQuestions(question.items);
    }
  }

  const handleLoadLocalState = () => {
    const previousSession = localStorage.getItem(constants.localStorageKeys.previousSession) ? JSON.parse(localStorage.getItem(constants.localStorageKeys.previousSession)) : null;

    // If current date is different from the date of the previous session, reset the questions data
    if(previousSession && time.getDateWithoutTimeString({date: new Date(previousSession.date)}) !== time.getDateWithoutTimeString()) {
      console.log('Resetting session data - date on session is different from current date');
      localStorage.removeItem(constants.localStorageKeys.previousSession);
      return;
    }

    if(previousSession) {
      setScore(previousSession.score);
      setIsRevealed(previousSession.isRevealed);
      setAnswersData(previousSession.answersData);
      setSelectedAnswer(previousSession.selectedAnswer);
      setCurrentQuestionIndex(previousSession.currentQuestionIndex);
    }
  }

  const handleAnswerSelect = ({answer}) => {
    if(isRevealed) return

    // Hack to re-render countdown element and restart its animation
    setSelectedAnswer(null)
    setTimeout(() => setSelectedAnswer(answer), 10)

    if(revealTimer) {
      clearTimeout(revealTimer);
    }

    const timer = setTimeout(() => {
      setIsRevealed(true)
      const isCorrect = answer === currentQuestion.options.find(option => option.correct).value;

      if(isCorrect) {
        setScore(prev => prev + 1)
      }

      // Update questions data
      const newAnswersData = handleUpdateAnswersData({questionId: currentQuestion.id, property: 'isCorrect', value: isCorrect})

      localStorage.setItem(constants.localStorageKeys.previousSession, JSON.stringify({
        date: time.getDateWithoutTimeString(),
        score: isCorrect ? score + 1 : score,
        isRevealed: true,
        currentQuestionIndex,
        selectedAnswer: answer,
        answersData: newAnswersData,
      }));
    }, delayBetweenQuestionsSeconds * 1000)

    setRevealTimer(timer);
  }

  const handleQuestionFeedback = (feedback) => {
    // Update questions data
    const newAnswersData = handleUpdateAnswersData({questionId: currentQuestion.id, property: 'feedback', value: feedback});
    const previousSession = localStorage.getItem(constants.localStorageKeys.previousSession) ? JSON.parse(localStorage.getItem(constants.localStorageKeys.previousSession)) : null;

    if (previousSession) {
      previousSession.answersData = newAnswersData;
      localStorage.setItem(constants.localStorageKeys.previousSession, JSON.stringify(previousSession));
    }
  };

  const handleNextQuestion = () => {
    if(!isRevealed) {
      return;
    }

    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedAnswer(null);
    setIsRevealed(false);

    if(revealTimer) {
      clearTimeout(revealTimer)
      setRevealTimer(null)
    }
  }

  return {
    score,
    progress,
    questions,
    isComplete,
    isRevealed,
    answersData,
    selectedAnswer,
    currentQuestion,
    handleAnswerSelect,
    handleNextQuestion,
    currentQuestionIndex,
    handleLoadLocalState,
    handleQuestionFeedback,
    handleLoadQuestionsFromRemote,
  }
}

export default useQuiz