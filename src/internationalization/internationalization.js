import { constants } from "../data/constants";

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
    result[key] = texts[key][localStorage.getItem(constants.localStorageKeys.languageCode)];
  });

  return result;
};

/// Header
const header = {
  catchUpAndChallengeOthers: {
    en: 'Catch up and challenge others',
    es: 'Actualízate y desafía a otros',
  },
  newsFrom: {
    en: 'News from',
    es: 'Noticias de',
  },
  newQuestionsComingOn: {
    en: 'New questions coming on',
    es: 'Nuevas preguntas en',
  },
  hours: {
    en: 'hours',
    es: 'horas',
  },
  minutes: {
    en: 'minutes',
    es: 'minutos',
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
  moreInfo: {
    en: 'More info',
    es: 'Más información',
  },
  imageFrom: {
    en: 'Image from',
    es: 'Imagen de',
  },
};


/// Results screen
const resultsScreen = {
  myScoreTodayWas: {
    en: 'My score today was',
    es: 'Mi puntaje hoy fue',
  },
  myTotalIs: {
    en: 'My total was',
    es: 'Mi total fue',
  },
  playAndCatchUpWithTheNews: {
    en: 'Play and catch up with the news',
    es: 'Juega y entérate de las noticias',
  },
  canYouBeatMe: {
    en: 'Can you beat me?',
    es: 'Puedes superarme?',
  },
  shareResults: {
    en: 'Share your score',
    es: 'Comparte tu puntaje',
  },
  tapHereToChallengeOthers: {
    en: 'Tap here to challenge others',
    es: 'Toca aquí para desafiar a otros',
  },
  done: {
    en: "Done!",
    es: 'Listo!',
  },
  yourScoreTodayWas: {
    en: 'Your score today was',
    es: 'Tu puntaje hoy fue',
  },
  resultCopied: {
    en: 'Result copied 📋',
    es: 'Resultado copiado 📋',
  },
  pasteItOnAnyChatGroupToChallengeOthers: {
    en: 'Paste it on any chat group to challenge others',
    es: 'Pégalo en cualquier grupo de chat para desafiar a otros',
  },
  soTheyCanAlsoLearnAboutTopCurrentEvents: {
    en: 'So they can also learn about top current events',
    es: 'Y haz que también se enteren de las noticias más importantes',
  },
  useThisQrCodeToChallengeSomeoneInFrontOfYou: {
    en: 'Use this QR code to challenge someone in front of you',
    es: 'Usa este QR para desafiar a alguien frente a tí',
  },
  // perfectScoreYoureUpToDate: {
  //   en: '🏆 Perfect Score - you\'re impressively up to date with what\'s happening!',
  //   es: '🏆 Puntaje perfecto - estás totalmente al día con lo que está pasando!',
  // },
  // wellDoneYoureKeepingUpWithMostImportantCurrentEvents: {
  //   en: '👏 Well done - you\'re keeping up with most important current events',
  //   es: '👏 Bien - estás al tanto de muchos eventos importantes',
  // },
  // lookAtItThisWayNowYoureMoreInformed: {
  //   en: '👀 Look at it this way - now you\'re more informed!',
  //   es: '👀 Míralo de esta manera - ahora estás mejor informado!',
  // },
}


/// Categories
const categoryNames = {
  politics: {
    en: 'Politics',
    es: 'Política',
  },
  sports: {
    en: 'Sports',
    es: 'Deportes',
  },
  science: {
    en: 'Science',
    es: 'Ciencia',
  },
  technology: {
    en: 'Technology',
    es: 'Tecnología',
  },
  showbiz: {
    en: 'Showbiz',
    es: 'Farándula',
  },
  business: {
    en: 'Business',
    es: 'Negocios',
  },
  health: {
    en: 'Health',
    es: 'Salud',
  },
  climate: {
    en: 'Climate',
    es: 'Clima',
  },
  finance: {
    en: 'Finance',
    es: 'Finanzas',
  },
  art: {
    en: 'Art',
    es: 'Arte',
  },
  world: {
    en: 'World',
    es: 'Mundo',
  },
}


/// Send feedback
const sendFeedback = {
  shareYourFeedback: {
    en: 'Share Your Feedback',
    es: 'Comparte tus comentarios',
  },
  sendFeedback: {
    en: 'Send Feedback',
    es: 'Enviar comentarios',
  },
  weWouldLoveToHearYourSuggestions: {
    en: "We'd love to hear your suggestions...",
    es: 'Nos encantaría oir tus sugerencias...',
  },
  howCanWeContactYouOptional: {
    en: 'How can we contact you? (Optional)',
    es: '¿Cómo podemos contactarte? (Opcional)',
  },
  emailPhoneOrSocialMediaHandle: {
    en: 'Email, social media handle, phone - anything you want',
    es: 'Correo, usuario en redes sociales, teléfono - lo que quieras',
  },
  whatCouldWeDoToMakeYourExperienceBetter: {
    en: 'What could we do to make your experience better?',
    es: '¿Qué podríamos hacer para mejorar tu experiencia?',
  },
  thanksForWriting: {
    en: 'Thanks for writing',
    es: 'Gracias por escribirnos',
  },
  yourInputIsWhatHelpsUsImprove: {
    en: 'Your input is what helps us improve',
    es: 'Tus comentarios son lo que nos ayuda a mejorar',
  },
}


const allGlobalTexts = {
  ...header,
  ...interactions,
  ...sendFeedback,
  ...categoryNames,
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