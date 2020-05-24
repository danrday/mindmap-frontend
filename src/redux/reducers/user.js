const initialState = {
  user: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "user/SET_USER":
      return {
        ...state,
        user: action.payload
      };
    default:
      return state;
  }
};
