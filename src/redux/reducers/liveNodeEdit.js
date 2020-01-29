const initialState = {
    selNodeId: null,
    name: null
};

export default (state = initialState, action) => {
    switch (action.type) {
        case "liveNodeEdit/POPULATE_CURRENT_NODE_VALUES":
            const { id, name } = action.payload
            console.log('action payload', action.payload)
            return { ...state, name: name, selNodeId: id};
        case "liveNodeEdit/EDIT_NAME":
            return { ...state, name: action.payload };
        default:
            return state;
    }
};
