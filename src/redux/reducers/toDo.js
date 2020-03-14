const initialState = {
    messages: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_TODO_REQUEST': {
            return state

        }
        case 'ADD_TODO_SUCCESS':
            return {
            ...state,
            messages: [...state.messages, {
                text: action.payload,
                completed: false
            }
            ]
        }

        case 'ADD_TODO_FAILURE':
            console.error('ADD_TODO_FAILURE');
            return state;

        case 'COMPLETE_TODO':
            return [
                ...state.slice(0, action.index),
                Object.assign({}, state[action.index], {
                    completed: true
                }),
                ...state.slice(action.index + 1)
            ];
        default:
            return state;
    }
}