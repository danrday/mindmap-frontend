export const changeSelectedCategory = (cat) => dispatch => {
    dispatch({
        type: "categoryEdit/changeSelectedCategory",
        payload: cat
    });
};

export const handleCheckboxChange = checks=> dispatch => {
    dispatch({
        type: "categoryEdit/HANDLE_CHECKBOX_CHANGE",
        payload: checks
    });
};

export const editValue = (keyAndValue) => dispatch => {
    dispatch({
        type: `categoryEdit/HANDLE_ATTRIBUTE_VALUE_CHANGE`,
        payload: keyAndValue
    });
};


