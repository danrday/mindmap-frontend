import uuidv4 from "uuid/v4";

export const dragNode = msg => dispatch => {
  dispatch({
    type: "file/DRAG_NODE",
    payload: msg
  });
};

export const document = channel => dispatch => {
  channel
    .push("get_file")
    .receive("ok", msg => {
      dispatch({
        type: "file/UPDATE_FILE",
        payload: msg.file
      });
      dispatch({
        type: "file/FETCH_FILE_RECEIVED",
        payload: msg.file
      });
      dispatch({
        type: "globalEdit/POPULATE_INITIAL_VALUES",
        payload: msg.file.globalSettings
      });
    })
    .receive("error", e => {
      dispatch({
        type: "file/FETCH_FILE_ERROR",
        payload: e
      });
    });
};

export const saveAction = file => dispatch => {
  dispatch({
    type: "SAVE_ACTION",
    payload: file
  });
};

export const addAction = zoomLevel => dispatch => {
  const id = uuidv4();

  dispatch({
    type: "ADD_ACTION",
    payload: { id, zoomLevel }
  });
  dispatch({
    type: "SELECT_NODE",
    payload: id
  });
  dispatch({
    type: "liveNodeEdit/POPULATE_CURRENT_NODE_VALUES",
    payload: { id: id, name: "New", customAttrs: null, category: null }
  });
  dispatch({
    type: "UI_SELECT_PAGE",
    payload: 2
  });
};

export const saveEdits = edits => dispatch => {
  dispatch({
    type: "SAVE_EDIT",
    payload: edits
  });
};

export const deleteAction = () => dispatch => {
  dispatch({
    type: "DELETE_ACTION",
    payload: ""
  });
};

export const saveNameChangeAction = text => dispatch => {
  dispatch({
    type: "SAVE_NAME_CHANGE_ACTION",
    payload: text
  });
};

export const selectNode = node => dispatch => {
  dispatch({
    type: "SELECT_NODE",
    payload: node,
    broadcast: "LOCK_NODE"
  });
};

export const handleMouseMove = coords => dispatch => {
  dispatch({
    type: "HANDLE_MOUSE_MOVE",
    payload: coords
  });
};

export const linkNode = node => dispatch => {
  dispatch({
    type: "SELECT_AND_LINK_NODE",
    payload: node
  });
};

export const postAction = (file, channel) => dispatch => {
  file.links.forEach(obj => {
    obj.source = obj.source.id;
    obj.target = obj.target.id;
  });
  channel
    .push("save_file", file)
    .receive("ok", msg => {
      dispatch({
        type: "SHOW_ALERT_MESSAGE",
        payload: {
          show: true,
          msg: "Saved!",
          type: "success"
        }
      });
    })
    .receive("error", e => {
      dispatch({
        type: "file/POST_FILE_ERROR",
        payload: e
      });
    });
};

export const saveCategoryEdit = edits => dispatch => {
  dispatch({
    type: `SAVE_CATEGORY_EDIT`,
    payload: edits
  });
};

export const saveDefaultsEdit = edits => dispatch => {
  dispatch({
    type: `SAVE_DEFAULTS_EDIT`,
    payload: edits
  });
};

export const handleZoom = zoomAttrs => dispatch => {
  dispatch({
    type: `HANDLE_ZOOM`,
    payload: zoomAttrs
  });
};
