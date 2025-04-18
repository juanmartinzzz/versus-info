import { ArrowRight } from "lucide-react";
import { motion } from 'framer-motion';
import { internationalization } from "../internationalization/internationalization";
import string from "../utils/string";

const NewsLink = ({ expandedInfo = null, newsArticleUrl = null, videoEmbed = null, imageUrl = null }) => {
  const translated = internationalization.getTranslated();

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 1.9, delay: 1 }}
    >
      {expandedInfo && (
        <div className="mb-4 text-sm">
          {expandedInfo.split('\n').map((line, index) => (
            <p key={index} className="mb-2">{line}</p>
          ))}
        </div>
      )}

      {videoEmbed && (
        <div className="mb-4 flex justify-center items-center">
          <iframe src={videoEmbed} className="w-full h-96" />
        </div>
      )}

      {newsArticleUrl && (
        <div className="mb-4 text-sm text-accent1">
          <a href={newsArticleUrl} target="_blank" rel="noopener noreferrer" className="flex justify-center items-center gap-2">{translated.moreInfo} <ArrowRight className="w-4 h-4" /></a>
        </div>
      )}

      {imageUrl && (
        <div className="mb-4 flex flex-col justify-center items-center">
          <img src={imageUrl} alt="News Article" className="w-full" />
          <div className="text-sm text-accent1">
            {translated.imageFrom}: <a href={imageUrl} target="_blank" rel="noopener noreferrer">{string.getUrlParts({url: imageUrl}).host}</a>
          </div>
        </div>
      )}

      {/* {videoEmbed && false && (
        <div className="mb-4 flex justify-center items-center">
          <div className="flex justify-center items-center gap-2 border border-danger rounded-full p-1 pr-4">
            <div className="bg-danger rounded-full p-1.5">
              <Play className="w-6 h-6 text-white" />
            </div>

            <div className="text-md font-bold">
              View video
            </div>
          </div>
        </div>
      )} */}
    </motion.div>
  );
};

export default NewsLink;