export const handleCheckboxChange = checks=> dispatch => {
    dispatch({
        type: "globalEdit/HANDLE_CHECKBOX_CHANGE",
        payload: checks
    });
};

export const editValue = (section_key_value) => dispatch => {
    dispatch({
        type: `globalEdit/HANDLE_ATTRIBUTE_VALUE_CHANGE`,
        payload: section_key_value
    });
};

export const populateInitialValues = (defaults) => dispatch => {
    dispatch({
        type: `globalEdit/POPULATE_INITIAL_VALUES`,
        payload: defaults
    });
};
