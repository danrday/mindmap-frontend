export const showAlertMessage = (msg, type = "info") => dispatch => {
  dispatch({
    type: "SHOW_ALERT_MESSAGE",
    payload: {
      show: true,
      msg,
      type
    }
  });
};

export const hideAlertMessage = () => {
  return {
    type: "HIDE_ALERT_MESSAGE"
  };
};

export const handleMouseMove = coords => dispatch => {
  dispatch({
    type: "HANDLE_MOUSE_MOVE",
    payload: coords,
    broadcast: "BROADCAST_MOUSE_MOVE"
  });
};

export const selectPage = (pageName, prevPage) => dispatch => {
  console.log("SELECT PAGEe", pageName, prevPage);

  dispatch({
    type: "UI_SELECT_PAGE",
    payload: pageName,
    addnl_payload: prevPage,
    broadcast: "UI_LOCK_PAGE"
  });
};
