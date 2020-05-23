export const dispatchMsg = msg => dispatch => {
  dispatch({
    type: msg.body.type,
    payload: msg.body.payload,
    audit: msg.body.audit,
    server_msg: true
  });
};
