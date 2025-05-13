import OpenAI from "openai";

const openaiClient = new OpenAI({
  // Get apiKey value from local storage
  apiKey: localStorage.getItem('openaiApiKey'),
  dangerouslyAllowBrowser: true,
});

const openai = {
  generateText: async ({prompt}) => {
    const response = await openaiClient.responses.create({
      model: 'gpt-4.1-mini',
      input: prompt,
    });
    console.log({response});
    return response;
  },
  /**
   * @param {string} question
   * @param {string} correctAnswer
   * @returns {Promise<{question: {en: string, es: string}, correctAnswer: {en: string, es: string}, responses: {en: string, es: string}[]}[]>}
   */
  getCompletedQuestionAndResponses: async ({question, correctAnswer}) => {
    console.log({question, correctAnswer});
    const prompt = `
    Please complete the following JSON structure by filling in the missing string values.
    Your response MUST only include the valid JSON structure, nothing else.
    Your response MUST be immediately parsed using javascript's JSON.parse() method without generating any errors.
    For the 'alternativeAnswers' array, please generate 6 plausible, believable and a bit outlandish alternative answers that may confuse someone who's trying to answer the question.
    The alternative answers must each be of a different general topic.
    The alternative answers must be different from the correct answer.
    The alternative answers must be similar in length to the correct answer.
    If the correct answer contains a number or metric, tend to generate alternative answers that also contain a number or metric of different orders of magnitude.
    {
      question: {
        en: '',
        es: '${question}',
      },
      correctAnswer: {
        en: '',
        es: '${correctAnswer}',
      },
      alternativeAnswers: [
        {
          en: '',
          es: '',
        },
        {
          en: '',
          es: '',
        },
        {
          en: '',
          es: '',
        },
        {
          en: '',
          es: '',
        },
        {
          en: '',
          es: '',
        },
        {
          en: '',
          es: '',
        },
      ]
    }
    `;
    const response = await openai.generateText({prompt});
    const outputText = response.output_text;
    // strip output text of any characters that are not part of the JSON structure
    const jsonString = outputText.replace(/^```$/, '').replace(/^```json\n/, '').replace(/\n```$/, '');
    console.log({jsonString});
    return JSON.parse(jsonString);
  }
};

export default openai;
