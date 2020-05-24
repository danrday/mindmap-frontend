export const dispatchMsg = msg => dispatch => {
  dispatch({
    type: msg.body.type,
    payload: msg.body.payload,
    user_id: msg.user_id,
    server_msg: true,
    broadcast: msg.body.broadcast
  });
};
