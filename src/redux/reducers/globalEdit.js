const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case "globalEdit/POPULATE_INITIAL_VALUES": {
      const defaults = action.payload;

      const controls = {
        chargeStrengthRangeMax: { customValue: null, defaultValue: 5000 }
      };

      defaults.controls = Object.assign(controls, defaults.controls);

      return { ...state, ...defaults };
    }
    case "globalEdit/HANDLE_CHECKBOX_CHANGE": {
      return { ...state, checkedAttrs: action.payload };
    }
    case `globalEdit/HANDLE_ATTRIBUTE_VALUE_CHANGE`: {
      const { section, key, value } = action.payload;
      return {
        ...state,
        [section]: {
          ...state[section],
          [key]: { ...state[section][key], customValue: value }
        }
      };
    }
    default:
      return state;
  }
};
