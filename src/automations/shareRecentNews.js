import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import telegram from '../integrations/telegram.js';

const maxNumberOfNewsToShare = 25;


/// Read from recentNews.json file in the same directory as this Node.js script
const getLocalData = () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const filePath = path.join(__dirname, 'localData.json');
  const localData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  return localData;
}


/// Write to recentNews.json file in the same directory as this Node.js script
const setLocalData = ({localData}) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const filePath = path.join(__dirname, 'localData.json');
  fs.writeFileSync(filePath, JSON.stringify(localData, null, 2));
}


/// Main method
const shareRecentNews = async () => {
  const localData = getLocalData();

  const newsPieceIdsToShare = Object.keys(localData.previousNews).filter(newsPieceKey => !localData.sharedNewsIds.includes(newsPieceKey));
  console.log(`Total news pieces to share: ${newsPieceIdsToShare.length} (but will share max ${maxNumberOfNewsToShare})`);

  newsPieceIdsToShare.slice(0, maxNumberOfNewsToShare).forEach(async (newsPieceId, index) => {
    const newsPiece = localData.previousNews[newsPieceId];
    const message = `${newsPieceId} - ${newsPiece.title}`;

    console.log({message});
    setTimeout(() => {
      telegram.sendMessage({message});
    }, index * 8 * 1000);

    // Add to shared news ids
    localData.sharedNewsIds.push(newsPieceId);
  });

  setLocalData({localData});
}

shareRecentNews();