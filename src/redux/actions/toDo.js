// import socket from "../socket"
import {Socket} from "phoenix"
let socket = new Socket("ws://localhost:4000/socket", {params: {token: window.userToken}})
socket.connect()

// Now that you are connected, you can join channels with a topic:
let channel           = socket.channel("room:lobby", {})
// let chatInput         = document.querySelector("#chat-input")
// let messagesContainer = document.querySelector("#messages")

// chatInput.addEventListener("keypress", event => {
//     if(event.keyCode === 13){
//         channel.push("new_msg", {body: chatInput.value})
//         chatInput.value = ""
//     }
// })

channel.on("new_msg", payload => {
    console.log('new msg', payload)
    // let messageItem = document.createElement("li")
    // messageItem.innerText = `[${Date()}] ${payload.body}`
    // messagesContainer.appendChild(messageItem)
})



channel.join()
    .receive("ok", resp => { console.log("Joined successfully", resp) })
    .receive("error", resp => { console.log("Unable to join", resp) })


export const addTodoRequest = text => {
    return {type: "ADD_TODO_REQUEST", text}
}


export const addTodoSuccess = text => {
    return {type: "ADD_TODO_SUCCESS", text}
}


export const addTodoFailure = (text, error) => {
    return {type: "ADD_TODO_FAILURE", text, error}
}

export const receiveToDo = payload => dispatch => {
    dispatch(addTodoSuccess(payload))
}


export const addTodo = text => dispatch => {
    channel.push("new_msg", {body: text})

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