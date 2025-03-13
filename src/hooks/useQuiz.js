import { useState, useEffect } from 'react'
import supabase from '../integrations/supabase'

const delayBetweenQuestionsSeconds = process.env.NODE_ENV === 'development' ? 0.5 : 3;

const defaultQuestions = [
  {
    category: 'Technology',
    emoji: '💻',
    text: 'Which company recently announced a major breakthrough in quantum computing?',
    options: [
      {
        value: 'IBM',
        correct: true
      },
      {
        value: 'Google',
        correct: false
      },
      {
        value: 'Microsoft',
        correct: false
      }
    ],
    correctAnswer: 'IBM'
  },
  {
    category: 'Politics',
    emoji: '🏛️',
    text: 'Which country recently joined NATO as its newest member?',
    options: [
      {
        value: 'Ukraine',
        correct: false
      },
      {
        value: 'Sweden',
        correct: false
      },
      {
        value: 'Finland',
        correct: true
      }
    ],
    correctAnswer: 'Finland'
  },
  {
    category: 'Sports',
    emoji: '⚽',
    text: 'Which team won the latest Super Bowl?',
    options: [
      {
        value: 'San Francisco 49ers',
        correct: false
      },
      {
        value: 'Kansas City Chiefs',
        correct: true
      },
      {
        value: 'Baltimore Ravens',
        correct: false
      }
    ],
    correctAnswer: 'Kansas City Chiefs'
  },
  {
    category: 'Science',
    emoji: '🔬',
    text: 'What was the name of the recent NASA mission to return asteroid samples to Earth?',
    options: [
      {
        value: 'OSIRIS-REx',
        correct: true
      },
      {
        value: 'Artemis',
        correct: false
      },
      {
        value: 'Perseverance',
        correct: false
      }
    ],
    correctAnswer: 'OSIRIS-REx'
  },
  {
    category: 'Entertainment',
    emoji: '🎬',
    text: 'Which film won the Academy Award for Best Picture in 2024?',
    options: [
      {
        value: 'Oppenheimer',
        correct: true
      },
      {
        value: 'Barbie',
        correct: false
      },
      {
        value: 'Poor Things',
        correct: false
      }
    ],
    correctAnswer: 'Oppenheimer'
  }
]

const useQuiz = () => {
  const [score, setScore] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [revealTimer, setRevealTimer] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [questions, setQuestions] = useState(defaultQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentQuestion = questions[currentQuestionIndex]
  const isComplete = currentQuestionIndex >= questions.length
  const progress = (currentQuestionIndex / questions.length) * 100

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
    const previousSession = localStorage.getItem('previousSession') ? JSON.parse(localStorage.getItem('previousSession')) : null;

    if(previousSession) {
      setScore(previousSession.score);
      setIsRevealed(previousSession.isRevealed);
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
      if(answer === currentQuestion.options.find(option => option.correct).value) {
        setScore(prev => prev + 1)
      }

      // Save key data to local storage to restore on page reload
      localStorage.setItem('previousSession', JSON.stringify({
        score: answer === currentQuestion.options.find(option => option.correct).value ? score + 1 : score,
        isRevealed: true,
        selectedAnswer: answer,
        currentQuestionIndex: currentQuestionIndex,
      }));
    }, delayBetweenQuestionsSeconds * 1000)

    setRevealTimer(timer);
  }

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
    isComplete,
    isRevealed,
    selectedAnswer,
    currentQuestion,
    handleAnswerSelect,
    handleNextQuestion,
    currentQuestionIndex,
    handleLoadLocalState,
    handleLoadQuestionsFromRemote
  }
}

export default useQuiz