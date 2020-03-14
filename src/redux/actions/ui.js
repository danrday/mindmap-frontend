export const showAlertMessage = (msg, type = 'info') => {
    return {
        type: 'SHOW_ALERT_MESSAGE',
        payload: {
            show: true,
            msg,
            type,
        }
    };
}

export const hideAlertMessage = () => {
    return {
        type: 'HIDE_ALERT_MESSAGE',
    };
}

export const selectPage = pageName => dispatch => {
    dispatch({
        type: "UI_SELECT_PAGE",
        payload: pageName
    });
};

