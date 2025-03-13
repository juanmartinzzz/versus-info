import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Share2, Trophy } from 'lucide-react';
import { internationalization } from '../internationalization/internationalization';

const ResultsScreen = ({ score }) => {
  const translated = internationalization.getTranslated();
  const shareResults = () => {
    const text = `🎯 I scored ${score} on Versus Info!\n📰 Test your news knowledge too!`
    if (navigator.share) {
      navigator.share({
        title: 'My Versus Info Score',
        text: text,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(text)
    }
  }

  const getMessage = () => {
    if (score === 5) return translated.perfectScoreYoureUpToDate
    if (score >= 3) return translated.wellDoneYoureKeepingUpWithMostNews
    return translated.lookAtItThisWayNowYoureMoreInformed
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/80 backdrop-blur-xs rounded-md p-6 shadow-lg text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="w-24 h-24 mx-auto mb-6 rounded-full bg-linear-to-br from-warning to-danger
                   flex items-center justify-center"
      >
        <Trophy className="w-12 h-12 text-white" />
      </motion.div>

      <h2 className="text-3xl mb-6 bg-linear-to-r from-accent1 to-accent3 bg-clip-text text-transparent font-bold">
        {translated.quizComplete}
      </h2>

      <div className="text-7xl font-bold mb-4 bg-linear-to-br from-accent1 to-accent3
                      text-transparent bg-clip-text">
        {score}
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