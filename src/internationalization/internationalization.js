/*
  receive a JSON object like:

  {
    something: {
      en: 'something',
      es: 'algo',
      fr: 'quelque chose',
    },
    somethingElse: {
      en: 'something else',
      es: 'algo más',
      fr: 'autre chose',
    },
  }

  return object with string values on language code set in Local Storage like:
  {
    something: 'something',
    somethingElse: 'something else',
  }
*/
const inter = ({texts}) => {
  const result = {};

  Object.keys(texts).forEach((key) => {
    result[key] = texts[key][localStorage.getItem('languageCode')];
  });

  return result;
};

/// Header
const header = {
  testYourNewsKnowledge: {
    en: 'Test your news knowledge!',
    es: 'Cuánto sabes de noticias?',
  },
};

/// Interactions
const interactions = {
  clickToCopy: {
    en: 'Click to copy',
    es: 'Haz click para copiar',
  },
  previous: {
    en: 'Previous',
    es: 'Volver',
  },
  next: {
    en: 'Next',
    es: 'Siguiente',
  },
  nextQuestion: {
    en: 'Next Question',
    es: 'Siguiente Pregunta',
  },
};

// Results screen
const resultsScreen = {
  shareResults: {
    en: 'Share your score',
    es: 'Comparte tu puntaje',
  },
  quizComplete: {
    en: "You're done with today's questions!",
    es: 'Terminaste las preguntas de hoy!',
  },
  shareTodaysQuestionsWithSomeone: {
    en: 'Share today\'s questions with someone',
    es: 'Comparte hoy las preguntas con alguien',
  },
  perfectScoreYoureUpToDate: {
    en: '🏆 Perfect Score - you\'re up to date!',
    es: '🏆 Puntaje perfecto - estás totalmente al día!',
  },
  wellDoneYoureKeepingUpWithMostNews: {
    en: '👏 Well done - you\'re keeping up with most news',
    es: '👏 Bien - estás al tanto de la mayoría de las noticias',
  },
  lookAtItThisWayNowYoureMoreInformed: {
    en: '👀 Look at it this way - now you\'re more informed!',
    es: '👀 Míralo de esta manera - ahora estás mejor informado!',
  },
}

const allGlobalTexts = {
  ...header,
  ...interactions,
  ...resultsScreen,
};

// Helper to temporarily import and check property names and then remove
const helperGlobalTexts = allGlobalTexts;

const internationalization = {
  getTranslated: () => inter({texts: allGlobalTexts}),
}

/// How to use
/*
Import and declare a const with translated texts
const translated = internationalization.getTranslated();

Reference specific texts and expect a string back
translated.tellFriendsAndFamily;
*/

export { internationalization, helperGlobalTexts };