export const populateCurrentNodeValues = vals => dispatch => {
  dispatch({
    type: "liveNodeEdit/POPULATE_CURRENT_NODE_VALUES",
    payload: vals
  });
};

export const editName = name => dispatch => {
  dispatch({
    type: "liveNodeEdit/EDIT_NAME",
    payload: name
  });
};

export const handleCheckboxChange = checks=> dispatch => {
  dispatch({
    type: "liveNodeEdit/HANDLE_CHECKBOX_CHANGE",
    payload: checks
  });
};
export const editNewCategoryName = name => dispatch => {
  dispatch({
    type: "liveNodeEdit/EDIT_NEW_CATEGORY_NAME",
    payload: name
  });
};

export const editFontSize = fontSize => dispatch => {
  dispatch({
    type: "liveNodeEdit/EDIT_FONT_SIZE",
    payload: fontSize
  });
};

export const editRadius = r => dispatch => {
  dispatch({
    type: "liveNodeEdit/EDIT_RADIUS",
    payload: r
  });
};

// export const saveEdit = values => dispatch => {
//   dispatch({
//     type: "liveNodeEdit/SAVE_EDIT",
//     payload: values
//   });
// };
