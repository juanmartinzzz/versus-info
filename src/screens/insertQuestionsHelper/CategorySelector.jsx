import { useState } from "react";
import { constants } from "../../data/constants";
import { internationalization } from "../../internationalization/internationalization";

const CategorySelector = ({ categoryId, index, editItem }) => {
  const translated = internationalization.getTranslated();
  const [shouldShowAllCategories, setShouldShowAllCategories] = useState(false);

  const activeCategories = constants.categories.filter(category => category.isActive);

  return (
    <div className="mb-2 w-full flex flex-wrap gap-1">
      {activeCategories.slice(0, shouldShowAllCategories ? 99 : 11)  .map((category) => (
        <div
          key={category.id}
          className={`rounded-full py-0 px-2 text-sm ${categoryId === category.id ? 'bg-accent1 text-white' : 'bg-gray-200'} cursor-pointer`}
          onClick={() => editItem({index, key: 'categoryId', value: category.id})}
        >
          <span>{translated[category.nameKey]}</span>
          <span className="ml-2">{category.defaultEmoji}</span>
        </div>
      ))}

      <button
        className="text-sm text-accent1 cursor-pointer"
        onClick={() => setShouldShowAllCategories(!shouldShowAllCategories)}
      >
        {shouldShowAllCategories ? 'Mostrar menos' : 'Mostrar más'}
      </button>
    </div>
  )
}

export default CategorySelector;