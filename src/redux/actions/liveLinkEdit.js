export const populateCurrentLinkValues = vals => dispatch => {
  dispatch({
    type: "liveLinkEdit/POPULATE_CURRENT_LINK_VALUES",
    payload: vals,
    broadcast: "liveLinkEdit/POPULATE_LOCKED_LINK_VALUES"
  });
};

export const editName = (name, selLinkId) => dispatch => {
  dispatch({
    type: "liveLinkEdit/EDIT_NAME",
    payload: name,
    addnl_payload: selLinkId,
    broadcast: "liveLinkEdit/LOCKED_LINK_NAME"
  });
};
export const clearTempCustomAttrs = () => dispatch => {
  dispatch({
    type: "liveLinkEdit/CLEAR_TEMP_CUSTOM_ATTRS",
    payload: null,
    local_msg: true
  });
};

export const changeSelectedCategory = cat => dispatch => {
  dispatch({
    type: "liveLinkEdit/CHANGE_SELECTED_CATEGORY",
    payload: cat,
    local_msg: true
  });
};

export const handleCheckboxChange = (checks, selLinkId) => dispatch => {
  dispatch({
    type: "liveLinkEdit/HANDLE_CHECKBOX_CHANGE",
    payload: checks,
    addnl_payload: selLinkId,
    broadcast: "liveLinkEdit/LOCKED_LINK_CHECKBOX_CHANGE"
  });
};
export const editNewCategoryName = name => dispatch => {
  dispatch({
    type: "liveLinkEdit/EDIT_NEW_CATEGORY_NAME",
    payload: name,
    local_msg: true
  });
};

export const editFontSize = fontSize => dispatch => {
  dispatch({
    type: "liveLinkEdit/EDIT_FONT_SIZE",
    payload: fontSize,
    local_msg: true
  });
};

export const selectLink = link => dispatch => {
  dispatch({
    type: "SELECT_LINK",
    payload: link,
    broadcast: "LOCK_LINK",
    addnl_payload: link
  });
};
