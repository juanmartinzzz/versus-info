import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Hexagon, Share2, Star, Trophy } from 'lucide-react';
import { internationalization } from '../internationalization/internationalization';

const ResultsScreen = ({ score }) => {
  const translated = internationalization.getTranslated();

  const shareResults = () => {
    const phrases = [
      `🎯 ${translated.myScoreTodayWas} ${score} ${translated.onVersusInfoCanYouBeatMe}`,
      `${import.meta.env.VITE_SHARE_URL}?lc=${localStorage.getItem('languageCode')}`,
    ]

    const text = phrases.join(`\n`);
    console.log({text});
    navigator.clipboard.writeText(text);
  }

  const getMessage = () => {
    if (score === 5) return translated.perfectScoreYoureUpToDate
    if (score >= 3) return translated.wellDoneYoureKeepingUpWithMostImportantCurrentEvents
    return translated.lookAtItThisWayNowYoureMoreInformed
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
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
        {translated.youreDone}
      </h2>

      <h2 className="text-3xl bg-linear-to-r from-accent1 to-accent3 bg-clip-text text-transparent font-bold">
        {translated.yourScoreTodayWas}
      </h2>

      <div className="mb-4 relative flex flex-col items-center justify-center">
        <Star className="top-0 w-38 h-38 text-warning" strokeWidth={1} />
        <span className="absolute top-5 text-9xl text-accent2 font-bold">{score}</span>
        <span className="absolute top-4 text-9xl text-accent1/66 font-bold">{score}</span>
      </div>

      <p className="text-xl mb-8">{getMessage()}</p>

      <div className="flex flex-col gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.98 }}
          onClick={shareResults}
          className="flex items-center justify-center gap-2 text-white text-xl py-4 px-6 rounded-md animate-background-change"
        >
          <Share2 className="w-6 h-6" />
          {translated.shareResults}
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-6 bg-accent1/20 rounded-md"
      >
        <p className="text-sm mb-4">{translated.shareTodaysQuestionsWithSomeone}</p>
        <div className="flex justify-center">
          <QRCodeSVG
            value={window.location.href}
            size={150}
            className="rounded-md shadow-lg"
          />
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ResultsScreen