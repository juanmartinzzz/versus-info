import { useEffect, useState } from "react";
import supabase from "../integrations/supabase";
import { PlusIcon } from "lucide-react";

const defaultItems = [1,2,3,4,5].map(index => ({
  id: index,
  emoji: '',
  category: '',
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
    ]
  })
);

const tomorrowsDate = new Date(Date.now() + 86400000); // 86400000 ms in a day

const InsertQuestionsHelper = () => {
  const [relevantDate, setRelevantDate] = useState(tomorrowsDate.toISOString().split('T')[0]);
  const [error, setError] = useState(null);
  const [items, setItems] = useState(defaultItems);

  useEffect(() => {
    supabase.getRelevantQuestionByDate({date: relevantDate}).then(question => {
      if(question) {
        setItems(question.items);
      } else {
        setItems(defaultItems);
      }
    });
  }, [relevantDate]);

  const insertQuestion = () => {
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

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-4">Insert Questions Helper</h1>

      {/* Date picker */}
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
          <div key={index} className="flex flex-wrap p-4-md rounded-md shadow-md bg-white p-4">
            <div className="mb-2 w-[66%] flex flex-col">
              <span className="font-semibold leading-none">Category</span>

              <input
                type="text"
                value={items[index].category}
                onChange={({target}) => editItem({index, key: 'category', value: target.value})}
                className="px-2 py-1 border border-gray-300"
              />
            </div>

            <div className="mb-2 w-[33%] flex flex-col">
              <span className="font-semibold leading-none">Emoji</span>

              <input
                type="text"
                value={items[index].emoji}
                onChange={({target}) => editItem({index, key: 'emoji', value: target.value})}
                className="px-2 py-1 border border-gray-300"
              />
            </div>

            <div className="mb-2 w-full flex flex-col">
              <span className="font-semibold leading-none">Question</span>

              <textarea
                rows={4}
                value={items[index].text}
                onChange={({target}) => editItem({index, key: 'text', value: target.value})}
                className="px-2 py-1 border border-gray-300 leading-none"
              ></textarea>
            </div>

            {/* Three text inputs for the 3 possible answers to the question */}
            {Array.from({ length: 3 }, (_, answerIndex) => (
              <div key={answerIndex} className="mb-2 font-semibold w-[33%] flex flex-col">
                <span className="leading-none">Option {answerIndex + 1}</span>

                <input
                  type="text"
                  value={items[index].options[answerIndex].value}
                  onChange={({target}) => editItemOption({index, optionIndex: answerIndex, key: 'value', value: target.value})}
                  className="px-2 py-1 border border-gray-300 w-full"
                />

                {/* Checkbox to mark the answer as correct */}
                <div className="">
                  <span className="mr-2 leading-none">Correct</span>

                  <input
                    type="checkbox"
                    checked={items[index].options[answerIndex].correct}
                    onChange={({target}) => editItemOption({index, optionIndex: answerIndex, key: 'correct', value: target.checked})}
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>


      {/* Insert question to supabase */}
      <button className="mt-8 w-full flex items-center gap-2 bg-accent1 text-white px-4 py-2 rounded-md" onClick={insertQuestion} >
        <PlusIcon className="w-4 h-4" />
        Insert Question
      </button>
    </div>
  );
};

export default InsertQuestionsHelper;
