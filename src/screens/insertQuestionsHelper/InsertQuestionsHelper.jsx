import time from "../../utils/time";
import { useEffect, useState } from "react";
import SectionHeader from "./SectionHeader";
import { Check, SaveIcon } from "lucide-react";
import CategorySelector from "./CategorySelector";
import supabase from "../../integrations/supabase";

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
  const [indexFocused, setIndexFocused] = useState(null);
  const [itemsSaved, setItemsSaved] = useState(defaultItems);
  const [relevantDate, setRelevantDate] = useState(tomorrowsDate);
  const textareaRows = { focused: 12, unfocused: 4 };

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
    setItemsSaved(items);

    supabase.upsertQuestion({
      question: {
        relevantDate,
        items
      }
    });
  }

  const editItem = ({index, key, value}) => {
    setItems(prevItems => {
      const newItems = [...prevItems];
      newItems[index] = {...newItems[index], [key]: value};
      return newItems;
    });
  }

  const editItemOption = ({index, optionIndex, key, value}) => {
    setItems(prevItems => {
      const newItems = [...prevItems];
      newItems[index].options[optionIndex] = {...newItems[index].options[optionIndex], [key]: value};
      return newItems;
    });
  }

  // Mark one and only one option per questionas correct
  const markCorrectAnswer = (index, optionIndex) => {
    // Unmark all other options of the current question being edited
    const newItems = items.map((item, itemIndex) => ({
      ...item,
      options: item.options.map((option, optionIndex) => ({
        ...option,
        correct: (itemIndex === index) ? false : option.correct
      }))
    }));
    newItems[index].options[optionIndex].correct = true;

    setItems(newItems);
  }

  return (
    <div className="p-4 md:p-8">
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
                <span className="font-semibold leading-none">Pregunta</span>

                <textarea
                  rows={indexFocused === index ? textareaRows.focused : textareaRows.unfocused}
                  value={items[index].text}
                  onChange={({target}) => editItem({index, key: 'text', value: target.value})}
                  onFocus={() => setIndexFocused(index)}
                  onBlur={() => setIndexFocused(null)}
                  className="px-2 py-0 border border-gray-300 leading-none"
                ></textarea>
              </div>

              {/* Three text inputs for the 3 possible answers to the question */}
              <div className="mb-8 w-full">
                {Array.from({ length: 3 }, (_, answerIndex) => (
                  <div key={answerIndex} className="mb-2 font-semibold w-full">
                    {/* Label and checkbox to mark answer as correct */}
                    <span className="leading-none">Opción {answerIndex + 1}</span>
                    <span className="ml-2 leading-none">Correcta</span>
                    <input
                      type="checkbox"
                      className="ml-2 w-5 h-5 text-accent1 border-gray-300 focus:ring-accent1 focus:ring-2"
                      checked={items[index].options[answerIndex].correct}
                      onChange={() => markCorrectAnswer(index, answerIndex)}
                    />

                    <input
                      type="text"
                      value={items[index].options[answerIndex].value}
                      onChange={({target}) => editItemOption({index, optionIndex: answerIndex, key: 'value', value: target.value})}
                      className="px-2 py-0 border border-gray-300 w-full"
                    />
                  </div>
                ))}
              </div>

              <SectionHeader title="Noticia que sale tras responder" />

              <div className="mb-2 w-full flex flex-col">
                <span className="font-semibold leading-none">Noticia muy resumida (todavía es necesario escribirla manualmente)</span>

                <textarea
                  rows={indexFocused === index ? textareaRows.focused : textareaRows.unfocused}
                  value={items[index].expandedInfo}
                  onChange={({target}) => editItem({index, key: 'expandedInfo', value: target.value})}
                  onFocus={() => setIndexFocused(index)}
                  onBlur={() => setIndexFocused(null)}
                  className="px-2 py-0 border border-gray-300 w-full leading-none"
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

      {/* Insert question to supabase */}
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

      {/* Textarea where the questions are displayed in JSON format */}
      <div className="mt-8">
        <span className="font-semibold leading-none">Questions in JSON format<br />(este campo es pa' jodas técnicas)</span>

        <textarea
          rows={textareaRows.unfocused}
          className="p-2 bg-white w-full leading-none"
          value={JSON.stringify(items, null, 2)}
          readOnly
        />
      </div>
    </div>
  );
};

export default InsertQuestionsHelper;
