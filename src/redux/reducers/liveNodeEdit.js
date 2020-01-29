const initialState = {
  selNodeId: null,
  name: null,
  radius: null,
  fontSize: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "liveNodeEdit/POPULATE_CURRENT_NODE_VALUES": {
      const { id, name, radius, fontSize } = action.payload;
      console.log("action payload", action.payload);
      return {
        ...state,
        name: name,
        selNodeId: id,
        radius: radius,
        fontSize: fontSize
      };
    }
    case "liveNodeEdit/EDIT_NAME": {
      return { ...state, name: action.payload };
    }
    case "liveNodeEdit/EDIT_FONT_SIZE": {
      return { ...state, fontSize: action.payload };
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
