const initialState = {
  selNodeId: null,
  name: null,
  radius: null,
  fontSize: null,
  checkedAttrs: [],
  newCategoryName: null,
  category: null,
  lockedNodes: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "SELECT_NODE":
      let value = null;
      if (action.payload === state.selNodeId) {
        value = null;
      } else {
        value = action.payload;
      }

      return {
        ...state,
        selNodeId: value
      };
    case "liveNodeEdit/POPULATE_CURRENT_NODE_VALUES": {
      console.log("populateCurrentNodeValues", action.payload);
      const { id, name, customAttrs, category } = action.payload;
      let custom = customAttrs;
      if (!customAttrs) {
        custom = {};
      }
      const checkedAttrs = Object.keys(custom) || [];
      if (category) checkedAttrs.push("category");
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
    case "liveNodeEdit/POPULATE_LOCKED_NODE_VALUES": {
      const { id, name, customAttrs, category } = action.payload;

      if (!state.lockedNodes[id]) {
        alert("no node found in lockedNodes to populate initial values");
      }
      const newLockedNodes = Object.assign({}, state.lockedNodes);

      let custom = customAttrs;
      if (!customAttrs) {
        custom = {};
      }
      const checkedAttrs = Object.keys(custom) || [];
      if (category) checkedAttrs.push("category");

      const selNode = {
        name: name,
        selNodeId: id,
        radius: custom.radius || null,
        fontSize: custom.fontSize || null,
        category: category || null,
        checkedAttrs: checkedAttrs
      };

      newLockedNodes[id] = selNode;

      return { ...state, lockedNodes: newLockedNodes };
    }
    case "liveNodeEdit/EDIT_NAME": {
      return { ...state, name: action.payload };
    }
    case "liveNodeEdit/CHANGE_SELECTED_CATEGORY": {
      console.log("action pay", action.payload);
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
    case "LOCK_NODE":
      const newLockedNodes = Object.assign({}, state.lockedNodes);
      const lockedNode = Object.keys(newLockedNodes).findIndex(
        n => n === action.payload
      );
      if (lockedNode === -1) {
        newLockedNodes[action.payload] = { checkedAttrs: [] };
      } else {
        delete newLockedNodes[action.payload];
      }
      console.log("WTF", action.payload);
      return {
        ...state,
        lockedNodes: newLockedNodes
      };
    case "liveNodeEdit/LOCKED_NODE_RADIUS": {
      const selNode = state.lockedNodes[action.addnl_payload];
      if (!selNode) {
        console.log("NO NODE", action);
        alert("no node found in lockedNodes to edit radius");
      }
      selNode.radius = action.payload;
      const newLockedNodes = Object.assign({}, state.lockedNodes);
      newLockedNodes[action.addnl_payload] = selNode;
      return { ...state, lockedNodes: newLockedNodes };
    }
    case "liveNodeEdit/LOCKED_NODE_CHECKBOX_CHANGE": {
      const selNode = state.lockedNodes[action.addnl_payload];
      if (!selNode) {
        console.log("NO NODE", action);
        alert("no node found in lockedNodes to edit radius");
      }
      selNode.checkedAttrs = action.payload;
      const newLockedNodes = Object.assign({}, state.lockedNodes);
      newLockedNodes[action.addnl_payload] = selNode;
      return { ...state, lockedNodes: newLockedNodes };
    }
    default:
      return state;
  }
};
