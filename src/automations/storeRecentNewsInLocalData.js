import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const configs = {
    freeNewsApiKey: process.env.VITE_FREE_NEWS_API_KEY,
    freeNewsApiUrl: process.env.VITE_FREE_NEWS_API_URL,
    newsApiKey: process.env.VITE_NEWS_API_KEY,
    newsApiTopHeadlinesUrl: process.env.VITE_NEWS_API_TOP_HEADLINES_URL,
}


/// Call external API to get recent news
const getRecentNews = async () => {
    // Adding query parameters for pagination and sorting
    const params = new URLSearchParams({
      apiKey: configs.newsApiKey,
      country: 'us',
    });

    const response = await fetch(`${configs.newsApiTopHeadlinesUrl}?${params.toString()}`, {
        method: 'GET',
    });

    const data = await response.json();

    return data;
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


/// Main method
const storeRecentNewsInLocalData = async () => {
    const localData = getLocalData();
    const news = await getRecentNews();
    const newsIdsStoredLocally = [];
    console.log(`Total news articles received from API: ${news.articles.length}`);

    news.articles.map(newsPiece => {
      const uniqueId = Math.random().toString(36).substring(2, 15);

      // Check if item.title is already present in localData.previousNews object's items titles
      const isNewsPieceAlreadyStoredLocally = Object.keys(localData.previousNews).some(previousNewsPieceKey => localData.previousNews[previousNewsPieceKey].title === newsPiece.title);

      if(!isNewsPieceAlreadyStoredLocally) {
        localData.previousNews[uniqueId] = newsPiece;
        newsIdsStoredLocally.push(uniqueId);
      }
    });

    setLocalData({localData});
    console.log(`New articles stored locally: ${newsIdsStoredLocally.length}`);
}

storeRecentNewsInLocalData();
