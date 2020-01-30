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
      const params = action.payload;
      const { id } = action.payload;

      console.log("action.payload", action.payload);


      const edited = Object.assign({}, state.editedFile);

      let currSelNodeIndex = edited.nodes.findIndex(e => {
        return e.id === id;
      });


      edited.nodes[currSelNodeIndex].name = params.name

      edited.nodes[currSelNodeIndex].customAttrs = {}

      params.customAttrs.forEach(attr => {
        edited.nodes[currSelNodeIndex].customAttrs[attr] = params[attr]
      })


      // const nodeEdit = Object.assign(edited.nodes[currSelNodeIndex], params);
      //
      // edited.nodes[currSelNodeIndex] = nodeEdit;

      return {
        ...state,
        editedFile: edited
      };

    }
    case "ADD_ACTION":
      const eedited = Object.assign({}, state.file);

      const length = state.file.nodes.length;
      eedited.nodes.push({
        name: "new",
        id: length,
        index: length,
        x: 1091.2253543130957,
        y: 699.1031619851105,
        vy: 0.5153184447520401,
        vx: -0.7744626636014145
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
