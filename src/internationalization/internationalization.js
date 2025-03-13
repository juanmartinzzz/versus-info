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
  checkYourResults: {
    en: 'Check your results',
    es: 'Ir a resultados',
  },
};

// Results screen
const resultsScreen = {
  myScoreTodayWas: {
    en: 'My score today was',
    es: 'Mi puntaje hoy fue',
  },
  onVersusInfoCanYouBeatMe: {
    en: 'on Versus Info! Can you beat me?',
    es: 'en Versus Info! Puedes superarme?',
  },
  shareResults: {
    en: 'Share your score',
    es: 'Comparte tu puntaje',
  },
  youreDone: {
    en: "You're done!",
    es: 'Terminaste!',
  },
  yourScoreTodayWas: {
    en: 'Your score today was',
    es: 'Tu puntaje hoy fue',
  },
  shareTodaysQuestionsWithSomeone: {
    en: 'Share today\'s questions with someone',
    es: 'Comparte hoy las preguntas con alguien',
  },
  perfectScoreYoureUpToDate: {
    en: '🏆 Perfect Score - you\'re impressively up to date with what\'s happening!',
    es: '🏆 Puntaje perfecto - estás totalmente al día con lo que está pasando!',
  },
  wellDoneYoureKeepingUpWithMostImportantCurrentEvents: {
    en: '👏 Well done - you\'re keeping up with most important current events',
    es: '👏 Bien - estás al tanto de muchos eventos importantes',
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