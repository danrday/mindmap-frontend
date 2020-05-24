export const getUser = channel => dispatch => {
  console.log("USER INFO FIRING?");

  channel
    .push("get_user_info")
    .receive("ok", msg => {
      console.log("USER INFO", msg);
      dispatch({
        type: "user/SET_USER",
        payload: msg
      });
    })
    .receive("error", e => {
      console.log("USER INFO ERROR", msg);

      dispatch({
        type: "user/SET_USER_ERROR",
        payload: e
      });
    });
};
