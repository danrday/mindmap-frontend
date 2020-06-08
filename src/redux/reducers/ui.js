const initialState = {
  alert: {
    show: false,
    msg: "",
    type: "info"
  },
  selectedPage: null,
  lockedPages: [],
  mouseCoords: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "HANDLE_MOUSE_MOVE":
      let mouseCoords = Object.assign({}, state.mouseCoords);
      mouseCoords.self = action.payload;

      return {
        ...state,
        mouseCoords: mouseCoords
      };
    case "BROADCAST_MOUSE_MOVE":
      return {
        ...state,
        mouse: {
          coords: action.payload.coords,
          username: action.payload.username
        }
      };
    case "SHOW_ALERT_MESSAGE":
      return {
        ...state,
        alert: {
          show: true,
          msg: action.payload.msg,
          type: action.payload.type
        }
      };
    case "HIDE_ALERT_MESSAGE":
      return {
        ...state,
        alert: initialState.alert
      };
    case "UI_SELECT_PAGE":
      return {
        ...state,
        selectedPage: action.payload
      };
    case "UI_LOCK_PAGE":
      let pagesToLock = [3, 4];
      console.log("UI LOCK PAGE", action);
      let page = action.payload;
      let prevPage = action.addnl_payload;

      let newLockedPages = state.lockedPages;
      let exists = state.lockedPages.findIndex(p => page === p);

      let prevPageLocked = state.lockedPages.findIndex(p => prevPage === p);

      if (prevPageLocked !== -1) {
        newLockedPages.splice(prevPageLocked, 1);
      }
      if (exists === -1 && pagesToLock.includes(page)) {
        newLockedPages.push(page);
      }
      return {
        ...state,
        lockedPages: newLockedPages
      };
    default:
      return state;
  }
};
