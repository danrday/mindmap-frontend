import socket from "../socket"


export const addTodoRequest = text => {
    return {type: "ADD_TODO_REQUEST", text}
}


export const addTodoSuccess = text => {
    return {type: "ADD_TODO_SUCCESS", text}
}


export const addTodoFailure = (text, error) => {
    return {type: "ADD_TODO_FAILURE", text, error}
}


export const addTodo = text => dispatch => {
    dispatch(addTodoRequest(text));

    let payload = {
        text: text
    };

    // channel.push('new:todo', payload)
    //     .receive('ok', response => {
    //         console.log('created TODO', response);
    //         // dispatch(addTodoSuccess(text));
    //     })
    //     .receive('error', error => {
    //         console.error(error);
    //         dispatch(addTodoFailure(text, error));
    //     });

    // dispatch(addTodoSuccess(text));
    // dispatch(addTodoFailure(text));
    // dispatch({
    //     type: "ADD_TODO_REQUEST",
    //     payload: text
    // });
    // dispatch({
    //     type: "ADD_TODO_SUCCESS",
    //     payload: text
    // });
    // dispatch({
    //     type: "ADD_TODO_SUCCESS",
    //     payload: text
    // });
};

export function subscribeTodos() {
    return dispatch => {
        // channel.on('new:todo', msg => {
        //     console.log('new:todo', msg);
        //     dispatch(addTodoSuccess(msg.text));
        // });
    };
}

export const completeTodo = index => {
    return { type: 'COMPLETE_TODO', index };
}