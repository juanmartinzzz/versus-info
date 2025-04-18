const telegram = {
  botInformation: {
    tokenPart1: process.env.VITE_TELEGRAM_BOT_TOKEN_PART1,
    tokenPart2: process.env.VITE_TELEGRAM_BOT_TOKEN_PART2,
    mainChatId: process.env.VITE_TELEGRAM_MAIN_CHAT_ID,
  },
  getToken: () => {
    const hash = process.env.VITE_TELEGRAM_HASH;

    return `${telegram.botInformation.tokenPart1.replace(hash, '')}:${telegram.botInformation.tokenPart2.replace(hash, '')}`;
  },
  sendMessage: async ({message}) => {
    const response = await fetch(`https://api.telegram.org/bot${telegram.getToken()}/sendMessage?chat_id=${telegram.botInformation.mainChatId}&text=${encodeURIComponent(message)}`, {
      method: 'GET',
    });

    return response.json();
  },
  getUpdates: async () => {
    const response = await fetch(`https://api.telegram.org/bot${telegram.getToken()}/getUpdates`, {
      method: 'GET',
    });

    return response.json();
  },
};

export default telegram;
