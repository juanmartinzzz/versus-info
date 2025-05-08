import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Hexagon, Star, Trophy } from "lucide-react";
import { internationalization } from "../../internationalization/internationalization";

const ScoreAnimation = ({ score }) => {
  const scoreAnimationRef = useRef(null);
  const translated = internationalization.getTranslated();

  useEffect(() => {
    setTimeout(() => {
      scoreAnimationRef.current.scrollIntoView({ behavior: 'smooth' });
    }, 1200);
  }, []);

  return (
    <div>
      <div id="score-animation" ref={scoreAnimationRef}></div>
      <div className="mb-4 relative flex flex-col items-center justify-center">

        <motion.div
          initial={{ scale: 0.5 }}
          animate={{
            scale: [1, 2, 2, 1, 1],
            rotate: [0, 0, 270, 270, 0],
          }}
          transition={{ duration: 1.66, delay: 1.33 }}
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

      {/* <h2 className="text-3xl mb-4 text-secondary uppercase font-bold">
        {translated.done}
      </h2> */}

      <h2 className="text-3xl font-bold">
        <span className='bg-linear-to-r from-accent1 to-accent3 bg-clip-text text-transparent'>{translated.yourScoreTodayWas}</span>
      </h2>

      <div className="mb-4 relative flex flex-col items-center justify-center">
        <Star className="top-0 w-38 h-38 text-warning" strokeWidth={1} />
        <span className="absolute top-5 text-9xl text-accent2 font-bold">{score}</span>
        <span className="absolute top-4 text-9xl text-accent1/66 font-bold">{score}</span>
      </div>
    </div>
  )
}

export default ScoreAnimation;