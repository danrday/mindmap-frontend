const initialState = {
  selNodeId: null,
  name: null,
  radius: null,
  fontSize: null,
  checkedAttrs: [],
  newCategoryName: null,
  category: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "liveNodeEdit/POPULATE_CURRENT_NODE_VALUES": {
      console.log('populateCurrentNodeValues', action.payload)
      const { id, name, customAttrs, category } = action.payload;
      let custom = customAttrs
      if (!customAttrs) {
        custom = {}
      }

      const checkedAttrs = Object.keys(custom) || []
      if (category) checkedAttrs.push('category')
      return {
        ...state,
        name: name,
        selNodeId: id,
        radius: custom.radius || null,
        fontSize: custom.fontSize || null,
        category: category || null,
        checkedAttrs: checkedAttrs
      };
    }
    case "liveNodeEdit/EDIT_NAME": {
      return { ...state, name: action.payload };
    }
    case "liveNodeEdit/CHANGE_SELECTED_CATEGORY": {
      console.log('action pay', action.payload)
      return { ...state, category: action.payload };
    }
    case "liveNodeEdit/CLEAR_TEMP_CUSTOM_ATTRS": {
      return { ...state, checkedAttrs: [] };
    }
    case "liveNodeEdit/HANDLE_CHECKBOX_CHANGE": {
      return { ...state, checkedAttrs: action.payload };
    }
    case "liveNodeEdit/EDIT_FONT_SIZE": {
      return { ...state, fontSize: action.payload };
    }
    case "liveNodeEdit/EDIT_NEW_CATEGORY_NAME": {
      return { ...state, newCategoryName: action.payload };
    }
    case "liveNodeEdit/EDIT_RADIUS": {
      return { ...state, radius: action.payload };
    }
    case "liveNodeEdit/SAVE_EDIT": {
      const { id, name } = action.payload;
      return { ...state, name: action.payload };
    }
    default:
      return state;
  }
};
