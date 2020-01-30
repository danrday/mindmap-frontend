const initialState = {
  selNodeId: null,
  name: null,
  radius: null,
  fontSize: null,
  checkedAttrs: [],
  newCategoryName: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "liveNodeEdit/POPULATE_CURRENT_NODE_VALUES": {
      const { id, name, customAttrs } = action.payload;

      let custom = customAttrs
      if (!customAttrs) {
        custom = {}
      }

      return {
        ...state,
        name: name,
        selNodeId: id,
        radius: custom.radius || null,
        fontSize: custom.fontSize || null
      };
    }
    case "liveNodeEdit/EDIT_NAME": {
      return { ...state, name: action.payload };
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
