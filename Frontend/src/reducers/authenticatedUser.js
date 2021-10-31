import { toastAction } from "actions/toastActions";
import { IS_STOP, LOGIN } from "../containers";

export const auth = (state = {}, { type, payload }) => {

    switch (type) {
        case LOGIN:
            localStorage.setItem("user", JSON.stringify(payload.data));
            return {
                user: payload.data   
            }
    
        default:
            return {
                ...state,
            }
    }
}

export const isStop = ( state = false, { type, payload, asyncDispatch } ) => {

    switch (type) {
        case IS_STOP:
            asyncDispatch(toastAction('success', payload.data === true ? 'is stoped' : 'is not stoped'))
            return payload.data
    
        default:
            return false
    }
}
