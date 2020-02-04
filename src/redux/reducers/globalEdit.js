const initialState = {
    radius: null,
    fontSize: null,
    checkedAttrs: [],
};

export default (state = initialState, action) => {
    switch (action.type) {
        case "globalEdit/HANDLE_CHECKBOX_CHANGE": {
            return { ...state, checkedAttrs: action.payload };
        }
        case `globalEdit/HANDLE_ATTRIBUTE_VALUE_CHANGE`: {
            const {key, value} = action.payload
            return { ...state, [key]: value };
        }
        default:
            return state;
    }
};
