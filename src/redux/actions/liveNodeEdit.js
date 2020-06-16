export const populateCurrentNodeValues = vals => dispatch => {
  dispatch({
    type: "liveNodeEdit/POPULATE_CURRENT_NODE_VALUES",
    payload: vals,
    broadcast: "liveNodeEdit/POPULATE_LOCKED_NODE_VALUES"
  });
};

export const editNodeValue = (key_and_value, addnl_payload) => dispatch => {
  dispatch({
    type: `liveNodeEdit/HANDLE_ATTRIBUTE_VALUE_CHANGE`,
    payload: key_and_value,
    addnl_payload: addnl_payload,
    broadcast: `liveNodeEdit/HANDLE_LOCKED_ATTRIBUTE_VALUE_CHANGE`
  });
};

export const clearTempCustomAttrs = () => dispatch => {
  dispatch({
    type: "liveNodeEdit/CLEAR_TEMP_CUSTOM_ATTRS",
    payload: null,
    local_msg: true
  });
};

export const changeSelectedCategory = cat => dispatch => {
  dispatch({
    type: "liveNodeEdit/CHANGE_SELECTED_CATEGORY",
    payload: cat,
    local_msg: true
  });
};

export const handleCheckboxChange = (checks, selNodeId) => dispatch => {
  dispatch({
    type: "liveNodeEdit/HANDLE_CHECKBOX_CHANGE",
    payload: checks,
    addnl_payload: selNodeId,
    broadcast: "liveNodeEdit/LOCKED_NODE_CHECKBOX_CHANGE"
  });
};
export const editNewCategoryName = name => dispatch => {
  dispatch({
    type: "liveNodeEdit/EDIT_NEW_CATEGORY_NAME",
    payload: name,
    local_msg: true
  });
};

export const selectNode = node => dispatch => {
  dispatch({
    type: "SELECT_NODE",
    payload: node,
    broadcast: "LOCK_NODE",
    addnl_payload: node
  });
};
