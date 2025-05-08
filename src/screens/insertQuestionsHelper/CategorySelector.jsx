import { useState } from "react";
import { constants } from "../../data/constants";
import { internationalization } from "../../internationalization/internationalization";

const CategorySelector = ({ categoryId, index, editItem, items }) => {
  const translated = internationalization.getTranslated();
  const [shouldShowAllCategories, setShouldShowAllCategories] = useState(false);

  const classNames = 'rounded-full py-0 px-2 text-sm cursor-pointer';
  const activeCategories = constants.categories.filter(category => category.isActive);
  const categoriesAlreadySelected = activeCategories.filter(category => items.some(item => item.categoryId === category.id));
  console.log({categoriesAlreadySelected});

  return (
    <div className="mb-2 w-full flex flex-wrap gap-1">
      {activeCategories.slice(0, shouldShowAllCategories ? 99 : 11)  .map(category => {
        const isAlreadySelected = categoriesAlreadySelected.some(c => c.id === category.id && c.id !== categoryId);

        return (
          <button
            key={category.id}
            disabled={isAlreadySelected}
            className={`${classNames} ${categoryId === category.id ? 'bg-accent1 text-white' : 'bg-gray-200'} disabled:opacity-20 disabled:cursor-not-allowed`}
            onClick={() => editItem({index, key: 'categoryId', value: category.id})}
          >
            <span>{translated[category.nameKey]}</span>
            <span className="ml-2">{category.defaultEmoji}</span>
          </button>
        )
      })}

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