import time from '../../utils/time';
import { Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';
import ScoreAnimation from './ScoreAnimation';
import { constants } from '../../data/constants';
import supabase from '../../integrations/supabase';
import UserFeedback from './UserFeedback';
import { internationalization } from '../../internationalization/internationalization';
import ShareWithQRCode from './ShareWithQRCode';
import QuestionsReview from './QuestionsReview';

const upsertAnswer = async ({score, answersData}) => {
  // Don't store answers for Dev environment
  if (import.meta.env.DEV) {
    console.log('DEV: not upserting answer');
    return;
  }

  const answer = {
    score,
    answersData,
    relevant_date: time.getDateWithoutTimeString(),
  }

  supabase.upsertAnswer({answer});
}

const ResultsScreen = ({ score, answersData, questions }) => {
  const translated = internationalization.getTranslated();
  const [shouldShowSharingInstructions, setShouldShowSharingInstructions] = useState(false);

  useEffect(() => {
    // Store answer information with answersData
    upsertAnswer({score, answersData});
  }, []);

  const shareResults = () => {
    const questionCategoryAndAnswerIsCorrect = Object.keys(answersData).map(key => {
      const questionCategoryId = questions.find(question => `${question.id}` === key).categoryId;
      const categoryNameKey = constants.categories.find(category => category.id === questionCategoryId).nameKey;
      const questionCategory = translated[categoryNameKey];
      const answerIsCorrect = answersData[key].isCorrect ? '🟢' : '🔴';

      return `${answerIsCorrect} ${questionCategory.charAt(0).toUpperCase() + questionCategory.slice(1).toLowerCase()}`;
    });

    const phrases = [
      // `🎯 ${translated.myScoreTodayWas} ${score}`,
      questionCategoryAndAnswerIsCorrect.join('\n'),
      `${translated.myTotalIs}: ${score} - ${translated.playAndCatchUpWithTheNews}`,
      // `${translated.canYouBeatMe}`,
      `${import.meta.env.VITE_SHARE_URL}?lc=${localStorage.getItem(constants.localStorageKeys.languageCode)}`,
    ];

    const text = phrases.join(`\n`);
    navigator.clipboard.writeText(text);

    setShouldShowSharingInstructions(true);
  }

  const ShareResultsButton = () => {
    return (
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.98 }}
        onClick={shareResults}
        className="flex items-center justify-center gap-2 text-white text-xl py-4 px-6 rounded-md animate-background-change"
      >
        <Share2 className="w-6 h-6" />
        {translated.tapHereToChallengeOthers}
      </motion.button>
    )
  }

  const SharingInstructions = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: -36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.66 }}
        className="p-4 bg-secondary/10 border-[3px] border-dashed border-gray-400 rounded-xl"
      >
        <p className="text-lg font-bold leading-tight">{translated.resultCopied}</p>
        <p className="text-lg font-bold leading-tight">{translated.pasteItOnAnyChatGroupToChallengeOthers}</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.66 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.66, duration: 0.66 }}
      className="bg-white/80 backdrop-blur-xs rounded-md p-6 shadow-lg text-center"
    >
      <ScoreAnimation score={score} />

      <div className="flex flex-col gap-4 mt-4">
        {shouldShowSharingInstructions ? <SharingInstructions /> : <ShareResultsButton />}

        <p className="text-md text-secondary font-semibold leading-tight">{translated.soTheyCanAlsoLearnAboutTopCurrentEvents}</p>
      </div>

      {/* Questions review  */}
      <div className='mt-16'>
        <QuestionsReview questions={questions} answersData={answersData} />
      </div>

      {/* User feedback */}
      <div className="mt-16 max-w-sm mx-auto flex flex-col gap-4">
        <UserFeedback />
      </div>

      {/* Share with QR code */}
      <div className="mt-16 flex flex-col gap-4">
        <ShareWithQRCode />
      </div>
    </motion.div>
  )
}

export default ResultsScreen