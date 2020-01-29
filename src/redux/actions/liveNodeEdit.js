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
