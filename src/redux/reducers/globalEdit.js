const initialState = {
    checkedAttrs: ['radiusRangeMax'],
    radius: null,
    radiusRangeMax: null,
    fontSize: null,
    chargeStrength: null,
    linkDistance: null,
    defaults: {
        radius: 30,
        radiusRangeMin: 0,
        radiusRangeMax: 500,
        fontSize: 30,
        chargeStrength: -320,
        linkDistance: 300,
        bgColor: 'powderblue',
        sideMenuOpenOnInit: true,
        goToEditNodePageWhenNodeIsClicked: true,
        nodeColor: 'blue',
        nodeHoverColor: 'green',
        seeLinksOverlapNodes: true,

    }
};

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
            const {key, value} = action.payload
            return { ...state, [key]: value };
        }
        default:
            return state;
    }
};
