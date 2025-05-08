import { CopyIcon } from "lucide-react";
import openai from "../../integrations/openai";

const SuggestedAlternativeAnswers = ({index, items, editItem}) => {
  return (
    <>
      <div className="px-2 text-sm leading-none text-center flex justify-center items-center">
        Solo después de haber escrito la pregunta y la respuesta correcta, se activa este botón para pedirle cacao al modelo
      </div>

      <div className="mt-4 w-full flex justify-center items-center">
        <button
          disabled={!items[index].text || !items[index].correctAnswer}
          className="bg-accent1 text-white px-4 py-2 rounded-full shadow-md cursor-pointer disabled:opacity-50"
          onClick={() => openai.getCompletedQuestionAndResponses({question: items[index].text, correctAnswer: items[index].options[0].value}).then(completedQuestionAndResponses => {
            editItem({index, key: `suggestedIncorrectAnswers`, value: completedQuestionAndResponses.alternativeAnswers});
          })}>
          Generar 🙏
        </button>
      </div>

      {/* Suggested responses */}
      {items[index].suggestedIncorrectAnswers?.map((response, index) => (
        response.es && (
          <div key={index} className="mt-4 w-full flex justify-between items-center gap-2 hover:bg-gray-100 p-2 rounded-md">
            <span className="text-sm leading-none">{response.es}</span>
            <button onClick={() => navigator.clipboard.writeText(response.es)} className="cursor-pointer">
              <CopyIcon size={24} className="text-accent1" />
            </button>
          </div>
        )
      ))}
    </>
  );
};

export default SuggestedAlternativeAnswers;