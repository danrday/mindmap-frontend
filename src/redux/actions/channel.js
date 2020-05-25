export const dispatchMsg = msg => dispatch => {
  dispatch({
    type: msg.body.type,
    payload: msg.body.payload,
    addnl_payload: msg.body.addnl_payload,
    user_id: msg.user_id,
    server_msg: true,
    broadcast: msg.body.broadcast
  });
};
