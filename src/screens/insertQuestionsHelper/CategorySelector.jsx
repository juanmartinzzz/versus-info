import { constants } from "../../data/constants";
import { internationalization } from "../../internationalization/internationalization";

const CategorySelector = ({ categoryId, index, editItem }) => {
  const translated = internationalization.getTranslated();

  return (
    <div className="mb-2 w-full flex flex-wrap gap-1">
      {constants.categories.map((category) => (
        <div
          key={category.id}
          className={`rounded-full py-0 px-2 text-sm ${categoryId === category.id ? 'bg-accent1 text-white' : 'bg-gray-200'} cursor-pointer`}
          onClick={() => editItem({index, key: 'categoryId', value: category.id})}
        >
          <span>{translated[category.nameKey]}</span>
          <span className="ml-2">{category.defaultEmoji}</span>
        </div>
      ))}
    </div>
  )
}

export default CategorySelector;