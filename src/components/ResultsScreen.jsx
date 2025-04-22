import time from '../utils/time';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';
import { constants } from '../data/constants';
import supabase from '../integrations/supabase';
import { Hexagon, Share2, Star, Trophy } from 'lucide-react';
import { internationalization } from '../internationalization/internationalization';
import UserFeedback from './UserFeedback';

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
      <div className="mb-4 relative flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{
            scale: [1, 2, 2, 1, 1],
            rotate: [0, 0, 270, 270, 0],
          }}
          transition={{ duration: 1.66, delay: 0.33 }}
        >
          <Hexagon className="top-0 w-38 h-38 text-gray-400" fill="var(--color-gray-300)" strokeWidth={0.33} />
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 1.66, delay: 0.66 }}
          className="absolute top-7 w-24 h-24 mx-auto mb-6 rounded-full bg-linear-to-br from-warning to-danger flex items-center justify-center"
        >
          <Trophy className="w-12 h-12 text-white" />
        </motion.div>
      </div>

      <h2 className="text-3xl mb-4 text-secondary uppercase font-bold">
        {translated.done}
      </h2>

      <h2 className="text-3xl  font-bold">
        <span className='bg-linear-to-r from-accent1 to-accent3 bg-clip-text text-transparent'>{translated.yourScoreTodayWas}</span>
      </h2>

      <div className="mb-4 relative flex flex-col items-center justify-center">
        <Star className="top-0 w-38 h-38 text-warning" strokeWidth={1} />
        <span className="absolute top-5 text-9xl text-accent2 font-bold">{score}</span>
        <span className="absolute top-4 text-9xl text-accent1/66 font-bold">{score}</span>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        {shouldShowSharingInstructions ? <SharingInstructions /> : <ShareResultsButton />}

        <p className="text-md text-secondary font-semibold leading-tight">{translated.soTheyCanAlsoLearnAboutTopCurrentEvents}</p>
      </div>

      <div className=" mt-8 flex flex-col gap-4">
        <UserFeedback />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <p className="text-md text-secondary mb-2">{translated.useThisQrCodeToChallengeSomeoneInFrontOfYou}</p>

        <div className="flex justify-center p-6 bg-accent1/15 rounded-md">
          <QRCodeSVG
            value={window.location.href}
            size={150}
            bgColor="#ffffff"
            fgColor="var(--color-accent3)"
            className="rounded-md shadow-lg"
          />
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ResultsScreen