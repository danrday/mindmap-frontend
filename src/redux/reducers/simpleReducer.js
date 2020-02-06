const initialState = {
  file: null,
  currentNode: null,
  fetching: false,
  error: null,
  result: null,
  editedFile: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "file/FETCH_FILE_ERROR":
      return { ...state, error: action.payload, fetching: false };
    case "file/UPDATE_FILE":
      return { ...state, file: action.payload };
    case "file/FETCH_FILE":
      return { ...state, fetching: true };
    case "file/FETCH_FILE_RECEIVED":
      return {
        ...state,
        file: action.payload,
        editedFile: action.payload,
        fetching: false
      };
    case "SIMPLE_ACTION":
      return {
        ...state,
        result: action.payload
      };
    case "HANDLE_ZOOM":

      let gSettings = state.editedFile.globalSettings || {}

      gSettings.zoom = action.payload

        let updatedFile = state.editedFile
        updatedFile.globalSettings = gSettings

      return {
        ...state,
        editedFile: updatedFile
      };
    case "SAVE_NAME_CHANGE_ACTION":
      const edited = Object.assign({}, state.file);
      const nodeEdit = edited.nodes[state.currentNode];
      nodeEdit.name = action.payload;
      edited.nodes[state.currentNode] = nodeEdit;
      return {
        ...state,
        editedFile: edited
      };
    case "SAVE_ACTION":
      return {
        ...state,
        editedFile: action.payload
      };
    case "SAVE_EDIT": {
      const { liveNodeEdit, customAttrs } = action.payload;
      const changes = customAttrs
      const edited = Object.assign({}, state.editedFile);
      let currSelNodeIndex = edited.nodes.findIndex(e => {
        return e.id === liveNodeEdit.selNodeId;
      });
      edited.nodes[currSelNodeIndex].name = liveNodeEdit.name
      edited.nodes[currSelNodeIndex].customAttrs = {}
      if (changes.includes('newCategoryName')) {
        if (!edited.categories) {
          edited.categories = {}
        }
        edited.categories[liveNodeEdit.newCategoryName] = {}
        changes.forEach(attr => {
          edited.categories[liveNodeEdit.newCategoryName][attr] = liveNodeEdit[attr]
        })
        edited.categories[liveNodeEdit.newCategoryName].category = liveNodeEdit.newCategoryName
        edited.nodes[currSelNodeIndex].category = liveNodeEdit.newCategoryName
      } else {
      changes.forEach(attr => {
        if (attr === 'category') {
          edited.nodes[currSelNodeIndex].category = liveNodeEdit.category
        }
          edited.nodes[currSelNodeIndex].customAttrs[attr] = liveNodeEdit[attr]
        })
      }
      return {
        ...state,
        editedFile: edited
      };
    }
    case "SAVE_CATEGORY_EDIT":

      const {currentCats, currCatName, newCatName} = action.payload

      let updated = state.editedFile
        updated.categories = currentCats

        updated.nodes.forEach(node => {
          if (node.category === currCatName) {
            node.category = newCatName
          }
        })

      return {
        ...state,
        editedFile: updated
      };
    case "ADD_ACTION":
      const eedited = Object.assign({}, state.file);
      const length = state.file.nodes.length;

      console.log('ADD ACTION: ', action.payload)
      // 480 181
      eedited.nodes.push({
        name: "new",
        id: length,
        index: length,
        x: (50 - action.payload.x)/action.payload.k,
        y:  (50 - action.payload.y)/action.payload.k,
        vy: 0,
        vx: 0,
        sticky: 'f',
        fx: (50 - action.payload.x)/action.payload.k,
        fy: (50 - action.payload.y)/action.payload.k,
      });
      return {
        ...state,
        editedFile: eedited
      };
    case "SELECT_NODE":
      return {
        ...state,
        currentNode: action.payload
      };
    case "file/POST_FILE_ERROR":
      return { ...state, error: action.payload, fetching: false };
    default:
      return state;
  }
};
