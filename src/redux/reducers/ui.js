const initialState = {
    alert: {
        show: false,
        msg: '',
        type: 'info',
    },
    selectedPage: null
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'SHOW_ALERT_MESSAGE':
            return {
                ...state,
                alert: {
                    show: true,
                    msg: action.payload.msg,
                    type: action.payload.type,
                },
            };
        case 'HIDE_ALERT_MESSAGE':
            return {
                ...state,
                alert: initialState.alert,
            };
            case 'UI_SELECT_PAGE':
            return {
                ...state,
                selectedPage: action.payload,
            };
        default:
            return state;
    }
}