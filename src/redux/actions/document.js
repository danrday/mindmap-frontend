import uuidv4 from "uuid/v4";
import cloneDeep from "lodash.clonedeep";

export const dragNode = msg => dispatch => {
  dispatch({
    type: "file/DRAG_NODE",
    payload: msg
  });
};

export const saveTextFile = ({ text, selNodeId }) => dispatch => {
  dispatch({
    type: "document/SAVE_TEXT_FILE",
    payload: { text, selNodeId }
  });
};

export const document = channel => dispatch => {
  channel
    .push("get_file")
    .receive("ok", msg => {
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
    type: "liveNodeEdit/POPULATE_CURRENT_NODE_VALUES",
    payload: {
      id: id,
      customAttrs: { name: "NEW" },
      category: null
    },
    broadcast: "LOCK_NODE",
    addnl_payload: id
  });
  dispatch({
    type: "UI_SELECT_PAGE",
    payload: 1
  });
};

export const addNodeAtCoords = coords => dispatch => {
  const id = uuidv4();

  dispatch({
    type: "ADD_NODE_AT_COORDS",
    payload: { id, coords }
  });
  dispatch({
    type: "liveNodeEdit/POPULATE_CURRENT_NODE_VALUES",
    payload: {
      id: id,
      customAttrs: { name: null },
      category: null
    },
    broadcast: "LOCK_NODE",
    addnl_payload: id
  });
};

export const saveEdits = edits => dispatch => {
  dispatch({
    type: "SAVE_EDIT",
    payload: edits
  });
};

export const deleteAction = nodeId => dispatch => {
  console.log("NODE ID", nodeId);
  dispatch({
    type: "SELECT_NODE",
    payload: nodeId,
    broadcast: "LOCK_NODE",
    addnl_payload: nodeId
  });
  dispatch({
    type: "DELETE_ACTION",
    payload: nodeId
  });
};

export const saveNameChangeAction = text => dispatch => {
  dispatch({
    type: "SAVE_NAME_CHANGE_ACTION",
    payload: text
  });
};

export const linkNode = node => dispatch => {
  dispatch({
    type: "SELECT_AND_LINK_NODE",
    payload: node
  });
};

export const postAction = (file, channel) => dispatch => {
  let editedFile = cloneDeep(file);
  console.log("editedFile", editedFile);
  // let editedLinks = Object.assign([], file.links);
  // we need to do the following for d3 to correctly re-load the file...
  // don't fully understand why or if there is another way to do do this
  editedFile.links.forEach(obj => {
    obj.source = obj.source.id;
    obj.target = obj.target.id;
  });
  channel
    .push("save_file", editedFile)
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
