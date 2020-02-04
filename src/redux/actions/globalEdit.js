export const handleCheckboxChange = checks=> dispatch => {
    dispatch({
        type: "globalEdit/HANDLE_CHECKBOX_CHANGE",
        payload: checks
    });
};

export const editValue = (keyAndValue) => dispatch => {
    dispatch({
        type: `globalEdit/HANDLE_ATTRIBUTE_VALUE_CHANGE`,
        payload: keyAndValue
    });
};
