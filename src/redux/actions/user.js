export const getUser = channel => dispatch => {
  channel
    .push("get_user_info")
    .receive("ok", msg => {
      dispatch({
        type: "user/SET_USER",
        payload: msg
      });
    })
    .receive("error", e => {
      dispatch({
        type: "user/SET_USER_ERROR",
        payload: e
      });
    });
};
