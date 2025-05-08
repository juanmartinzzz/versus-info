import time from "../../utils/time";
import { useEffect, useState } from "react";
import SectionHeader from "./SectionHeader";
import { Check, SaveIcon } from "lucide-react";
import CategorySelector from "./CategorySelector";
import supabase from "../../integrations/supabase";
import SuggestedAlternativeAnswers from "./SuggestedAlternativeAnswers";

const defaultItems = [1,2,3,4,5].map(index => ({
  id: `${index}`,
  emoji: '',
  category: '',
  categoryId: '',
  text: '',
  options: [
    {
      value: '',
      correct: false
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
  correctAnswer: '',
  incorrectAnswer1: '',
  incorrectAnswer2: '',
  suggestedIncorrectAnswers: [
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
  ],
  newsArticleUrl: '',
  expandedInfo: '',
  videoEmbed: '',
  imageUrl: '',
  })
);

const tomorrowsDate = time.getTomorrowDateWithoutTimeString();

const QuickDatePicker = ({ relevantDate, setRelevantDate }) => {
  const dates = [
    {
      label: 'Today',
      date: time.getDateWithoutTimeString()
    },
    {
      label: 'Tomorrow',
      date: time.getTomorrowDateWithoutTimeString()
    },
    {
      label: 'Day After Tomorrow',
      date: (new Date(time.getCurrentUtcDateTimeMinus5Hours().getTime() + 2 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
    }
  ]

  return (
    <div className="mb-4">
      {dates.map((date, index) => (
        <button className={`mr-2 p-1 px-4 text-white text-xs rounded-full cursor-pointer ${date.date === relevantDate ? 'bg-accent1' : 'bg-gray-400'}`}  onClick={() => setRelevantDate(date.date)} key={index}>
          {date.label}
        </button>
      ))}
    </div>
  )
}

const DirectJsonInput = ({index, editItem}) => {
  const [value, setValue] = useState('');

  // Edit any matching properties in JSON given by User
  useEffect(() => {
    try {
      const json = JSON.parse(value);
      ['text', 'options', 'expandedInfo', 'newsArticleUrl', 'videoEmbed', 'imageUrl'].forEach(key => {
        if(json[key]) {
          editItem({index, key, value: json[key]});
        }
      });
    } catch (e) {}
  }, [value]);

  return (
    <div>
      <textarea rows={1} className="w-full text-xs" value={value} onChange={({target}) => setValue(target.value)} />
    </div>
  )
}

const InsertQuestionsHelper = () => {
  const [error, setError] = useState(null);
  const [items, setItems] = useState(defaultItems);
  const [itemsSaved, setItemsSaved] = useState(defaultItems);
  const [relevantDate, setRelevantDate] = useState(tomorrowsDate);

  useEffect(() => {
    supabase.getRelevantQuestionByDate({date: relevantDate}).then(question => {
      if(question) {
        setItems(question.items);
      } else {
        setItems(defaultItems);
      }
    });
  }, [relevantDate]);

  const saveQuestions = () => {
    const itemsToSave = items.map(item => ({
      ...item,
      options: [
        {
          value: item.incorrectAnswer1,
          correct: false
        },
        {
          value: item.correctAnswer,
          correct: true
        },
        {
          value: item.incorrectAnswer2,
          correct: false
        }
      ].sort((a, b) => Math.random() > 0.5 ? -1 : 1)
    }));
    setItems(itemsToSave);
    setItemsSaved(itemsToSave);

    supabase.upsertQuestion({
      question: {
        relevantDate,
        items: itemsToSave
      }
    });
  }

  const editItem = ({index, key, value}) => {
    // If editing a video, replace instances of "watch?v=" with "embed/"
    if(key === 'videoEmbed') {
      value = value.replace('watch?v=', 'embed/').replace('shorts/', 'embed/');
    }

    setItems(prevItems => {
      const newItems = [...prevItems];
      newItems[index] = {...newItems[index], [key]: value};
      return newItems;
    });
  }

  const textareaClasses = 'w-full pb-1 border-b-2 border-gray-600 leading-none focus:outline-none field-sizing-content';

  return (
    <div className="p-4 md:p-8">
      {/* <div className="max-h-[256px] overflow-y-scroll p-4 bg-white text-[9px] font-mono whitespace-pre-wrap">
        {JSON.stringify(items, null, 2)}
      </div> */}
      <h1 className="text-2xl font-bold mb-4">Insert Questions Helper</h1>

      {/* Date picker */}
      <QuickDatePicker relevantDate={relevantDate} setRelevantDate={setRelevantDate}/>

      <input type="date" value={relevantDate} onChange={({target}) => setRelevantDate(target.value)} className="p-2 bg-white border border-gray-300 w-full" />

      {/* Error message */}
      {error && (
        <div className="mt-2 p-2 border border-red-300 bg-red-100 text-red-700">
          <p id="error-message" className="text-sm">{error}</p>
        </div>
      )}

      {/* Inputs for category and then questino text, for questions 1 through 5 */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">

        {Array.from({ length: 5 }, (_, index) => (
          <div key={index}>
            <div className="mb-2 text-3xl font-bold leading-none">
              {index + 1}
            </div>

            <div className="flex flex-wrap p-4-md rounded-md shadow-md bg-white p-4">
              <SectionHeader title="Pregunta y opciones de respuesta" />

              <CategorySelector categoryId={items[index].categoryId} index={index} editItem={editItem} />

              <div className="mb-2 w-full flex flex-col">
                <span className="font-bold text-center">Pregunta</span>

                <textarea
                  rows={1}
                  value={items[index].text}
                  className={textareaClasses}
                  onChange={({target}) => editItem({index, key: 'text', value: target.value})}
                ></textarea>
              </div>

              {/* Three text inputs for the 3 possible answers to the question */}
              <div className="mb-8 w-full">
                <div className="mt-2 font-bold text-accent2 text-center">Opción correcta</div>
                <textarea
                  className={textareaClasses} rows={1}
                  value={items[index].correctAnswer} onChange={({target}) => editItem({index, key: 'correctAnswer', value: target.value})}
                ></textarea>

                <div className="mt-2 font-bold text-danger text-center">Opciones incorrectas</div>
                <textarea
                  placeholder="Respuesta incorrecta 1"
                  className={textareaClasses} rows={1}
                  value={items[index].incorrectAnswer1}
                  onChange={({target}) => editItem({index, key: 'incorrectAnswer1', value: target.value})}
                ></textarea>
                <textarea
                  placeholder="Respuesta incorrecta 2"
                  className={`${textareaClasses} mt-2`} rows={1}
                  value={items[index].incorrectAnswer2}
                  onChange={({target}) => editItem({index, key: 'incorrectAnswer2', value: target.value})}
                ></textarea>
              </div>

              <SectionHeader title="Pedirle inspiración a chatyipiti" />

              <div className="mb-8">
                <SuggestedAlternativeAnswers index={index} items={items} editItem={editItem} />
              </div>

              <SectionHeader title="Noticia que sale tras responder" />

              <div className="mb-2 w-full flex flex-col">
                <span className="font-semibold leading-none">Noticia muy resumida (todavía es necesario escribirla manualmente)</span>

                <textarea
                  rows={1}
                  value={items[index].expandedInfo}
                  onChange={({target}) => editItem({index, key: 'expandedInfo', value: target.value})}
                  className={textareaClasses}
                />
              </div>

              <div className="mb-2 w-full flex flex-col">
                <span className="font-semibold leading-none">URL de la noticia</span>

                <input
                  type="text"
                  value={items[index].newsArticleUrl}
                  onChange={({target}) => editItem({index, key: 'newsArticleUrl', value: target.value})}
                  className="px-2 py-0 text-sm border border-gray-300 w-full"
                />
              </div>

              {/* Video embed preview and input */}
              <div className="w-[50%]">
                <div className="w-full flex flex-col">
                  <span className="font-semibold leading-none">URL de un video</span>

                  <input
                    type="text"
                    value={items[index].videoEmbed}
                    onChange={({target}) => editItem({index, key: 'videoEmbed', value: target.value})}
                    className="px-2 py-0 text-sm border border-gray-300 w-full"
                  />
                </div>

                <div className="mb-2 w-full h-24 flex flex-col overflow-hidden">
                  <iframe src={items[index].videoEmbed} className="w-full h-96" />
                </div>
              </div>

              {/* Image preview and input */}
              <div className="w-[50%]">
                <div className="mb-2 w-full flex flex-col">
                  <span className="font-semibold leading-none">URL de una imagen</span>

                  <input
                    type="text"
                    value={items[index].imageUrl}
                    onChange={({target}) => editItem({index, key: 'imageUrl', value: target.value})}
                    className="px-2 py-0 text-sm border border-gray-300 w-full"
                  />
                </div>

                <div className="mb-2 w-full h-24 flex flex-col overflow-hidden">
                  <img src={items[index].imageUrl} className="w-full h-full object-contain" />
                </div>
              </div>
            </div>

            {/* Special JSON input */}
            <DirectJsonInput index={index} editItem={editItem} />
          </div>
        ))}
      </div>

      {/* Insert OpenAI API key */}
      {!localStorage.getItem('openaiApiKey') && (
        <div className="mt-8">
          <input
            type="text"
            value={localStorage.getItem('openaiApiKey') || ''}
            className="p-2 bg-white border border-gray-300 w-full"
            onChange={({target}) => {localStorage.setItem('openaiApiKey', target.value); window.location.reload(); }}
            placeholder="OpenAI API key -- aquí va la clave que activa la función de pedirle inspiración a chatyipiti"
          />
        </div>
      )}

      {/* Insert questions to supabase */}
      <div className="mt-8 fixed bottom-[32px] right-[32px]">
        <button className="flex items-center gap-2 bg-accent1 text-white font-bold px-4 py-2 rounded-md shadow-md cursor-pointer" onClick={saveQuestions} >
          {JSON.stringify(items) === JSON.stringify(itemsSaved) ?
            <>
              <Check className="w-6 h-6" />
              <span>Saved</span>
            </>
          :
            <>
              <SaveIcon className="w-6 h-6" />
              <span>Save Questions</span>
            </>
          }
        </button>
      </div>
    </div>
  );
};

export default InsertQuestionsHelper;
