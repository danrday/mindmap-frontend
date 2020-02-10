const initialState = {
    alert: {
        show: false,
        msg: '',
        type: 'info',
    },
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
        default:
            return state;
    }
}