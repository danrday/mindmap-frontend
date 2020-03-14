const initialState = {};

export default (state = initialState, action) => {
    switch (action.type) {
        case "globalEdit/POPULATE_INITIAL_VALUES": {
            const defaults = action.payload
            return { ...state, ...defaults };
        }
        case "globalEdit/HANDLE_CHECKBOX_CHANGE": {
            return { ...state, checkedAttrs: action.payload };
        }
        case `globalEdit/HANDLE_ATTRIBUTE_VALUE_CHANGE`: {
            const {section, key, value} = action.payload
            console.log('{section, key, value}', {section, key, value})
            console.log('[state[section]]', [state[section]])
            console.log('[state[section][key]]', [state[section][key]])
            console.log('[key]', [key][0])
            return { ...state, [section]: {...state[section], [key]: {...state[section][key], customValue: value} } };
        }
        default:
            return state;
    }
};
