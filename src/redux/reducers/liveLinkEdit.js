const initialState = {
  selLinkId: null,
  name: null,
  fontSize: null,
  checkedAttrs: ["name"],
  newCategoryName: null,
  category: null,
  lockedLinks: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "SELECT_LINK":
      let value = null;
      if (action.payload === state.selLinkId) {
        value = null;
      } else {
        value = action.payload;
      }

      return {
        ...state,
        selLinkId: value,
        checkedAttrs: [] //clear all live edit values, otherwise component updates referencing previous settings
      };
    case "liveLinkEdit/POPULATE_CURRENT_LINK_VALUES": {
      console.log("populateCurrentLinkValues", action.payload);
      const { id, customAttrs, category } = action.payload;
      let custom = customAttrs;
      if (!customAttrs) {
        custom = {};
      }
      const checkedAttrs = Object.keys(custom) || [];
      if (category) checkedAttrs.push("category");
      return {
        ...state,
        name: custom.name || null,
        selLinkId: id,
        fontSize: custom.fontSize || null,
        category: category || null,
        checkedAttrs: checkedAttrs
      };
    }
    case "liveLinkEdit/POPULATE_LOCKED_LINK_VALUES": {
      const { id, name, customAttrs, category } = action.payload;

      if (!state.lockedLinks[id]) {
        alert("no link found in lockedLinks to populate initial values");
      }
      const newLockedLinks = Object.assign({}, state.lockedLinks);

      let custom = customAttrs;
      if (!customAttrs) {
        custom = {};
      }
      const checkedAttrs = Object.keys(custom) || [];
      if (category) checkedAttrs.push("category");

      const selLink = {
        name: name,
        selLinkId: id,
        radius: custom.radius || null,
        fontSize: custom.fontSize || null,
        category: category || null,
        checkedAttrs: checkedAttrs
      };

      newLockedLinks[id] = selLink;

      return { ...state, lockedLinks: newLockedLinks };
    }
    case "liveLinkEdit/EDIT_NAME": {
      return { ...state, name: action.payload };
    }
    case "liveLinkEdit/CHANGE_SELECTED_CATEGORY": {
      console.log("action pay", action.payload);
      return { ...state, category: action.payload };
    }
    case "liveLinkEdit/CLEAR_TEMP_CUSTOM_ATTRS": {
      return { ...state, checkedAttrs: [] };
    }
    case "liveLinkEdit/HANDLE_CHECKBOX_CHANGE": {
      return { ...state, checkedAttrs: action.payload };
    }
    case "liveLinkEdit/EDIT_FONT_SIZE": {
      return { ...state, fontSize: action.payload };
    }
    case "liveLinkEdit/EDIT_NEW_CATEGORY_NAME": {
      return { ...state, newCategoryName: action.payload };
    }
    case "liveLinkEdit/SAVE_EDIT": {
      const { id, name } = action.payload;
      return { ...state, name: action.payload };
    }
    case "LOCK_LINK":
      const newLockedLinks = Object.assign({}, state.lockedLinks);
      const lockedLink = Object.keys(newLockedLinks).findIndex(
        n => n === action.addnl_payload
      );
      if (lockedLink === -1) {
        newLockedLinks[action.addnl_payload] = {
          checkedAttrs: ["name"]
        };
      } else {
        delete newLockedLinks[action.addnl_payload];
      }
      console.log("WTF", action.addnl_payload);
      return {
        ...state,
        lockedLinks: newLockedLinks
      };
    case "liveLinkEdit/LOCKED_LINK_RADIUS": {
      const selLink = state.lockedLinks[action.addnl_payload];
      if (!selLink) {
        console.log("NO LINK", action);
        alert("no link found in lockedLinks to edit radius");
      }
      selLink.radius = action.payload;
      const newLockedLinks = Object.assign({}, state.lockedLinks);
      newLockedLinks[action.addnl_payload] = selLink;
      return { ...state, lockedLinks: newLockedLinks };
    }
    case "liveLinkEdit/LOCKED_LINK_NAME": {
      const selLink = state.lockedLinks[action.addnl_payload];
      if (!selLink) {
        console.log("NO LINK", action);
        alert("no link found in lockedLinks to edit radius");
      }
      selLink.name = action.payload;
      const newLockedLinks = Object.assign({}, state.lockedLinks);
      newLockedLinks[action.addnl_payload] = selLink;
      return { ...state, lockedLinks: newLockedLinks };
    }
    case "liveLinkEdit/LOCKED_LINK_CHECKBOX_CHANGE": {
      const selLink = state.lockedLinks[action.addnl_payload];
      if (!selLink) {
        console.log("NO LINK", action);
        alert("no link found in lockedLinks to edit radius");
      }
      selLink.checkedAttrs = action.payload;
      const newLockedLinks = Object.assign({}, state.lockedLinks);
      newLockedLinks[action.addnl_payload] = selLink;
      return { ...state, lockedLinks: newLockedLinks };
    }
    default:
      return state;
  }
};
