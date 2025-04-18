import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import telegram from '../integrations/telegram.js';

const jsonStructureHelper = {
  id: '111',
  title: '',
  description: '',
  content: '',
  textInstructions: 'Text must be an interesting question crafted from the news article in the "title", "description" and "content" properties above',
  text: '222',
  optionsInstructions: 'Options must be a list of 3 phrases with crazy and DIFFERENT, DISTINCT alternative answers to the question posed in the "text" property above',
  options: [
    {
      value: '',
      correct: true
    },
    {
      value: '',
      correct: false
    },
    {
      value: '',
      correct: false
    }
  ],
  imageUrl: '',
  expandedInfoInstructions: 'Expanded info must be a short summary of the news article created based on the "title", "description" and "content" properties above',
  expandedInfo: '',
  newsArticleUrl: '',
}


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


/// Write a new file in the same directory as this Node.js script
const writeNewFile = ({fileName, content}) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const filePath = path.join(__dirname, fileName);
  fs.writeFileSync(filePath, content);
}


/// Main method
const processNews = async () => {
  const newsIdsProcessed = [];
  const localData = getLocalData();
  const telegramUpdates = await telegram.getUpdates();

  telegramUpdates.result.forEach(update => {
    const newsPieceId = update.message.text;
    if(localData.processedNewsIds.includes(newsPieceId)) {
      return;
    }

    const newsPiece = localData.previousNews[newsPieceId];
    if (!newsPiece) {
      return;
    }

    const fileContent = {
      ...jsonStructureHelper,
      title: newsPiece.title,
      content: newsPiece.content,
      description: newsPiece.description,
      newsArticleUrl: newsPiece.url,
      imageUrl: newsPiece.urlToImage,
    };

    writeNewFile({fileName: `${newsPieceId}.json`, content: JSON.stringify(fileContent, null, 2)});

    // Add to processed news ids
    localData.processedNewsIds.push(newsPieceId);
    newsIdsProcessed.push(newsPieceId);
    setLocalData({localData});
  });

  console.log(`Total news processed: ${newsIdsProcessed.length}`);
}

processNews();