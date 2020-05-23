export const dispatchMsg = msg => dispatch => {
  dispatch({
    type: msg.body.type,
    payload: msg.body.payload,
    audit: msg.body.audit,
    server_msg: true
  });
};

export const emitDrag = msg => dispatch => {
  dispatch({
    type: "file/RECEIVE_DRAGGED_NODE",
    payload: msg,
    server_msg: "everyone_but_me"
  });
};
