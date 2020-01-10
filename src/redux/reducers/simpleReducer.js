const initialState = {
  file: null,
  fetching: false,
  error: null,
  result: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "file/FETCH_FILE_ERROR":
      return { ...state, error: action.payload, fetching: false };
    case "file/UPDATE_FILE":
      return { ...state, file: action.payload };
    case "file/FETCH_FILE":
      return { ...state, fetching: true };
    case "file/FETCH_FILE_RECEIVED":
      return {
        ...state,
        file: action.payload,
        fetching: false
      };
    case "SIMPLE_ACTION":
      return {
        ...state,
        result: action.payload
      };
    default:
      return state;
  }
};
