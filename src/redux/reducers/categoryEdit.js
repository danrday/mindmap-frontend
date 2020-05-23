const initialState = {
  name: null,
  radius: null,
  fontSize: null,
  checkedAttrs: [],
  newCategoryName: null,
  category: null,
  categories: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "categoryEdit/CHANGE_SELECTED_CATEGORY": {
      const cats = action.payload.categories;
      const cat = cats[action.payload.value];
      const checkedAttrs = Object.keys(cat);
      return {
        ...state,
        category: action.payload.value,
        checkedAttrs: checkedAttrs,
        ...cat
      };
    }
    case "categoryEdit/HANDLE_CHECKBOX_CHANGE": {
      return { ...state, checkedAttrs: action.payload };
    }
    case `categoryEdit/HANDLE_ATTRIBUTE_VALUE_CHANGE`: {
      const { key, value } = action.payload;
      return { ...state, [key]: value };
    }
    default:
      return state;
  }
};
