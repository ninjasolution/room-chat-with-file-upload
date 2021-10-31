import { ADD_MESSAGE } from "containers"
import { toastAction } from "./toastActions";

export const receivedMessageAction = msg => 
    (dispatch, getState) => {
        const store = getState();
        if(store.auth.user.whoAmI === 'admin') return;
        if(msg.target === store.auth.user.role && msg.from !== store.auth.user.userName) {
            dispatch(addMessage(msg));
            dispatch(toastAction('success', 'A new message is arrived for you!'))
        }
    }

export const addMessage = msg => ({ type: ADD_MESSAGE, payload: { data: msg } })